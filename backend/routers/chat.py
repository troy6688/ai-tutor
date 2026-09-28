# -*- coding: utf-8 -*-
"""AI 对话接口（通义千问，OpenAI 兼容协议）。"""
import os

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

import db
from deps import get_current_user

router = APIRouter(prefix="/api", tags=["chat"])

# 密钥从环境变量读取，禁止硬编码
API_KEY = os.environ.get("DASHSCOPE_API_KEY") or os.environ.get("QWEN_API_KEY", "")
BASE_URL = os.environ.get("DASHSCOPE_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
MODEL = os.environ.get("LLM_MODEL", "qwen-plus")

SYSTEM_PROMPT = (
    "你是一名面向中小学生的 AI 通识课助教。"
    "回答要通俗、准确、友好，多用生活化比喻，避免超纲术语；"
    "若涉及知识点，可简要说明它属于哪个学段（小学/初中/高中）。"
)


class ChatRequest(BaseModel):
    message: str
    grade: str = "小学"
    session_key: str = "default"
    history: list = []  # 可选：前端自己传历史；不传则从数据库读


@router.post("/chat")
def chat(req: ChatRequest, user: dict = Depends(get_current_user)):
    """AI 对话。未配置 API Key 时返回友好提示，不报错。"""
    # 如果前端没传 history，从数据库读历史
    history = req.history
    if not history:
        db_history = db.get_chat_history(user["id"], req.session_key, limit=20)
        history = [{"role": h["role"], "content": h["content"]} for h in db_history]

    # 保存用户消息
    db.add_chat_message(user["id"], req.session_key, "user", req.message)

    if not API_KEY:
        reply = "暂时还没接通大模型哦，请稍后再试～"
        db.add_chat_message(user["id"], req.session_key, "assistant", reply)
        return {"code": 1, "message": "未配置大模型密钥", "data": {"reply": reply}}

    messages = [{"role": "system", "content": f"{SYSTEM_PROMPT}\n当前学段：{req.grade}"}]
    messages += history
    messages.append({"role": "user", "content": req.message})
    try:
        import requests  # 惰性导入，避免未安装时影响启动

        resp = requests.post(
            f"{BASE_URL}/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"model": MODEL, "messages": messages},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        reply = data["choices"][0]["message"]["content"]
        # 保存 AI 回复
        db.add_chat_message(user["id"], req.session_key, "assistant", reply)
        return {"code": 0, "message": "ok", "data": {"reply": reply}}
    except Exception as e:  # 网络或接口异常时兜底，不抛 500
        reply = "抱歉，我现在有点忙，请稍后再试～"
        db.add_chat_message(user["id"], req.session_key, "assistant", reply)
        return {"code": 1, "message": f"对话服务调用失败: {e}", "data": {"reply": reply}}


@router.get("/chat/history/{session_key}")
def get_history(session_key: str, user: dict = Depends(get_current_user), limit: int = Query(50, ge=1, le=100)):
    """获取某个会话的聊天历史。"""
    history = db.get_chat_history(user["id"], session_key, limit=limit)
    return {"code": 0, "message": "ok", "data": {"history": history}}


@router.get("/chat/sessions")
def list_sessions(user: dict = Depends(get_current_user), limit: int = Query(20, ge=1, le=50)):
    """获取用户的聊天会话列表。"""
    sessions = db.get_chat_sessions(user["id"], limit=limit)
    return {"code": 0, "message": "ok", "data": {"sessions": sessions}}


@router.delete("/chat/history/{session_key}")
def delete_session(session_key: str, user: dict = Depends(get_current_user)):
    """删除某个会话的聊天记录。"""
    db.delete_chat_session(user["id"], session_key)
    return {"code": 0, "message": "ok", "data": None}
