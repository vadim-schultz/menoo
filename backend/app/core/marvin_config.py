"""Marvin AI configuration and initialization.

This module provides lazy initialization of the Marvin client to avoid
side effects at import time and allow for proper testing isolation.
"""

from __future__ import annotations

import marvin

from app.config import get_settings


def configure_marvin() -> None:
    """Configure Marvin with settings from the application config.

    This function should be called lazily (e.g., in service __init__)
    to avoid side effects at module import time.

    Raises:
        ValueError: If OpenAI API key is not configured.
    """
    settings = get_settings()

    if not settings.openai_api_key:
        raise ValueError(
            "OpenAI API key is required. Set OPENAI_API_KEY environment variable."
        )

    # Configure Marvin settings
    marvin.settings.openai.api_key = settings.openai_api_key  # type: ignore[attr-defined]

    # Optional: Configure additional Marvin settings based on app config
    # (caching, rate limits, etc. can be handled at the service layer)
