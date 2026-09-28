# -*- coding: utf-8 -*-
"""取题与判分接口（支持单选、多选、判断、计算/填空）。"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

from store import get_point
from deps import get_current_user
import db

router = APIRouter(prefix="/api", tags=["quiz"])

# 判断题答案归一化映射
_JUDGE_MAP = {
    "对": "对", "√": "对", "正确": "对", "是": "对", "T": "对", "TRUE": "对",
    "错": "错", "×": "错", "X": "错", "错误": "错", "否": "错", "F": "错", "FALSE": "错",
}


def _trim(s):
    return (s or "").strip()


def _norm_judge(s):
    return _JUDGE_MAP.get(_trim(s).upper(), _trim(s))


def _grade_one(q, user):
    """判一题，返回是否答对。"""
    typ = q.get("type", "choice")
    if typ == "multi":
        return set(_trim(user).upper()) == set(_trim(q["answer"]).upper())
    if typ == "judge":
        return _norm_judge(user) == _norm_judge(q["answer"])
    if typ == "calc":
        return _trim(user) == _trim(q["answer"])
    return _trim(user).upper() == _trim(q["answer"]).upper()


@router.get("/points/{point_id}/quiz")
def get_quiz(point_id: int):
    """返回某知识点的题目（不含答案，供前端"回答问题"窗口使用）。

    注意：取题不需要登录（公开题库），但判分和保存进度需要登录。
    """
    p = get_point(point_id)
    if p is None:
        raise HTTPException(status_code=404, detail="知识点不存在")
    items = [
        {"type": q["type"], "stem": q["stem"], "options": q.get("options", [])}
        for q in p.get("quiz", [])
    ]
    return {"code": 0, "message": "ok", "data": {"point_id": point_id, "quiz": items}}


class GradeRequest(BaseModel):
    point_id: int
    answers: list  # 与题目顺序一致的用户答案列表


@router.post("/quiz/grade")
def grade_quiz(req: GradeRequest, request: Request, user: dict = Depends(get_current_user)):
    """提交作答并判分：返回每题正误、正确答案、解析与总分。

    需要登录；判分后自动更新用户的知识点进度。
    """
    p = get_point(req.point_id)
    if p is None:
        raise HTTPException(status_code=404, detail="知识点不存在")
    quiz = p.get("quiz", [])
    # 限制 answers 数量不超过题目数
    answers = req.answers[:len(quiz)] if req.answers else []
    results = []
    correct_count = 0
    for i, q in enumerate(quiz):
        user_ans = answers[i] if i < len(answers) else ""
        ok = _grade_one(q, user_ans)
        correct_count += 1 if ok else 0
        results.append({
            "index": i,
            "type": q["type"],
            "correct": ok,
            "user_answer": user_ans,
            "answer": q["answer"],
            "explanation": q.get("explanation", ""),
        })
    total = len(quiz)

    # 自动保存进度（取历史最高分）
    try:
        progress = db.get_user_progress(user["id"])
        key = str(req.point_id)
        prev = progress.get(key, {})
        prev_score = prev.get("score", 0) or 0
        new_score = round(correct_count / total * 100, 1) if total else 0
        # 只记录最高分
        if new_score >= prev_score:
            db.upsert_progress(user["id"], req.point_id, correct_count, total)
        # 记录审计日志
        db.add_audit_log(
            user["id"], "quiz_submit",
            f"知识点 {req.point_id}: {correct_count}/{total} ({new_score}分)",
            request.client.host if request.client else None,
            request.headers.get("user-agent", ""),
        )
    except Exception:
        pass  # 进度保存失败不影响判分结果

    return {
        "code": 0,
        "message": "ok",
        "data": {
            "point_id": req.point_id,
            "correct": correct_count,
            "total": total,
            "score": round(correct_count / total * 100, 1) if total else 0,
            "results": results,
        },
    }
