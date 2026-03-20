"""
Система доступа Monster Holidays: проверка инвайтов, создание сессий, управление приглашениями.
"""
import json
import os
import uuid
import secrets
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors(body, status=200):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
        },
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return cors("")

    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    body = json.loads(event.get("body") or "{}") if isinstance(event.get("body"), str) else (event.get("body") or {})
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    # === Проверка инвайта и создание сессии ===
    if action == "use_invite":
        code = body.get("code", "").strip().upper()
        if not code:
            return cors({"error": "Введи код приглашения"}, 400)

        cur.execute(f"SELECT id, name, is_active FROM {schema}.invites WHERE code = %s", (code,))
        row = cur.fetchone()
        if not row:
            return cors({"error": "Код не найден. Попроси у автора новое приглашение 👻"}, 404)

        invite_id, name, is_active = row
        if not is_active:
            return cors({"error": "Это приглашение больше не действует 🎃"}, 403)

        token = secrets.token_urlsafe(32)
        cur.execute(
            f"INSERT INTO {schema}.sessions (token, invite_id, guest_name) VALUES (%s, %s, %s)",
            (token, invite_id, name)
        )
        cur.execute(f"UPDATE {schema}.invites SET used_at = NOW() WHERE id = %s", (invite_id,))
        conn.commit()
        conn.close()
        return cors({"token": token, "name": name})

    # === Проверка существующей сессии ===
    if action == "check_session":
        token = body.get("token", "")
        if not token:
            return cors({"valid": False}, 401)

        cur.execute(
            f"SELECT guest_name FROM {schema}.sessions WHERE token = %s AND expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if row:
            return cors({"valid": True, "name": row[0]})
        return cors({"valid": False}, 401)

    # === Админ: вход ===
    if action == "admin_login":
        password = body.get("password", "")
        if password == os.environ.get("ADMIN_PASSWORD", ""):
            admin_token = secrets.token_urlsafe(32)
            return cors({"admin_token": admin_token})
        return cors({"error": "Неверный пароль"}, 403)

    # === Админ: создать инвайт ===
    if action == "create_invite":
        if not _check_admin(body):
            return cors({"error": "Нет доступа"}, 403)
        name = body.get("name", "").strip()
        if not name:
            return cors({"error": "Укажи имя гостя"}, 400)
        code = secrets.token_hex(4).upper()
        cur.execute(
            f"INSERT INTO {schema}.invites (code, name) VALUES (%s, %s) RETURNING id, code",
            (code, name)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return cors({"id": str(row[0]), "code": row[1], "name": name})

    # === Админ: список инвайтов ===
    if action == "list_invites":
        if not _check_admin(body):
            return cors({"error": "Нет доступа"}, 403)
        cur.execute(
            f"SELECT id, code, name, created_at, used_at, is_active FROM {schema}.invites ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        conn.close()
        invites = [
            {"id": str(r[0]), "code": r[1], "name": r[2], "created_at": r[3], "used_at": r[4], "is_active": r[5]}
            for r in rows
        ]
        return cors({"invites": invites})

    # === Админ: деактивировать инвайт ===
    if action == "deactivate_invite":
        if not _check_admin(body):
            return cors({"error": "Нет доступа"}, 403)
        invite_id = body.get("invite_id")
        cur.execute(f"UPDATE {schema}.invites SET is_active = FALSE WHERE id = %s", (invite_id,))
        conn.commit()
        conn.close()
        return cors({"ok": True})

    conn.close()
    return cors({"error": "Неизвестное действие"}, 400)


def _check_admin(body: dict) -> bool:
    password = body.get("admin_password", "")
    return password == os.environ.get("ADMIN_PASSWORD", "")
