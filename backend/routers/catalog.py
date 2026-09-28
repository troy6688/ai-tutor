# -*- coding: utf-8 -*-
"""目录与知识点详情接口。"""
from pathlib import Path

from fastapi import APIRouter, HTTPException

from store import get_point, get_points, list_grades

router = APIRouter(prefix="/api", tags=["catalog"])

# 视频目录：ai-tutor/assets/videos/
VIDEOS_DIR = Path(__file__).resolve().parent.parent.parent / "assets" / "videos"


def _resolve_video(p):
    """返回知识点视频文件名；video 字段为空时按约定命名自动发现。"""
    video = p.get("video", "")
    if video:
        return video
    for name in (f"kp{p['id']:02d}.mp4", f"kp{p['id']}.mp4"):
        if (VIDEOS_DIR / name).exists():
            return name
    return ""


@router.get("/catalog")
def get_catalog(grade: str = None):
    """章节目录树：chapter -> section -> points，可按学段筛选。"""
    units = []
    for p in get_points(grade):
        chapter = p.get("chapter", "").strip()
        section = p.get("section", "").strip()
        unit = next((u for u in units if u["chapter"] == chapter), None)
        if unit is None:
            unit = {"chapter": chapter, "sections": []}
            units.append(unit)
        sec = next((s for s in unit["sections"] if s["section"] == section), None)
        if sec is None:
            sec = {"section": section, "points": []}
            unit["sections"].append(sec)
        sec["points"].append({"id": p["id"], "title": p["title"], "grade": p.get("grade")})
    return {
        "code": 0,
        "message": "ok",
        "data": {
            "grades": list_grades(),
            "total": len(get_points(grade)),
            "units": units,
        },
    }


@router.get("/points/{point_id}")
def get_point_detail(point_id: int):
    """知识点详情（含讲解、关键词、视频、题目数量，不含题目答案）。"""
    p = get_point(point_id)
    if p is None:
        raise HTTPException(status_code=404, detail="知识点不存在")
    return {
        "code": 0,
        "message": "ok",
        "data": {
            "id": p["id"],
            "grade": p.get("grade"),
            "chapter": p["chapter"],
            "section": p.get("section", ""),
            "title": p["title"],
            "content": p["content"],
            "keywords": p.get("keywords", []),
            "video": _resolve_video(p),
            "animation": p.get("animation", ""),
            "quiz_count": len(p.get("quiz", [])),
        },
    }