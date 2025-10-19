"""Application configuration using pydantic-settings."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Menoo"
    debug: bool = False
    environment: Literal["development", "production", "test"] = "development"

    # Server
    host: str = "0.0.0.0"  # nosec B104 - Intentional bind to all interfaces for Docker/server
    port: int = 8000

    # Database
    database_url: str = Field(
        default="sqlite+aiosqlite:///./menoo.db",
        description="SQLite database URL",
    )
    database_echo: bool = False

    # OpenAI / Marvin
    openai_api_key: str = Field(default="", description="OpenAI API key")
    marvin_cache_enabled: bool = True
    marvin_cache_ttl_seconds: int = 3600  # 1 hour

    # Rate Limiting
    suggestion_rate_limit: int = 10  # requests per minute
    suggestion_rate_period: int = 60  # seconds

    # Logging
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    log_json: bool = False

    # CORS
    cors_allowed_origins: list[str] = Field(default_factory=lambda: ["*"])

    @property
    def database_path(self) -> Path:
        """Extract database file path from URL."""
        if "sqlite" in self.database_url:
            # Extract path after ://
            path_part = self.database_url.split("://")[-1]
            # Remove any query parameters
            path_part = path_part.split("?")[0]
            return Path(path_part)
        return Path("menoo.db")


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
