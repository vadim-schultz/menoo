"""Test configuration and fixtures."""

from __future__ import annotations

import os
from collections.abc import AsyncGenerator

import pytest
import respx
from litestar.testing import AsyncTestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app import database as app_database
from app.config import get_settings
from app.main import create_app
from app.models.base import Base


@pytest.fixture(scope="session")
def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
    )
    return engine


@pytest.fixture(scope="function")
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create test database session with transaction rollback."""
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    session_factory = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with session_factory() as session:
        yield session
        await session.rollback()

    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def app():
    """Create test application."""
    os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
    get_settings.cache_clear()
    app_database._db_manager = None
    return create_app()


@pytest.fixture
async def test_client(app) -> AsyncGenerator[AsyncTestClient, None]:
    """Create test HTTP client for integration tests."""
    async with AsyncTestClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
def mock_ai_service():
    """Mock AI service for suggestion tests."""
    with respx.mock:
        yield respx
