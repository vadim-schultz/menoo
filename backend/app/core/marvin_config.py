"""Marvin AI configuration and initialization.

This module provides lazy initialization of the Marvin client to avoid
side effects at import time and allow for proper testing isolation.
"""

from __future__ import annotations

import os
from pathlib import Path

from app.config import BASE_DIR, get_settings


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

    # Ensure OpenAI key is visible to Marvin
    if os.environ.get("OPENAI_API_KEY") != settings.openai_api_key:
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key

    # Determine Marvin home path inside the workspace unless overridden
    home_path: Path = (
        settings.marvin_home_path
        if settings.marvin_home_path is not None
        else (BASE_DIR / ".marvin")
    )
    home_path = home_path.expanduser().resolve()
    home_path.mkdir(parents=True, exist_ok=True)

    if os.environ.get("MARVIN_HOME_PATH") != str(home_path):
        os.environ["MARVIN_HOME_PATH"] = str(home_path)

    # Point Marvin at a writable SQLite database unless a custom URL is set
    default_db_url = f"sqlite+aiosqlite:///{home_path / 'marvin.db'}"
    if settings.marvin_database_url:
        os.environ.setdefault("MARVIN_DATABASE_URL", settings.marvin_database_url)
    else:
        if os.environ.get("MARVIN_DATABASE_URL") != default_db_url:
            os.environ["MARVIN_DATABASE_URL"] = default_db_url

    # Import Marvin after environment variables are prepared so it picks up overrides
    import marvin  # noqa: WPS433 - runtime import required for configuration

    # Ensure Marvin's settings object uses the same paths
    try:
        if hasattr(marvin, "settings"):
            if getattr(marvin.settings, "home_path", None) != home_path:
                marvin.settings.home_path = home_path  # type: ignore[attr-defined]
            target_db_url = (
                settings.marvin_database_url if settings.marvin_database_url else default_db_url
            )
            if getattr(marvin.settings, "database_url", None) != target_db_url:
                marvin.settings.database_url = target_db_url  # type: ignore[attr-defined]
    except Exception:  # pragma: no cover - best effort sync with Marvin settings
        pass

    # Also try to set the OpenAI key directly on Marvin settings if supported
    try:
        if hasattr(marvin, "settings") and hasattr(marvin.settings, "openai"):
            if hasattr(marvin.settings.openai, "api_key"):
                marvin.settings.openai.api_key = settings.openai_api_key  # type: ignore[attr-defined]
    except (AttributeError, TypeError):
        pass
