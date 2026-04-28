import asyncio
import time


class TokenBucket:
    """Async token bucket — allows burst up to `burst` then throttles to `rate_per_hour`."""

    def __init__(self, rate_per_hour: int, burst: int):
        self._rate = rate_per_hour / 3600.0
        self._burst = float(burst)
        self._tokens = float(burst)
        self._last = time.monotonic()
        self._lock = asyncio.Lock()

    async def acquire(self):
        while True:
            async with self._lock:
                now = time.monotonic()
                elapsed = now - self._last
                self._tokens = min(self._burst, self._tokens + elapsed * self._rate)
                self._last = now
                if self._tokens >= 1.0:
                    self._tokens -= 1.0
                    return
                wait = (1.0 - self._tokens) / self._rate
            await asyncio.sleep(wait)
