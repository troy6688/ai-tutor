# -*- coding: utf-8 -*-
"""SQLite 用户、会话与学习记录存储。"""
import sqlite3
import hashlib
import secrets
import threading
from pathlib import Path
from datetime import datetime, timedelta

DB_PATH = Path(__file__).resolve().parent / "data" / "app.db"
_lock = threading.Lock()


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with _lock:
        conn = get_conn()
        c = conn.cursor()
        c.executescript("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            salt TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions(
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS progress(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            point_id INTEGER NOT NULL,
            correct INTEGER DEFAULT 0,
            total INTEGER DEFAULT 0,
            score REAL DEFAULT 0,
            updated_at TEXT NOT NULL,
            UNIQUE(user_id, point_id)
        );
        """)
        # 兼容旧数据库：如果 sessions 表没有 expires_at 字段则添加
        try:
            c.execute("SELECT expires_at FROM sessions LIMIT 1")
        except sqlite3.OperationalError:
            c.execute("ALTER TABLE sessions ADD COLUMN expires_at TEXT NOT NULL DEFAULT ''")

        # chat_history 表：旧表结构是 question/answer，新表结构是 session_key/role/content
        # 检查旧表是否存在且没有 session_key 字段
        try:
            c.execute("SELECT session_key FROM chat_history LIMIT 1")
            # 走到这里说明新表已存在，直接建索引
            c.execute("CREATE INDEX IF NOT EXISTS idx_chat_user_session ON chat_history(user_id, session_key)")
        except sqlite3.OperationalError:
            # 旧表结构，重命名后创建新表
            try:
                c.execute("ALTER TABLE chat_history RENAME TO chat_history_old")
            except sqlite3.OperationalError:
                pass  # 可能表名已经被改过了
            c.execute("""
                CREATE TABLE chat_history(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_key TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)
            c.execute("CREATE INDEX IF NOT EXISTS idx_chat_user_session ON chat_history(user_id, session_key)")

        # 操作日志表
        c.execute("""
            CREATE TABLE IF NOT EXISTS audit_logs(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                detail TEXT,
                ip TEXT,
                user_agent TEXT,
                created_at TEXT NOT NULL
            )
        """)
        c.execute("CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action)")

        conn.commit()
        conn.close()


def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(8)
    h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 200000)
    return salt, h.hex()


def verify_password(password, salt, password_hash):
    _, h = hash_password(password, salt)
    return secrets.compare_digest(h, password_hash)


def create_user(username, password):
    salt, pwhash = hash_password(password)
    with _lock:
        conn = get_conn()
        try:
            conn.execute(
                "INSERT INTO users(username,salt,password_hash,created_at) VALUES(?,?,?,?)",
                (username, salt, pwhash, datetime.now().isoformat()),
            )
            conn.commit()
            row = conn.execute("SELECT id,username FROM users WHERE username=?", (username,)).fetchone()
            return dict(row)
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()


def get_user_by_name(username):
    conn = get_conn()
    row = conn.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
    conn.close()
    return dict(row) if row else None


def create_session(user_id, expire_days=7):
    token = secrets.token_hex(16)
    now = datetime.now()
    expires = (now + timedelta(days=expire_days)).isoformat()
    with _lock:
        conn = get_conn()
        conn.execute(
            "INSERT INTO sessions(token,user_id,created_at,expires_at) VALUES(?,?,?,?)",
            (token, user_id, now.isoformat(), expires),
        )
        conn.commit()
        conn.close()
    return token


def clear_session(token):
    if not token:
        return
    with _lock:
        conn = get_conn()
        conn.execute("DELETE FROM sessions WHERE token=?", (token,))
        conn.commit()
        conn.close()


def get_user_by_token(token):
    if not token:
        return None
    with _lock:
        conn = get_conn()
        row = conn.execute(
            "SELECT u.id,u.username,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?",
            (token,),
        ).fetchone()
        if not row:
            conn.close()
            return None
        # 检查是否过期
        expires_at = row["expires_at"]
        if expires_at:
            try:
                exp_dt = datetime.fromisoformat(expires_at)
                if datetime.now() > exp_dt:
                    # 已过期，清除
                    conn.execute("DELETE FROM sessions WHERE token=?", (token,))
                    conn.commit()
                    conn.close()
                    return None
            except (ValueError, TypeError):
                pass  # 时间格式不对的话先放行（兼容旧数据）
        conn.close()
        return {"id": row["id"], "username": row["username"]}


def get_user_progress(user_id):
    conn = get_conn()
    rows = conn.execute(
        "SELECT point_id,correct,total,score,updated_at FROM progress WHERE user_id=? ORDER BY updated_at DESC",
        (user_id,),
    ).fetchall()
    conn.close()
    return {str(r["point_id"]): dict(r) for r in rows}


