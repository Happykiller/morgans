from typing import Optional

import strawberry


@strawberry.type
class BulkJobResponse:
    job_id: str


@strawberry.type
class BulkJobError:
    email: Optional[str]
    error: str


@strawberry.type
class BulkJobStatus:
    id: str
    status: str
    total: int
    sent: int
    failed: int
    errors: list[BulkJobError]
    started_at: Optional[str]
    completed_at: Optional[str]
