# -*- coding: utf-8 -*-
"""AI 通识知识库后端入口（FastAPI）。

启动：
  cd ai-tutor/backend
  uvicorn main:app --reload --port 8000
"""
import os
import time
import logging
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from routers import catalog, chat, progress, quiz
from routers import auth, stats, animations, tts
import db

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ai-tutor")

app = FastAPI(title="AI通识知识库", version="1.1.0")

# 启动时建库建表
db.init_db()

# 启动时做每日备份（如果今天还没备份过）
try:
    backup_path = db.ensure_daily_backup()
    logger.info(f"数据库备份完成: {backup_path}")
except Exception as e:
    logger.warning(f"数据库备份失败（不影响服务）: {e}")

# CORS：生产环境收紧，只允许同域和常见本地开发端口
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
if ALLOWED_ORIGINS == ["*"]:
    # 默认开放（方便部署），但建议生产环境设置具体域名
    _allow_all = True
else:
    _allow_all = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    allow_credentials=False,
    max_age=86400,
)


# 统一错误响应中间件：把 HTTPException 转成 {code, message, data} 格式
class UnifiedResponseMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            # FastAPI 的 HTTPException 会被它自己的异常处理器处理
            # 这里兜底捕获未处理的异常
            status = getattr(e, "status_code", 500)
            detail = getattr(e, "detail", str(e))
            return JSONResponse(
                status_code=status,
                content={"code": 1, "message": str(detail), "data": None},
            )

app.add_middleware(UnifiedResponseMiddleware)


# 请求日志中间件：记录每个 API 请求的耗时和状态
class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 只记录 API 请求，不记录静态资源
        path = request.url.path
        is_api = path.startswith("/api/")
        if not is_api:
            return await call_next(request)

        start = time.time()
        client_ip = request.client.host if request.client else "unknown"
        method = request.method

        try:
            response = await call_next(request)
            elapsed = round((time.time() - start) * 1000, 1)
            status = response.status_code
            # 只记录 info 级别，4xx/5xx 用 warning/error
            if status >= 500:
                logger.error(f"{client_ip} {method} {path} -> {status} ({elapsed}ms)")
            elif status >= 400:
                logger.warning(f"{client_ip} {method} {path} -> {status} ({elapsed}ms)")
            else:
                logger.info(f"{client_ip} {method} {path} -> {status} ({elapsed}ms)")
            return response
        except Exception as e:
            elapsed = round((time.time() - start) * 1000, 1)
            logger.error(f"{client_ip} {method} {path} -> ERROR: {e} ({elapsed}ms)")
            raise

app.add_middleware(RequestLogMiddleware)


# 静态资源缓存中间件：JS/CSS/图片缓存1小时，HTML不缓存
class CacheControlMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        path = request.url.path
        # 静态资源缓存
        if path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf')):
            response.headers['Cache-Control'] = 'public, max-age=3600'  # 1小时
        elif path.endswith('.html') or path == '/' or path.endswith('/'):
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

app.add_middleware(CacheControlMiddleware)

# 业务路由
app.include_router(catalog.router)
app.include_router(quiz.router)
app.include_router(chat.router)
app.include_router(progress.router)
app.include_router(auth.router)
app.include_router(stats.router)
app.include_router(animations.router)
app.include_router(tts.router)


@app.get("/api/health")
def health():
    """健康检查。"""
    return {"code": 0, "message": "ok", "data": {"status": "up", "version": "1.1.0"}}


# 静态资源：/assets 视频等，/ 前端页面
ROOT = Path(__file__).resolve().parent.parent
app.mount("/assets", StaticFiles(directory=str(ROOT / "assets")), name="assets")
app.mount("/", StaticFiles(directory=str(ROOT / "frontend"), html=True), name="frontend")
