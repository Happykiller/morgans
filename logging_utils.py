"""Application logging utilities.

Centralizes logger setup and common helpers used across adapters.
"""

import logging
from datetime import datetime, timezone
from typing import Any


LOGGER_NAME = "morgans"


def configure_logging(log_level: str) -> None:
    """Configure root logging with a stable, machine-readable format."""
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    logging.basicConfig(
        level=numeric_level,
        format=(
            "%(asctime)sZ level=%(levelname)s logger=%(name)s "
            "event=%(event)s recipient=%(recipient)s subject=%(subject)s "
            "template=%(template)s status=%(status)s detail=%(detail)s"
        ),
        datefmt="%Y-%m-%dT%H:%M:%S",
        force=True,
    )


class SafeExtraAdapter(logging.LoggerAdapter):
    """Ensure expected log fields always exist for formatter safety."""

    _DEFAULTS = {
        "event": "-",
        "recipient": "-",
        "subject": "-",
        "template": "-",
        "status": "-",
        "detail": "-",
    }

    def process(self, msg: str, kwargs: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        extra = dict(self._DEFAULTS)
        extra.update(self.extra)
        extra.update(kwargs.get("extra", {}))
        kwargs["extra"] = extra
        return msg, kwargs


def get_logger(name: str) -> SafeExtraAdapter:
    """Return a logger adapter preconfigured with default structured fields."""
    return SafeExtraAdapter(logging.getLogger(name), {})


def utc_timestamp() -> str:
    """Return an ISO-8601 UTC timestamp for payload-level traceability."""
    return datetime.now(timezone.utc).isoformat()
