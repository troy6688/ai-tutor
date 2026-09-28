# -*- coding: utf-8 -*-
"""加载并缓存 backend/data/kb.json，作为全学段唯一数据源。"""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
KB_PATH = DATA_DIR / "kb.json"

_DATA = None


def load_kb():
    """读取 kb.json（带缓存）。返回 {"meta": {...}, "knowledge_points": [...]}"""
    global _DATA
    if _DATA is None:
        with open(KB_PATH, "r", encoding="utf-8") as f:
            _DATA = json.load(f)
    return _DATA


def reload_kb():
    """强制重新加载（数据更新后调用）。"""
    global _DATA
    _DATA = None
    return load_kb()


def get_points(grade=None):
    """返回知识点列表，可按学段（小学/初中/高中）筛选。"""
    points = load_kb()["knowledge_points"]
    if grade:
        points = [p for p in points if p.get("grade") == grade]
    return points


def get_point(point_id):
    """按 id 取单个知识点，找不到返回 None。"""
    for p in get_points():
        if p["id"] == point_id:
            return p
    return None


def list_grades():
    """返回数据中出现的学段列表（按出现顺序去重）。"""
    seen, grades = set(), []
    for p in get_points():
        g = p.get("grade", "")
        if g and g not in seen:
            seen.add(g)
            grades.append(g)
    return grades