# -*- coding: utf-8 -*-
"""从 data_source/全学段知识点.xlsx 生成 backend/data/kb.json（全学段统一数据源）。

用法（在 ai-tutor 目录下执行）：
  python scripts/import_xlsx.py
"""
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path

import openpyxl

HERE = Path(__file__).resolve().parent   # ai-tutor/scripts/
PROJECT = HERE.parent                    # ai-tutor/
XLSX_PATH = PROJECT / "data_source" / "全学段知识点.xlsx"
OUT_PATH = PROJECT / "backend" / "data" / "kb.json"

# 题目标签 → 标准 type
TAG_MAP = {
    "单选": "choice", "选择": "choice", "选择题": "choice",
    "判断": "judge", "判断题": "judge",
    "多选": "multi", "多选题": "multi",
    "计算": "calc", "填空": "calc", "简答": "calc", "解答": "calc",
}
# 小学的“一、选择题”这类分区标题 → 标准 type
SECTION_MAP = {
    "选择题": "choice", "单选题": "choice",
    "判断题": "judge", "判断": "judge",
    "多选题": "multi",
    "填空题": "calc", "计算题": "calc", "简答题": "calc",
}


def split_answer(raw):
    """把“答案：”后的内容拆成 (答案, 解析)。兼容“正确。解析：xxx”这类答案里夹带解析。"""
    raw = (raw or "").strip()
    m = re.split(r"[。.]\s*解析[:：]", raw, maxsplit=1)
    if len(m) == 2:
        return m[0].strip(), m[1].strip()
    return raw, ""


def normalize_judge(ans):
    """判断题答案统一归一化成 对/错。"""
    a = ans.split("（")[0].split("(")[0].strip()
    a = a.rstrip("。.")  # 去掉末尾句号（如“正确。”）
    if a in ("√", "对", "正确", "是", "true", "True"):
        return "对"
    if a in ("×", "X", "x", "错", "错误", "否", "不对", "false", "False"):
        return "错"
    return a


def normalize_choice(ans):
    """选择/多选题答案，提取 A-D 字母串。"""
    letters = re.findall(r"[A-D]", ans)
    return "".join(letters) if letters else ans.strip()


def _clean_stem(stem):
    """去掉题干末尾的答题占位括号（如“（　）”）。"""
    return re.sub(r"[（(]\s*[）)]\s*$", "", stem).strip()


def parse_quiz(text):
    """解析一个知识点的“课后练习”字符串，返回结构化题目列表。"""
    text = (text or "").strip()
    if not text:
        return []
    questions = []
    cur_type = None
    cur = None

    def flush():
        nonlocal cur
        if cur is not None and cur["stem"]:
            typ = cur["type"] or ("choice" if cur["options"] else "judge")
            ans = cur["answer"]
            if typ == "judge":
                ans = normalize_judge(ans)
            elif typ in ("choice", "multi"):
                ans = normalize_choice(ans)
            questions.append({
                "type": typ,
                "stem": _clean_stem(cur["stem"]),
                "options": cur["options"],
                "answer": ans,
                "explanation": cur["explanation"],
            })
        cur = None

    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        # 小学的分区标题：一、选择题 / 二、判断题
        m_sec = re.match(r"^[一二三四五六七八九十]+、(.+)$", line)
        if m_sec and not re.match(r"^\d", line):
            cur_type = SECTION_MAP.get(m_sec.group(1).strip())
            continue
        # 题目起始行：1.【单选】题干 或 1. 题干
        m = re.match(r"^(\d+)[\.、．]\s*(.*)$", line)
        if m:
            flush()
            stem = m.group(2).strip()
            cur = {"type": None, "stem": stem, "options": [], "answer": "", "explanation": ""}
            m2 = re.match(r"^【(.+?)】\s*(.*)$", stem)
            if m2:
                cur["type"] = TAG_MAP.get(m2.group(1).strip())
                cur["stem"] = m2.group(2).strip()
            else:
                cur["type"] = cur_type
            continue
        if cur is None:
            continue
        # 选项行（选项前缀统一为英文点 A./B./C./D.）
        if re.match(r"^[A-D]\.", line):
            for part in re.split(r"(?=[A-D]\.)", line):
                part = part.strip()
                if part:
                    cur["options"].append(part)
            continue
        # 答案行
        if line.startswith("答案：") or line.startswith("答案:"):
            raw = line.split("：", 1)[-1] if "：" in line else line.split(":", 1)[-1]
            cur["answer"], cur["explanation"] = split_answer(raw)
            continue
        # 独立解析行
        if line.startswith("解析：") or line.startswith("解析:"):
            cur["explanation"] = (line.split("：", 1)[-1] if "：" in line else line.split(":", 1)[-1]).strip()
            continue
    flush()
    return questions


def main():
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb["全学段知识点"]
    rows = list(ws.iter_rows(min_row=2, values_only=True))

    # 学段列是合并单元格，只有每段首行有值，需向前填充
    grades = []
    cur_grade = None
    for r in rows:
        if r[0]:
            cur_grade = str(r[0]).strip()
        grades.append(cur_grade)

    points = []
    grade_stat = Counter()
    type_stat = Counter()
    untyped = []
    for i, r in enumerate(rows):
        grade = grades[i] or ""
        grade_stat[grade] += 1
        ch_sec = str(r[1] or "").strip()
        if ">" in ch_sec:
            chapter, section = [s.strip() for s in ch_sec.split(">", 1)]
        else:
            chapter, section = ch_sec, ""
        quiz = parse_quiz(r[5])
        for q in quiz:
            type_stat[q["type"]] += 1
            if q["type"] is None:
                untyped.append((i + 2, r[2]))
        points.append({
            "id": i + 1,
            "grade": grade,
            "chapter": chapter,
            "section": section,
            "title": str(r[2] or "").strip(),
            "content": str(r[3] or "").strip(),
            "keywords": [k.strip() for k in re.split(r"[,，、]", str(r[4] or "")) if k.strip()],
            "video": "",
            "quiz": quiz,
        })

    data = {
        "meta": {
            "total": len(points),
            "grades": dict(grade_stat),
            "generated_at": datetime.now().isoformat(timespec="seconds"),
        },
        "knowledge_points": points,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("知识点数:", len(points), dict(grade_stat))
    print("题目类型分布:", dict(type_stat))
    print("总题目数:", sum(type_stat.values()))
    print("无法识别题型:", len(untyped))
    for it in untyped[:20]:
        print("   ", it)
    print("已生成:", OUT_PATH)


if __name__ == "__main__":
    main()