def upsert_progress(user_id, point_id, correct, total):
    score = round(correct / total * 100, 1) if total else 0
    with _lock:
        conn = get_conn()
        conn.execute(
            """INSERT INTO progress(user_id,point_id,correct,total,score,updated_at) VALUES(?,?,?,?,?,?)
               ON CONFLICT(user_id,point_id) DO UPDATE SET
                 correct=excluded.correct,total=excluded.total,score=excluded.score,updated_at=excluded.updated_at""",
            (user_id, point_id, correct, total, score, datetime.now().isoformat()),
        )
        conn.commit()
        conn.close()
    return {"point_id": point_id, "correct": correct, "total": total, "score": score}


# ---------- 聊天历史 ----------
def add_chat_message(user_id, session_key, role, content):
    """添加一条聊天消息。"""
    with _lock:
        conn = get_conn()
        conn.execute(
            "INSERT INTO chat_history(user_id,session_key,role,content,created_at) VALUES(?,?,?,?,?)",
            (user_id, session_key, role, content, datetime.now().isoformat()),
        )
        conn.commit()
        conn.close()


def get_chat_history(user_id, session_key, limit=50):
    """获取某个会话的聊天历史（按时间正序）。"""
    conn = get_conn()
    rows = conn.execute(
        "SELECT role,content,created_at FROM chat_history WHERE user_id=? AND session_key=? ORDER BY id ASC LIMIT ?",
        (user_id, session_key, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_chat_sessions(user_id, limit=20):
    """获取用户的聊天会话列表（按最近消息时间倒序）。"""
    conn = get_conn()
    rows = conn.execute(
        """SELECT session_key, MAX(created_at) as last_time, COUNT(*) as msg_count
           FROM chat_history WHERE user_id=? GROUP BY session_key ORDER BY last_time DESC LIMIT ?""",
        (user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def delete_chat_session(user_id, session_key):
    """删除某个会话的所有消息。"""
    with _lock:
        conn = get_conn()
        conn.execute(
            "DELETE FROM chat_history WHERE user_id=? AND session_key=?",
            (user_id, session_key),
        )
        conn.commit()
        conn.close()


# ---------- 审计日志 ----------
def add_audit_log(user_id, action, detail=None, ip=None, user_agent=None):
    """记录一条操作日志。"""
    with _lock:
        conn = get_conn()
        conn.execute(
            "INSERT INTO audit_logs(user_id,action,detail,ip,user_agent,created_at) VALUES(?,?,?,?,?,?)",
            (user_id, action, detail, ip, user_agent, datetime.now().isoformat()),
        )
        conn.commit()
        conn.close()


def get_audit_logs(user_id=None, action=None, limit=100):
    """查询操作日志。"""
    conn = get_conn()
    query = "SELECT * FROM audit_logs WHERE 1=1"
    params = []
    if user_id is not None:
        query += " AND user_id=?"
        params.append(user_id)
    if action is not None:
        query += " AND action=?"
        params.append(action)
    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ---------- 数据库备份 ----------
BACKUP_DIR = DB_PATH.parent / "backups"
MAX_DAILY_BACKUPS = 7  # 保留最近 7 天的每日备份


def backup_database():
    """创建数据库备份，返回备份文件路径。

    使用 SQLite 内置的 backup API，保证备份过程中数据一致性。
    每天只保留一份最新备份，最多保留 7 天。
    """
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    # 按日期命名
    date_str = datetime.now().strftime("%Y%m%d")
    backup_file = BACKUP_DIR / f"app_{date_str}.db"

    with _lock:
        # 用 SQLite 官方备份 API（安全、一致性）
        src = sqlite3.connect(DB_PATH)
        dst = sqlite3.connect(backup_file)
        try:
            src.backup(dst)
        finally:
            dst.close()
            src.close()

    # 清理旧备份（保留最近 7 天）
    try:
        backups = sorted(BACKUP_DIR.glob("app_*.db"), reverse=True)
        for old in backups[MAX_DAILY_BACKUPS:]:
            old.unlink()
    except Exception:
        pass  # 清理失败不影响备份结果

    return str(backup_file)


def list_backups():
    """列出所有备份文件（最新在前）。"""
    if not BACKUP_DIR.exists():
        return []
    backups = []
    for f in sorted(BACKUP_DIR.glob("app_*.db"), reverse=True):
        try:
            stat = f.stat()
            backups.append({
                "name": f.name,
                "size": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            })
        except Exception:
            pass
    return backups


def ensure_daily_backup():
    """确保今天已经做过备份（启动时调用）。"""
    date_str = datetime.now().strftime("%Y%m%d")
    backup_file = BACKUP_DIR / f"app_{date_str}.db"
    if backup_file.exists():
        return str(backup_file)
    return backup_database()
