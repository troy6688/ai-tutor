# -*- coding: utf-8 -*-
"""答题进度记录接口（按用户隔离，SQLite 存储）。"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

import db
from deps import get_current_user

router = APIRouter(prefix="/api", tags=["progress"])


class ProgressIn(BaseModel):
    point_id: int
    correct: int = Field(0, ge=0)
    total: int = Field(0, ge=0)


@router.get("/progress")
def get_progress(user: dict = Depends(get_current_user)):
    """返回当前登录用户的全部答题进度（按知识点 id 组织）。"""
    return {"code": 0, "message": "ok", "data": db.get_user_progress(user["id"])}


@router.post("/progress")
def save_progress(req: ProgressIn, user: dict = Depends(get_current_user)):
    """保存/更新当前用户某知识点的答题进度。"""
    # 输入校验：correct 不能超过 total
    if req.correct > req.total:
        return {"code": 1, "message": "正确数不能超过总数", "data": None}
    if req.total < 0:
        return {"code": 1, "message": "题目总数不能为负", "data": None}
    item = db.upsert_progress(user["id"], req.point_id, req.correct, req.total)
    return {"code": 0, "message": "ok", "data": item}
