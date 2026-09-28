@echo off
chcp 65001 >nul
title AI智课
cd /d "%~dp0backend"

if not exist ".venv\Scripts\python.exe" (
    echo 未找到Python运行环境，请先完成项目安装。
    pause
    exit /b 1
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:8000'"

".venv\Scripts\python.exe" -m uvicorn main:app --port 8000

pause
