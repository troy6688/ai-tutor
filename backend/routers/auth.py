# -*- coding: utf-8 -*-
"""用户注册 / 登录 / 当前用户 / 退出。"""
import re

from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel

import db
from deps import get_current_user, check_login_rate_limit, record_login_failure, clear_login_failures

router = APIRouter(prefix="/api/auth", tags=["auth"])


class CredIn(BaseModel):
    username: str
    password: str


def token_of(request: Request) -> str:
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:].strip()
    return ""


def current_user(request: Request):
    user = db.get_user_by_token(token_of(request))
    if not user:
        raise HTTPException(status_code=401, detail="未登录或登录已过期")
    return user


@router.post("/register")
def register(req: CredIn, request: Request):
    name = (req.username or "").strip()
    pwd = req.password or ""
    if len(name) < 2:
        return {"code": 1, "message": "用户名至少 2 个字", "data": None}
    if len(name) > 20:
        return {"code": 1, "message": "用户名不能超过 20 个字", "data": None}
    if not re.match(r'^[a-zA-Z0-9_\u4e00-\u9fa5]+$', name):
        return {"code": 1, "message": "用户名只能包含字母、数字、下划线和中文", "data": None}
    if len(pwd) < 6:
        return {"code": 1, "message": "密码至少 6 位", "data": None}
    if len(pwd) > 64:
        return {"code": 1, "message": "密码不能超过 64 位", "data": None}
    u = db.create_user(name, pwd)
    if not u:
        db.add_audit_log(None, "register_fail", f"用户名已存在: {name}",
                         request.client.host if request.client else None,
                         request.headers.get("user-agent", ""))
        return {"code": 1, "message": "这个用户名已经被注册了", "data": None}
    token = db.create_session(u["id"])
    db.add_audit_log(u["id"], "register", f"注册成功: {name}",
                     request.client.host if request.client else None,
                     request.headers.get("user-agent", ""))
    return {"code": 0, "message": "ok", "data": {"token": token, "user": {"id": u["id"], "name": u["username"]}}}


@router.post("/login")
def login(req: CredIn, request: Request):
    username = (req.username or "").strip()
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")

    # 先检查是否超过限流
    if not check_login_rate_limit(username):
        db.add_audit_log(None, "login_rate_limited", f"用户: {username}", ip, ua)
        return {"code": 1, "message": "登录失败次数太多，请 5 分钟后再试", "data": None}

    u = db.get_user_by_name(username)
    if not u or not db.verify_password(req.password or "", u["salt"], u["password_hash"]):
        record_login_failure(username)
        db.add_audit_log(None, "login_fail", f"用户: {username}", ip, ua)
        return {"code": 1, "message": "用户名或密码错误", "data": None}

    # 登录成功，清除失败记录
    clear_login_failures(username)
    token = db.create_session(u["id"])
    db.add_audit_log(u["id"], "login", "", ip, ua)
    return {"code": 0, "message": "ok", "data": {"token": token, "user": {"id": u["id"], "name": u["username"]}}}


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"code": 0, "message": "ok", "data": {"id": user["id"], "name": user["username"]}}


@router.post("/logout")
def logout(request: Request):
    t = token_of(request)
    if t:
        # 记录登出日志（通过 token 找用户）
        user = db.get_user_by_token(t)
        if user:
            db.add_audit_log(user["id"], "logout", "",
                             request.client.host if request.client else None,
                             request.headers.get("user-agent", ""))
        db.clear_session(t)
    return {"code": 0, "message": "ok", "data": None}
