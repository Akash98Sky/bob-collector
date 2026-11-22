import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.database import get_connection
from backend.models import (
    Category,
    IssueCreate,
    IssueListResponse,
    IssueResponse,
    SortOrder,
    Status,
    StatusUpdate,
    UpvoteRequest,
    UpvoteResponse,
)

router = APIRouter()


def _row_to_issue(row: object) -> IssueResponse:
    """Convert a sqlite3.Row to an IssueResponse."""
    return IssueResponse(
        id=row["id"],
        category=row["category"],
        status=row["status"],
        description=row["description"],
        latitude=row["latitude"],
        longitude=row["longitude"],
        address_label=row["address_label"],
        reported_image_url=row["reported_image_url"],
        resolved_image_url=row["resolved_image_url"],
        upvote_count=row["upvote_count"],
        created_at=row["created_at"],
        resolved_at=row["resolved_at"],
    )


# ---------------------------------------------------------------------------
# GET /issues
# ---------------------------------------------------------------------------

@router.get("/issues", response_model=IssueListResponse)
def list_issues(
    status: Optional[Status] = Query(None),
    category: Optional[Category] = Query(None),
    sort: SortOrder = Query("recent"),
) -> IssueListResponse:
    query = "SELECT * FROM issues WHERE 1=1"
    params: list[object] = []

    if status:
        query += " AND status = ?"
        params.append(status)
    if category:
        query += " AND category = ?"
        params.append(category)

    if sort == "upvotes":
        query += " ORDER BY upvote_count DESC, created_at DESC"
    else:
        query += " ORDER BY created_at DESC"

    with get_connection() as conn:
        rows = conn.execute(query, params).fetchall()

    return IssueListResponse(data=[_row_to_issue(r) for r in rows])


# ---------------------------------------------------------------------------
# POST /issues
# ---------------------------------------------------------------------------

@router.post("/issues", response_model=IssueResponse, status_code=201)
def create_issue(body: IssueCreate) -> IssueResponse:
    issue_id = str(uuid.uuid4())

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO issues
                (id, category, status, description, latitude, longitude,
                 address_label, reported_image_url, upvote_count)
            VALUES (?, ?, 'OPEN', ?, ?, ?, ?, ?, 1)
            """,
            (
                issue_id,
                body.category,
                body.description,
                body.latitude,
                body.longitude,
                body.address_label,
                body.reported_image_url,
            ),
        )
        # Record the creator's device_id as the first upvote
        conn.execute(
            "INSERT OR IGNORE INTO issue_upvotes (issue_id, device_id) VALUES (?, ?)",
            (issue_id, body.device_id),
        )
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()

    return _row_to_issue(row)


# ---------------------------------------------------------------------------
# GET /issues/:id
# ---------------------------------------------------------------------------

@router.get("/issues/{issue_id}", response_model=IssueResponse)
def get_issue(
    issue_id: str,
    device_id: Optional[str] = Query(None),
) -> IssueResponse:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Issue not found.")

        has_upvoted: Optional[bool] = None
        if device_id:
            upvote = conn.execute(
                "SELECT 1 FROM issue_upvotes WHERE issue_id = ? AND device_id = ?",
                (issue_id, device_id),
            ).fetchone()
            has_upvoted = upvote is not None

    issue = _row_to_issue(row)
    issue.has_upvoted = has_upvoted
    return issue


# ---------------------------------------------------------------------------
# POST /issues/:id/upvote
# ---------------------------------------------------------------------------

@router.post("/issues/{issue_id}/upvote", response_model=UpvoteResponse)
def upvote_issue(issue_id: str, body: UpvoteRequest) -> UpvoteResponse:
    with get_connection() as conn:
        exists = conn.execute(
            "SELECT 1 FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()
        if exists is None:
            raise HTTPException(status_code=404, detail="Issue not found.")

        cursor = conn.execute(
            "INSERT OR IGNORE INTO issue_upvotes (issue_id, device_id) VALUES (?, ?)",
            (issue_id, body.device_id),
        )
        # Only increment the counter when a new row was actually inserted
        if cursor.rowcount == 1:
            conn.execute(
                "UPDATE issues SET upvote_count = upvote_count + 1 WHERE id = ?",
                (issue_id,),
            )

        row = conn.execute(
            "SELECT upvote_count FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()

    return UpvoteResponse(
        issue_id=issue_id,
        upvote_count=row["upvote_count"],
        has_upvoted=True,
    )


# ---------------------------------------------------------------------------
# PATCH /issues/:id/status
# ---------------------------------------------------------------------------

@router.patch("/issues/{issue_id}/status", response_model=IssueResponse)
def update_status(issue_id: str, body: StatusUpdate) -> IssueResponse:
    if body.status == "RESOLVED" and not body.resolved_image_url:
        raise HTTPException(
            status_code=400,
            detail="resolved_image_url is required when setting status to RESOLVED.",
        )

    with get_connection() as conn:
        exists = conn.execute(
            "SELECT 1 FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()
        if exists is None:
            raise HTTPException(status_code=404, detail="Issue not found.")

        if body.status == "RESOLVED":
            conn.execute(
                """
                UPDATE issues
                SET status = ?,
                    resolved_image_url = ?,
                    resolved_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
                WHERE id = ?
                """,
                (body.status, body.resolved_image_url, issue_id),
            )
        else:
            conn.execute(
                "UPDATE issues SET status = ? WHERE id = ?",
                (body.status, issue_id),
            )

        row = conn.execute("SELECT * FROM issues WHERE id = ?", (issue_id,)).fetchone()

    return _row_to_issue(row)
