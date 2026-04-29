"""Application logging utilities.

Centralizes logger setup and common helpers used across adapters.
"""

import logging
from datetime import datetime, timezone
from typing import Any


LOGGER_NAME = "morgans"


_STRUCTURED_FIELDS = ("event", "recipient", "subject", "template", "status", "detail")
_FIELD_DEFAULTS = {f: "-" for f in _STRUCTURED_FIELDS}


class _StructuredFormatter(logging.Formatter):
    """Formatter that fills in missing structured fields for third-party loggers."""

    def format(self, record: logging.LogRecord) -> str:
        for key, default in _FIELD_DEFAULTS.items():
            if not hasattr(record, key):
                setattr(record, key, default)
        base = super().format(record)
        compact = []
        for token in base.split():
            if token in {
                "event=-",
                "recipient=-",
                "subject=-",
                "template=-",
                "status=-",
                "detail=-",
            }:
                continue
            compact.append(token)
        return " ".join(compact)


def configure_logging(log_level: str) -> None:
    """Configure root logging with a stable, machine-readable format."""
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    fmt = _StructuredFormatter(
        fmt=(
            "%(asctime)sZ level=%(levelname)s logger=%(name)s "
            "event=%(event)s recipient=%(recipient)s subject=%(subject)s "
            "template=%(template)s status=%(status)s detail=%(detail)s"
        ),
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    handler = logging.StreamHandler()
    handler.setFormatter(fmt)

    root = logging.getLogger()
    root.setLevel(numeric_level)
    root.handlers.clear()
    root.addHandler(handler)


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
