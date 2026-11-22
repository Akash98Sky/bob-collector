import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "civic_pulse.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('POTHOLE', 'GARBAGE', 'STREETLIGHT', 'WATERLOGGING', 'OTHER')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    description TEXT,

    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address_label TEXT,

    reported_image_url TEXT NOT NULL,
    resolved_image_url TEXT,

    upvote_count INTEGER NOT NULL DEFAULT 1,

    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_issues_status_upvotes
    ON issues (status, upvote_count DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS issue_upvotes (
    issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    PRIMARY KEY (issue_id, device_id)
);
"""


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(SCHEMA)
