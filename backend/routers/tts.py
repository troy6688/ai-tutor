# -*- coding: utf-8 -*-
"""Edge-TTS 语音合成接口（微软神经网络语音）。"""
import hashlib
import asyncio
import io
import threading
from functools import lru_cache

from fastapi import APIRouter, Query, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

import db

router = APIRouter(prefix="/api", tags=["tts"])

# 语音配置
DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural"  # 晓晓，最自然的中文女声
VOICE_MAP = {
    "xiaoxiao": "zh-CN-XiaoxiaoNeural",
    "xiaoyi": "zh-CN-XiaoyiNeural",
    "yunjian": "zh-CN-YunjianNeural",
    "yunxi": "zh-CN-YunxiNeural",
    "yunyang": "zh-CN-YunyangNeural",
}

# ---------- 内存缓存 ----------
_cache_lock = threading.Lock()
_audio_cache = {}  # {cache_key: bytes}
MAX_CACHE_ENTRIES = 200  # 最多缓存 200 条，防止内存泄漏


def _cache_key(text: str, voice: str, rate: str) -> str:
    """生成缓存 key。"""
    raw = f"{voice}|{rate}|{text}"
    return hashlib.md5(raw.encode("utf-8")).hexdigest()


def _get_cache(key: str):
    with _cache_lock:
        return _audio_cache.get(key)


def _set_cache(key: str, data: bytes):
    with _cache_lock:
        if len(_audio_cache) >= MAX_CACHE_ENTRIES:
            # 简单 LRU：清掉一半旧的（用 dict 有序性，Python 3.7+）
            keys = list(_audio_cache.keys())
            for k in keys[:MAX_CACHE_ENTRIES // 2]:
                _audio_cache.pop(k, None)
        _audio_cache[key] = data


async def _synthesize(text: str, voice: str, rate: str) -> bytes:
    """调用 edge-tts 合成语音，返回 MP3 字节。"""
    import edge_tts  # 惰性导入

    communicate = edge_tts.Communicate(text, voice, rate=rate)
    audio_chunks = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
    return b"".join(audio_chunks)


@router.get("/tts")
async def tts(
    request: Request,
    text: str = Query(..., min_length=1, max_length=500),
    voice: str = Query("xiaoxiao"),
    rate: str = Query("+0%"),
    token: str = Query(""),
):
    """语音合成接口（需要登录）。

    支持两种方式传 token：
    1. Authorization: Bearer <token>（推荐）
    2. ?token=xxx（用于 <audio> 标签等无法设置 header 的场景）

    - text: 要合成的文本（1-500字）
    - voice: 音色，默认 xiaoxiao（晓晓）
    - rate: 语速，默认 +0%，范围 -50% ~ +50%
    """
    # 验证用户
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="未登录")
    user = db.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="未登录或登录已过期")
    # 参数校验
    voice_name = VOICE_MAP.get(voice.lower(), DEFAULT_VOICE)

    # 语速校验
    if not rate.endswith("%"):
        rate = "+0%"
    try:
        rate_val = int(rate[:-1])
        if rate_val < -50 or rate_val > 50:
            rate = "+0%"
    except ValueError:
        rate = "+0%"

    # 查缓存
    key = _cache_key(text, voice_name, rate)
    cached = _get_cache(key)
    if cached:
        return StreamingResponse(
            io.BytesIO(cached),
            media_type="audio/mpeg",
            headers={"Cache-Control": "public, max-age=86400", "X-Cache": "HIT"},
        )

    # 合成
    try:
        audio_data = await _synthesize(text, voice_name, rate)
    except ImportError:
        raise HTTPException(status_code=500, detail="TTS 服务未安装（edge-tts）")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"语音合成失败: {e}")

    if not audio_data:
        raise HTTPException(status_code=500, detail="语音合成返回空数据")

    # 存入缓存
    _set_cache(key, audio_data)

    return StreamingResponse(
        io.BytesIO(audio_data),
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=86400", "X-Cache": "MISS"},
    )


@router.get("/tts/voices")
def list_voices():
    """列出可用音色。"""
    return {
        "code": 0,
        "message": "ok",
        "data": {
            "voices": [
                {"id": "xiaoxiao", "name": "晓晓", "desc": "温柔女声（推荐）", "voice": VOICE_MAP["xiaoxiao"]},
                {"id": "xiaoyi", "name": "晓伊", "desc": "活泼女声", "voice": VOICE_MAP["xiaoyi"]},
                {"id": "yunjian", "name": "云健", "desc": "沉稳男声", "voice": VOICE_MAP["yunjian"]},
                {"id": "yunxi", "name": "云希", "desc": "阳光男声", "voice": VOICE_MAP["yunxi"]},
                {"id": "yunyang", "name": "云扬", "desc": "磁性男声", "voice": VOICE_MAP["yunyang"]},
            ],
            "default": "xiaoxiao",
        },
    }
