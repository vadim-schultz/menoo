"""SQLAlchemy models base and mixins."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column


class Base(DeclarativeBase):
    """Base class for all models."""

    pass


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""

    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        """Timestamp when record was created."""
        return mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        """Timestamp when record was last updated."""
        return mapped_column(
            DateTime,
            default=datetime.utcnow,
            onupdate=datetime.utcnow,
            nullable=False,
        )


class IDMixin:
    """Mixin for integer primary key."""

    @declared_attr
    def id(cls) -> Mapped[int]:
        """Primary key."""
        return mapped_column(Integer, primary_key=True, autoincrement=True)


class SoftDeleteMixin:
    """Mixin for soft delete functionality."""

    @declared_attr
    def is_deleted(cls) -> Mapped[bool]:
        """Soft delete flag."""
        return mapped_column(default=False, nullable=False)
