# -*- coding: utf-8 -*-
"""当前用户学习统计接口。"""
from fastapi import APIRouter, Depends

import db
from store import get_points
from deps import get_current_user

router = APIRouter(prefix="/api", tags=["stats"])


@router.get("/stats")
def get_stats(user: dict = Depends(get_current_user)):
    """返回当前用户的学习统计：总知识点、已学、正确率、分学段进度、最近练习。"""
    progress = db.get_user_progress(user["id"])  # {point_id_str: {point_id,correct,total,score}}
    all_points = get_points()
    title_by_id = {p["id"]: p for p in all_points}

    total_answered = 0
    correct_sum = 0
    recent = []
    grade_done = {}
    grade_total = {}
    for p in all_points:
        g = p.get("grade", "其他")
        grade_total[g] = grade_total.get(g, 0) + 1
    for pid_str, rec in progress.items():
        pid = rec.get("point_id")
        total_answered += rec.get("total", 0)
        correct_sum += rec.get("correct", 0)
        p = title_by_id.get(pid, {})
        g = p.get("grade", "其他")
        grade_done[g] = grade_done.get(g, 0) + 1
        recent.append({
            "point_id": pid,
            "title": p.get("title", "知识点 " + str(pid)),
            "unit": p.get("chapter", ""),
            "grade": g,
            "correct": rec.get("correct", 0),
            "total": rec.get("total", 0),
            "score": rec.get("score", 0),
            "updated_at": rec.get("updated_at", ""),
        })
    # 数据库已按 updated_at DESC 排序，这里直接取前 N 条即可
    recent = recent[:10]

    return {
        "code": 0,
        "message": "ok",
        "data": {
            "total_points": len(all_points),
            "learned_count": len(progress),
            "correct_rate": round(correct_sum / total_answered * 100, 1) if total_answered else 0,
            "total_answered": total_answered,
            "by_grade": {
                g: {"done": grade_done.get(g, 0), "total": grade_total.get(g, 0)}
                for g in grade_total
            },
            "recent": recent,
        },
    }
