# -*- coding: utf-8 -*-
"""公共依赖：用户认证、限流等。"""
import time
import threading
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import db

security = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """从 Bearer Token 获取当前用户，未登录抛出 401。"""
    if not credentials:
        raise HTTPException(status_code=401, detail="未登录")
    token = credentials.credentials
    user = db.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="未登录或登录已过期")
    return user


# ---------- 简单内存限流（登录防暴力破解） ----------
_login_attempts = {}  # {username: [timestamp, ...]}
_login_lock = threading.Lock()
MAX_ATTEMPTS = 5       # 5 分钟内最多 5 次失败
WINDOW_SECONDS = 300   # 5 分钟窗口


def check_login_rate_limit(username: str) -> bool:
    """检查是否超过登录失败限制。返回 True 表示允许继续。"""
    now = time.time()
    with _login_lock:
        attempts = _login_attempts.get(username, [])
        # 清理窗口外的记录
        attempts = [t for t in attempts if now - t < WINDOW_SECONDS]
        _login_attempts[username] = attempts
        return len(attempts) < MAX_ATTEMPTS


def record_login_failure(username: str):
    """记录一次登录失败。"""
    now = time.time()
    with _login_lock:
        attempts = _login_attempts.get(username, [])
        attempts.append(now)
        _login_attempts[username] = attempts


def clear_login_failures(username: str):
    """登录成功后清除失败记录。"""
    with _login_lock:
        _login_attempts.pop(username, None)
