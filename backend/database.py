"""
database.py — SQLite database connection and schema creation.

Uses Python's built-in sqlite3 module. No ORM or additional dependencies.

Key design decisions:
- PRAGMA foreign_keys = ON is set on every connection (SQLite default is OFF).
- row_factory = sqlite3.Row for dict-like row access.
- Tables are created in dependency order to satisfy foreign-key references.
"""

import os
import sqlite3

# Default database path: airbnb.db in the same directory as this file (or DATABASE_PATH env var)
DEFAULT_DB_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "airbnb.db"),
)


def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    """
    Open a SQLite connection with foreign-key enforcement enabled.

    SQLite does NOT enforce foreign keys by default — the pragma must be
    executed on every new connection.
    """
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def create_tables(conn: sqlite3.Connection) -> None:
    """Create all application tables if they do not already exist."""
    cur = conn.cursor()

    # ── 1. users ──────────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT    NOT NULL,
            email      TEXT    NOT NULL UNIQUE,
            role       TEXT    NOT NULL DEFAULT 'guest'
                               CHECK (role IN ('guest', 'host', 'both')),
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # ── 2. listings ───────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS listings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            host_id         INTEGER NOT NULL REFERENCES users(id),
            title           TEXT    NOT NULL,
            description     TEXT    NOT NULL,
            city            TEXT    NOT NULL,
            country         TEXT    NOT NULL,
            latitude        REAL,
            longitude       REAL,
            price_per_night REAL    NOT NULL,
            cleaning_fee    REAL    NOT NULL DEFAULT 0,
            max_guests      INTEGER NOT NULL DEFAULT 1,
            is_active       BOOLEAN NOT NULL DEFAULT 1,
            created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # ── 3. listing_images ─────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS listing_images (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER NOT NULL REFERENCES listings(id),
            url        TEXT    NOT NULL,
            caption    TEXT,
            position   INTEGER NOT NULL DEFAULT 0
        )
    """)

    # ── 4. amenities ──────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS amenities (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT    NOT NULL UNIQUE
        )
    """)

    # ── 5. listing_amenities (many-to-many) ───────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS listing_amenities (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER NOT NULL REFERENCES listings(id),
            amenity_id INTEGER NOT NULL REFERENCES amenities(id),
            UNIQUE (listing_id, amenity_id)
        )
    """)

    # ── 6. bookings ───────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id   INTEGER NOT NULL REFERENCES listings(id),
            guest_id     INTEGER NOT NULL REFERENCES users(id),
            check_in     TEXT    NOT NULL,
            check_out    TEXT    NOT NULL,
            nightly_rate REAL    NOT NULL,
            nights       INTEGER NOT NULL,
            cleaning_fee REAL    NOT NULL DEFAULT 0,
            service_fee  REAL    NOT NULL DEFAULT 0,
            total_price  REAL    NOT NULL,
            created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # ── 7. reviews ────────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER NOT NULL REFERENCES listings(id),
            user_id    INTEGER NOT NULL REFERENCES users(id),
            rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comment    TEXT,
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """)

    # ── 8. favorites ──────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id),
            listing_id INTEGER NOT NULL REFERENCES listings(id),
            created_at TEXT    NOT NULL DEFAULT (datetime('now')),
            UNIQUE (user_id, listing_id)
        )
    """)

    conn.commit()


def init_db(db_path: str | None = None) -> sqlite3.Connection:
    """Create the database, all tables, and return the connection."""
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    create_tables(conn)
    return conn
