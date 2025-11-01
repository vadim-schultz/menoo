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
    import os

    settings = get_settings()

    if not settings.openai_api_key:
        raise ValueError(
            "OpenAI API key is required. Set OPENAI_API_KEY environment variable."
        )

    # Configure Marvin settings
    # Marvin reads from OPENAI_API_KEY environment variable by default
    # Set it if not already set, or if it differs from our config
    if os.environ.get('OPENAI_API_KEY') != settings.openai_api_key:
        os.environ['OPENAI_API_KEY'] = settings.openai_api_key

    # Also try to set it directly on Marvin settings if the structure supports it
    # This provides redundancy in case Marvin doesn't read from environment
    try:
        # Try accessing marvin.settings.openai.api_key (older Marvin versions)
        if hasattr(marvin, 'settings') and hasattr(marvin.settings, 'openai'):
            if hasattr(marvin.settings.openai, 'api_key'):
                marvin.settings.openai.api_key = settings.openai_api_key  # type: ignore[attr-defined]
    except (AttributeError, TypeError):
        # If direct settings access fails, rely on environment variable
        # Marvin will pick it up automatically on next API call
        pass

    # Optional: Configure additional Marvin settings based on app config
    # (caching, rate limits, etc. can be handled at the service layer)
