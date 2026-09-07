import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import UPLOAD_DIR
from app.routes.listings import router as listings_router
from app.routes.bookings import router as bookings_router
from app.routes.favorites import router as favorites_router
from app.routes.reviews import router as reviews_router
from app.routes.host import router as host_router
from app.routes.amenities import router as amenities_router

app = FastAPI(
    title="Airbnb Clone API",
    description="Backend API for the Airbnb clone application.",
    version="0.1.0",
)

# CORS: allow the Next.js frontend (local dev and deployed origins).
# Exact origins are read from environment variables:
#   ALLOWED_ORIGINS  – comma-separated list of allowed origins
#   FRONTEND_URL     – single deployed frontend origin (Vercel production URL)
# Additionally, all *.vercel.app subdomains are allowed via regex so that
# Vercel preview deployments work without manual env-var updates.
_allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
_allowed_origins = [o.strip() for o in _allowed_origins_env.split(",") if o.strip()]
if not _allowed_origins:
    _allowed_origins = ["http://localhost:3000"]
elif "http://localhost:3000" not in _allowed_origins:
    _allowed_origins.append("http://localhost:3000")

_frontend_url = os.environ.get("FRONTEND_URL", "").strip()
if _frontend_url and _frontend_url not in _allowed_origins:
    _allowed_origins.append(_frontend_url)

# Regex covers all Vercel deployment URLs (production + previews) without
# needing per-deployment env-var changes.
_allow_origin_regex = r"https://.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=_allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings_router)
app.include_router(bookings_router)
app.include_router(favorites_router)
app.include_router(reviews_router)
app.include_router(host_router)
app.include_router(amenities_router)

# Serve uploaded static media files (from persistent volume /data/uploads or local backend/uploads)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    """Ensure tables exist and seed only if database is fresh/empty."""
    from database import DEFAULT_DB_PATH, create_tables, get_connection
    conn = get_connection(DEFAULT_DB_PATH)
    try:
        create_tables(conn)
        user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if user_count == 0:
            import seed
            print(f"Empty database detected at {DEFAULT_DB_PATH}. Populating initial seed dataset...")
            seed.populate_seed_data(conn)
    finally:
        conn.close()


@app.get("/api/health")
def health_check():
    """Return a simple health status to confirm the backend is running."""
    return {
        "status": "healthy",
        "message": "Airbnb Clone API is running",
    }
