"""
TikTok NZ + Gym Hashtag Macro
------------------------------
Connects to your ALREADY OPEN Chrome browser (no login needed).
Scrolls TikTok and likes + bookmarks any video with both
a NZ-related AND gym-related hashtag.

FIRST TIME SETUP (do this once):
  1. Close Chrome completely
  2. Paste this into Command Prompt and press Enter:
     "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
  3. In the Chrome window that opens, go to tiktok.com and log in
  4. Run this script — it will attach to that Chrome window

EVERY TIME AFTER THAT:
  Just make sure Chrome is open with TikTok loaded, then run the script.

Requirements:
    pip install playwright
    python -m playwright install chromium

Usage:
    python tiktok_macro.py
"""

import asyncio
import random
import time
from datetime import datetime
from playwright.async_api import async_playwright

# ---------------------------------------------------------------------------
# Hashtag keyword lists — add/remove as you like
# ---------------------------------------------------------------------------

NZ_KEYWORDS = {
    "nz", "newzealand", "aotearoa", "kiwi", "kiwifitness",
    "nzfitness", "nzgym", "nzsport", "wellington", "auckland",
    "christchurch", "hamilton", "dunedin", "tauranga", "nzlife",
    "nzcommunity", "nzathlete", "nzwellness",
}

GYM_KEYWORDS = {
    "gym", "gymlife", "gymmotivation", "fitness", "fitnessmotivation",
    "workout", "weightlifting", "lifting", "bodybuilding", "gains",
    "fitlife", "training", "strength", "strengthtraining", "crossfit",
    "powerlifting", "legday", "chestday", "pushday", "pullday",
    "preworkout", "gymrat", "sweat", "grind", "physique",
    "musclebuilding", "bulking", "cutting", "personaltrainer",
}

# ---------------------------------------------------------------------------
# Delays (seconds) — randomised to mimic human behaviour
# ---------------------------------------------------------------------------

WATCH_TIME_MIN   = 3.0
WATCH_TIME_MAX   = 9.0
ACTION_DELAY_MIN = 0.4
ACTION_DELAY_MAX = 1.2
SCROLL_PAUSE_MIN = 0.5
SCROLL_PAUSE_MAX = 1.5

# Port must match the --remote-debugging-port value you used when launching Chrome
CHROME_DEBUG_PORT = 9222

# ---------------------------------------------------------------------------

def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")


def extract_hashtags(text: str) -> set:
    tags = set()
    for word in text.split():
        if word.startswith("#"):
            tag = word[1:].lower().strip(".,!?;:'\")")
            if tag:
                tags.add(tag)
    return tags


def matches_both(tags: set) -> tuple:
    nz_hits  = tags & NZ_KEYWORDS
    gym_hits = tags & GYM_KEYWORDS
    return bool(nz_hits and gym_hits), nz_hits, gym_hits


async def get_video_hashtags(page) -> set:
    tags = set()
    try:
        selectors = [
            '[data-e2e="browse-video-hashtag"]',
            'a[href*="/tag/"]',
            '[class*="HashTag"]',
            '[class*="StrongText"]',
        ]
        for sel in selectors:
            elements = await page.query_selector_all(sel)
            for el in elements:
                text = await el.inner_text()
                tags |= extract_hashtags(text)

        caption_els = await page.query_selector_all(
            '[data-e2e="browse-video-desc"], [class*="video-meta-caption"]'
        )
        for el in caption_els:
            text = await el.inner_text()
            tags |= extract_hashtags(text)
    except Exception as e:
        log(f"  Warning: could not read hashtags — {e}")
    return tags


async def click_like(page) -> bool:
    for sel in [
        '[data-e2e="browse-like-icon"]',
        '[data-e2e="like-icon"]',
        'button[class*="LikeIcon"]',
        'span[class*="like-icon"]',
    ]:
        try:
            btn = await page.query_selector(sel)
            if btn:
                await asyncio.sleep(random.uniform(ACTION_DELAY_MIN, ACTION_DELAY_MAX))
                await btn.click()
                return True
        except Exception:
            continue
    return False


