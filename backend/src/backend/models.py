from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared enums (as Literal unions — no enum class, per erasableSyntaxOnly)
# ---------------------------------------------------------------------------

Category = Literal["POTHOLE", "GARBAGE", "STREETLIGHT", "WATERLOGGING", "OTHER"]
Status = Literal["OPEN", "IN_PROGRESS", "RESOLVED"]
SortOrder = Literal["recent", "upvotes"]


# ---------------------------------------------------------------------------
# Issue schemas
# ---------------------------------------------------------------------------

class IssueCreate(BaseModel):
    category: Category
    description: Optional[str] = Field(None, max_length=280)
    latitude: float
    longitude: float
    address_label: Optional[str] = None
    reported_image_url: str
    device_id: str


class IssueResponse(BaseModel):
    id: str
    category: Category
    status: Status
    description: Optional[str]
    latitude: float
    longitude: float
    address_label: Optional[str]
    reported_image_url: str
    resolved_image_url: Optional[str]
    upvote_count: int
    created_at: str
    resolved_at: Optional[str] = None
    # Only present on single-issue detail endpoint
    has_upvoted: Optional[bool] = None


class IssueListResponse(BaseModel):
    data: list[IssueResponse]


# ---------------------------------------------------------------------------
# Status update schema
# ---------------------------------------------------------------------------

class StatusUpdate(BaseModel):
    status: Status
    resolved_image_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Upvote schemas
# ---------------------------------------------------------------------------

class UpvoteRequest(BaseModel):
    device_id: str


class UpvoteResponse(BaseModel):
    issue_id: str
    upvote_count: int
    has_upvoted: bool


# ---------------------------------------------------------------------------
# Upload schema
# ---------------------------------------------------------------------------

class UploadResponse(BaseModel):
    url: str
