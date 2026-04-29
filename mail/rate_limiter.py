import asyncio
import random
import time


class SmoothedWindowLimiter:
    """Distribute sends almost uniformly across a fixed window.

    The limiter builds `max_iterations` slots over each window of
    `window_seconds`, then applies a bounded jitter around each evenly spaced
    slot. This keeps the target volume per window while avoiding startup bursts
    and large random gaps.
    """

    def __init__(self, max_iterations: int, window_seconds: int):
        if max_iterations <= 0:
            raise ValueError("max_iterations must be greater than zero")
        if window_seconds <= 0:
            raise ValueError("window_seconds must be greater than zero")

        self._max_iterations = max_iterations
        self._window_seconds = float(window_seconds)
        self._spacing = self._window_seconds / float(self._max_iterations)
        self._jitter = min(self._spacing * 0.35, self._window_seconds / 10.0)
        self._window_start = time.monotonic()
        self._slots = self._generate_slots()
        self._index = 0
        self._lock = asyncio.Lock()

    def _generate_slots(self) -> list[float]:
        slots: list[float] = []

        for index in range(self._max_iterations):
            center = (index + 0.5) * self._spacing
            lower_bound = max(index * self._spacing, center - self._jitter)
            upper_bound = min((index + 1) * self._spacing, center + self._jitter)
            slots.append(random.uniform(lower_bound, upper_bound))

        return slots

    def _roll_window_if_needed(self, now: float) -> None:
        while now >= self._window_start + self._window_seconds:
            self._window_start += self._window_seconds
            self._slots = self._generate_slots()
            self._index = 0

    def preview_slots(self, limit: int = 10) -> list[float]:
        return [round(slot, 3) for slot in self._slots[:limit]]

    async def acquire(self) -> dict[str, float | int]:
        waited_total = 0.0

        while True:
            async with self._lock:
                now = time.monotonic()
                self._roll_window_if_needed(now)

                if self._index >= len(self._slots):
                    wait = (self._window_start + self._window_seconds) - now
                else:
                    slot_index = self._index
                    slot_time = self._window_start + self._slots[self._index]
                    if now >= slot_time:
                        self._index += 1
                        return {
                            "waited_seconds": round(waited_total, 6),
                            "slot_index": slot_index,
                            "slot_offset_seconds": self._slots[slot_index],
                            "window_seconds": self._window_seconds,
                            "window_offset_seconds": round(now - self._window_start, 6),
                        }
                    wait = slot_time - now

            sleep_for = max(wait, 0.01)
            await asyncio.sleep(sleep_for)
            waited_total += sleep_for
