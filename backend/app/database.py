"""Database configuration and session management."""

from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import Settings
from app.models.base import Base  # Import Base from models


class DatabaseManager:
    """Manages database engine and session factory."""

    def __init__(self, settings: Settings) -> None:
        """Initialize database manager."""
        self.settings = settings
        self._engine: AsyncEngine | None = None
        self._session_factory: async_sessionmaker[AsyncSession] | None = None

    def get_engine(self) -> AsyncEngine:
        """Get or create async engine with SQLite optimizations."""
        if self._engine is None:
            connect_args: dict[str, Any] = {}

            if "sqlite" in self.settings.database_url:
                # SQLite-specific optimizations
                connect_args = {
                    "check_same_thread": False,
                }

            self._engine = create_async_engine(
                self.settings.database_url,
                echo=self.settings.database_echo,
                connect_args=connect_args,
                pool_pre_ping=True,
            )
        return self._engine

    def get_session_factory(self) -> async_sessionmaker[AsyncSession]:
        """Get or create session factory."""
        if self._session_factory is None:
            self._session_factory = async_sessionmaker(
                bind=self.get_engine(),
                class_=AsyncSession,
                expire_on_commit=False,
            )
        return self._session_factory

    async def init_db(self) -> None:
        """Initialize database with WAL mode for SQLite and create tables."""
        from sqlalchemy import text

        engine = self.get_engine()

        # Enable WAL mode for SQLite
        if "sqlite" in self.settings.database_url:
            async with engine.begin() as conn:
                await conn.execute(text("PRAGMA journal_mode=WAL"))
                await conn.execute(text("PRAGMA synchronous=NORMAL"))
                await conn.execute(text("PRAGMA cache_size=-64000"))  # 64MB cache
                await conn.execute(text("PRAGMA temp_store=MEMORY"))

        # Create all tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def close(self) -> None:
        """Close database connections."""
        if self._engine is not None:
            await self._engine.dispose()
            self._engine = None
            self._session_factory = None


# Global database manager instance
_db_manager: DatabaseManager | None = None


def get_db_manager(settings: Settings) -> DatabaseManager:
    """Get or create global database manager."""
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager(settings)
    return _db_manager


@asynccontextmanager
async def get_session(
    session_factory: async_sessionmaker[AsyncSession],
) -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional scope around a series of operations."""
    async with session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