async def click_bookmark(page) -> bool:
    for sel in [
        '[data-e2e="browse-collect-icon"]',
        '[data-e2e="collect-icon"]',
        'button[class*="CollectIcon"]',
        'span[class*="collect-icon"]',
    ]:
        try:
            btn = await page.query_selector(sel)
            if btn:
                await asyncio.sleep(random.uniform(ACTION_DELAY_MIN, ACTION_DELAY_MAX))
                await btn.click()
                return True
        except Exception:
            continue
    return False


async def scroll_to_next(page):
    await page.keyboard.press("ArrowDown")
    await asyncio.sleep(random.uniform(SCROLL_PAUSE_MIN, SCROLL_PAUSE_MAX))


async def find_tiktok_page(browser):
    """Find the TikTok tab in the connected browser."""
    for context in browser.contexts:
        for page in context.pages:
            if "tiktok.com" in page.url:
                return page
    return None


async def run():
    stats = {"scrolled": 0, "matched": 0, "liked": 0, "bookmarked": 0}

    async with async_playwright() as p:

        log(f"Connecting to Chrome on port {CHROME_DEBUG_PORT}...")
        log("Make sure Chrome is open with TikTok loaded first.")

        try:
            browser = await p.chromium.connect_over_cdp(
                f"http://localhost:{CHROME_DEBUG_PORT}"
            )
        except Exception:
            print()
            print("=" * 55)
            print("  ERROR: Could not connect to Chrome.")
            print()
            print("  You need to launch Chrome with remote debugging.")
            print("  Close Chrome fully, then paste this into Command")
            print("  Prompt and press Enter:")
            print()
            print('  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222')
            print()
            print("  Then go to tiktok.com, log in, and run this script.")
            print("=" * 55)
            return

        log("Connected to Chrome.")

        page = await find_tiktok_page(browser)

        if page is None:
            log("No TikTok tab found. Opening tiktok.com in Chrome...")
            context = browser.contexts[0]
            page = await context.new_page()
            await page.goto("https://www.tiktok.com/foryou", wait_until="domcontentloaded")
            await asyncio.sleep(3)
        else:
            log(f"Found TikTok tab: {page.url}")
            # Make sure we're on the For You feed
            if "/foryou" not in page.url and "@" not in page.url:
                await page.goto("https://www.tiktok.com/foryou", wait_until="domcontentloaded")
                await asyncio.sleep(3)

        await page.bring_to_front()
        log("Starting scroll loop. Press Ctrl+C to stop.\n")

        try:
            while True:
                stats["scrolled"] += 1
                watch_time = random.uniform(WATCH_TIME_MIN, WATCH_TIME_MAX)

                tags = await get_video_hashtags(page)
                matched, nz_hits, gym_hits = matches_both(tags)

                if tags:
                    log(f"Video #{stats['scrolled']} | Tags: {', '.join(sorted(tags))}")
                else:
                    log(f"Video #{stats['scrolled']} | No hashtags detected")

                if matched:
                    stats["matched"] += 1
                    log(f"  MATCH -- NZ: {nz_hits} | Gym: {gym_hits}")

                    liked = await click_like(page)
                    if liked:
                        stats["liked"] += 1
                        log("  Liked")
                    else:
                        log("  Could not find like button")

                    bookmarked = await click_bookmark(page)
                    if bookmarked:
                        stats["bookmarked"] += 1
                        log("  Bookmarked")
                    else:
                        log("  Could not find bookmark button")

                elapsed = 0.5
                remaining = max(0, watch_time - elapsed)
                await asyncio.sleep(remaining)

                await scroll_to_next(page)

        except KeyboardInterrupt:
            pass
        except Exception as e:
            log(f"Unexpected error: {e}")
        finally:
            print()
            print("=" * 50)
            print("  Session summary")
            print("=" * 50)
            print(f"  Videos scrolled : {stats['scrolled']}")
            print(f"  Matched (NZ+gym) : {stats['matched']}")
            print(f"  Liked            : {stats['liked']}")
            print(f"  Bookmarked       : {stats['bookmarked']}")
            print("=" * 50)


if __name__ == "__main__":
    asyncio.run(run())