# System Design — Civic Pulse

## 1. Functional Requirements (MVP Scope)

### Citizen Flows

**FR-1 — Create Issue**
A user can submit an issue with a required photo, GPS coordinates (lat, lng), category, and an optional short text note.

**FR-2 — View & Filter Issues**
A user can fetch a list of reported issues filtered by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) and category, sorted by newest or highest upvotes.

**FR-3 — Upvote / Confirm Issue**
A user can upvote an existing issue once per browser/device (enforced via a client-generated `device_id` UUID stored in `localStorage`) to signal urgency without creating a duplicate ticket.

**FR-4 — Inspect Issue & Proof**
A user can view a single issue's full details, including the original photo, current status, location metadata, and the resolution photo once closed.

### Authority / Admin Flows

**FR-5 — Triage Queue**
An operator can view all issues sorted by `upvote_count DESC` to prioritize high-impact complaints.

**FR-6 — Update Status & Upload Proof**
An operator can transition an issue's status (`OPEN → IN_PROGRESS → RESOLVED`). Transitioning to `RESOLVED` requires attaching a `resolved_image_url`.

---

## 2. Database Design (SQLite)

SQLite is used for zero-config local development — no server process, no migration tooling required. All types map to SQLite's flexible affinity system: UUIDs are stored as `TEXT` (generated in application code), timestamps as `TEXT` in ISO-8601 format, and coordinates as `REAL`.

```sql
-- 1. Core Issues Table
CREATE TABLE issues (
    id TEXT PRIMARY KEY,                          -- UUID generated in app (e.g. Python uuid.uuid4())
    category TEXT NOT NULL CHECK (category IN ('POTHOLE', 'GARBAGE', 'STREETLIGHT', 'WATERLOGGING', 'OTHER')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    description TEXT,

    -- Location data
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address_label TEXT,                           -- Reverse-geocoded street/area name

    -- Media URLs (stored on local disk or any CDN)
    reported_image_url TEXT NOT NULL,
    resolved_image_url TEXT,

    -- Denormalized counter for fast sorting without JOINs
    upvote_count INTEGER NOT NULL DEFAULT 1,

    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    resolved_at TEXT
);

-- Index for fast feed filtering and admin priority sorting
CREATE INDEX idx_issues_status_upvotes ON issues (status, upvote_count DESC, created_at DESC);

-- 2. Upvotes Table (Prevents duplicate clicks per browser)
CREATE TABLE issue_upvotes (
    issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    PRIMARY KEY (issue_id, device_id)
);
```

---

## 3. API Contracts (REST)

**Base URL:** `/api/v1` | **Content-Type:** `application/json` (except file upload)

---

### 3.1 Upload Image

Handles raw camera photo uploads and returns a hosted URL before form submission (keeps the `POST /issues` payload clean JSON).

**Endpoint:** `POST /upload`

**Request** (`multipart/form-data`):
| Field | Type | Constraint |
|-------|------|------------|
| `file` | binary image | max 5 MB |

**Response `200 OK`:**
```json
{
  "url": "https://cdn.example.com/issues/9f8a7b6c.jpg"
}
```

---

### 3.2 List Issues (Home Feed & Admin Queue)

**Endpoint:** `GET /issues`

**Query Parameters** (all optional):
| Param | Values |
|-------|--------|
| `status` | `OPEN` \| `IN_PROGRESS` \| `RESOLVED` |
| `category` | `POTHOLE` \| `GARBAGE` \| `STREETLIGHT` \| `WATERLOGGING` \| `OTHER` |
| `sort` | `recent` *(default)* \| `upvotes` |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "category": "POTHOLE",
      "status": "OPEN",
      "description": "Deep crater right before the signal",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "address_label": "100 Feet Rd, Indiranagar",
      "reported_image_url": "https://cdn.example.com/issues/9f8a7b6c.jpg",
      "resolved_image_url": null,
      "upvote_count": 14,
      "created_at": "2026-11-22T06:30:00Z"
    }
  ]
}
```

---

### 3.3 Create Issue

**Endpoint:** `POST /issues`

**Request Body:**
```json
{
  "category": "GARBAGE",
  "description": "Overflowing pile blocking the footpath",
  "latitude": 12.9352,
  "longitude": 77.6245,
  "address_label": "4th Block, Koramangala",
  "reported_image_url": "https://cdn.example.com/issues/1a2b3c4d.jpg",
  "device_id": "browser-uuid-1234"
}
```

**Response `201 Created`:** Returns the newly created issue object.

> The creator's `device_id` is automatically recorded in `issue_upvotes` and `upvote_count` is initialized to `1`.

---

### 3.4 Get Single Issue Detail

**Endpoint:** `GET /issues/:id`

**Query Parameters** (optional):
| Param | Purpose |
|-------|---------|
| `device_id` | Checks if this browser has already upvoted |

**Response `200 OK`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "category": "POTHOLE",
  "status": "RESOLVED",
  "description": "Deep crater right before the signal",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address_label": "100 Feet Rd, Indiranagar",
  "reported_image_url": "https://cdn.example.com/issues/9f8a7b6c.jpg",
  "resolved_image_url": "https://cdn.example.com/issues/fixed-999.jpg",
  "upvote_count": 15,
  "has_upvoted": true,
  "created_at": "2026-11-22T06:30:00Z",
  "resolved_at": "2026-11-22T11:45:00Z"
}
```

---

### 3.5 Upvote ("Me Too") an Issue

**Endpoint:** `POST /issues/:id/upvote`

**Request Body:**
```json
{
  "device_id": "browser-uuid-5678"
}
```

**Backend Logic:** Runs `INSERT INTO issue_upvotes ... ON CONFLICT DO NOTHING`. If a row was inserted, increments `issues.upvote_count` by `1`.

**Response `200 OK`:**
```json
{
  "issue_id": "550e8400-e29b-41d4-a716-446655440000",
  "upvote_count": 16,
  "has_upvoted": true
}
```

---

### 3.6 Update Issue Status (Admin Triage)

**Endpoint:** `PATCH /issues/:id/status`

**Request Body:**
```json
{
  "status": "RESOLVED",
  "resolved_image_url": "https://cdn.example.com/issues/fixed-999.jpg"
}
```

**Validation Rule:** Return `400 Bad Request` if `status === "RESOLVED"` and `resolved_image_url` is missing or empty. Set `resolved_at = NOW()` when marked `RESOLVED`.

**Response `200 OK`:** Returns the updated issue object.
