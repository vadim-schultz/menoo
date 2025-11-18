"""Adopt new comprehensive recipe schema.

Revision ID: b8f5bf5b6e64
Revises: None
Create Date: 2025-01-15
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect
from sqlalchemy.engine import Connection, Dialect

# revision identifiers, used by Alembic.
revision: str = "b8f5bf5b6e64"
down_revision: str | None = None
branch_labels: tuple[str, ...] | None = None
depends_on: tuple[str, ...] | None = None


def upgrade() -> None:
    # --- Ingredients table updates -------------------------------------------------
    bind = op.get_bind()
    conn = bind  # synchronous connection for execute()
    inspector = inspect(bind)
    existing_ingredient_cols = {col["name"] for col in inspector.get_columns("ingredients")}
    is_sqlite = bind.dialect.name == "sqlite"

    if "category" not in existing_ingredient_cols:
        op.add_column(
            "ingredients",
            sa.Column("category", sa.String(length=30), nullable=True, server_default="other"),
        )
    # Older schema already had a 'unit' column (VARCHAR(20)); skip if present
    if "unit" not in existing_ingredient_cols:
        op.add_column(
            "ingredients",
            sa.Column("unit", sa.String(length=50), nullable=True),
        )
    if "notes" not in existing_ingredient_cols:
        op.add_column(
            "ingredients",
            sa.Column("notes", sa.Text(), nullable=True),
        )
    # SQLite doesn't support ALTER COLUMN TYPE; skip these changes for SQLite
    if not is_sqlite:
        op.alter_column(
            "ingredients",
            "storage_location",
            existing_type=sa.String(length=20),
            type_=sa.String(length=100),
            existing_nullable=True,
        )
        op.alter_column(
            "ingredients",
            "quantity",
            type_=sa.Numeric(12, 3),
            existing_type=sa.Numeric(10, 2),
        )

    if "category" not in existing_ingredient_cols and not is_sqlite:
        ingredients_table = sa.table(
            "ingredients",
            sa.column("id", sa.Integer()),
            sa.column("category", sa.String(length=30)),
        )
        conn = op.get_bind()
        # Ensure existing ingredient rows have a category.
        conn.execute(
            sa.update(ingredients_table)
            .where(ingredients_table.c.category.is_(None))
            .values(category="other")
        )
        op.alter_column("ingredients", "category", nullable=False, server_default=None)

    # --- Recipes table updates ------------------------------------------------------
    existing_recipe_cols = {col["name"] for col in inspector.get_columns("recipes")}
    def add_recipe_col(name: str, column: sa.Column) -> None:
        if name not in existing_recipe_cols:
            op.add_column("recipes", column)
            existing_recipe_cols.add(name)

    add_recipe_col("author", sa.Column("author", sa.String(length=100), nullable=True))
    add_recipe_col("source", sa.Column("source", sa.String(length=200), nullable=True))
    add_recipe_col(
        "cuisine_types",
        sa.Column("cuisine_types", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
    )
    add_recipe_col(
        "meal_types",
        sa.Column("meal_types", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
    )
    add_recipe_col("cooking_method", sa.Column("cooking_method", sa.String(length=50), nullable=True))
    add_recipe_col(
        "dietary_requirements",
        sa.Column(
            "dietary_requirements",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )
    add_recipe_col(
        "contains_allergens",
        sa.Column(
            "contains_allergens",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )
    add_recipe_col("allergen_warnings", sa.Column("allergen_warnings", sa.Text(), nullable=True))
    add_recipe_col(
        "timing",
        sa.Column("timing", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
    )
    add_recipe_col("prep_time_minutes", sa.Column("prep_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("cook_time_minutes", sa.Column("cook_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("marinating_time_minutes", sa.Column("marinating_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("resting_time_minutes", sa.Column("resting_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("inactive_time_minutes", sa.Column("inactive_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("total_active_time_minutes", sa.Column("total_active_time_minutes", sa.Integer(), nullable=True))
    add_recipe_col("difficulty_metrics", sa.Column("difficulty_metrics", sa.JSON(), nullable=True))
    add_recipe_col("yield_description", sa.Column("yield_description", sa.String(length=100), nullable=True))
    add_recipe_col(
        "equipment_requirements",
        sa.Column(
            "equipment_requirements",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )
    add_recipe_col(
        "oven_temperature_celsius",
        sa.Column("oven_temperature_celsius", sa.Float(), nullable=True),
    )
    add_recipe_col("oven_settings", sa.Column("oven_settings", sa.String(length=100), nullable=True))
    add_recipe_col("nutrition_info", sa.Column("nutrition_info", sa.JSON(), nullable=True))
    add_recipe_col("storage_instructions", sa.Column("storage_instructions", sa.JSON(), nullable=True))
    add_recipe_col(
        "tags", sa.Column("tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'"))
    )
    add_recipe_col("notes", sa.Column("notes", sa.Text(), nullable=True))
    add_recipe_col("variations", sa.Column("variations", sa.Text(), nullable=True))
    add_recipe_col(
        "estimated_cost_per_serving",
        sa.Column("estimated_cost_per_serving", sa.Numeric(10, 2), nullable=True),
    )
    add_recipe_col("seasonality", sa.Column("seasonality", sa.JSON(), nullable=True))

    recipes_table = sa.table(
        "recipes",
        sa.column("id", sa.Integer()),
        sa.column("prep_time", sa.Integer()),
        sa.column("cook_time", sa.Integer()),
        sa.column("timing", sa.JSON()),
        sa.column("prep_time_minutes", sa.Integer()),
        sa.column("cook_time_minutes", sa.Integer()),
        sa.column("total_active_time_minutes", sa.Integer()),
    )

    results = conn.execute(
        sa.select(
            recipes_table.c.id,
            recipes_table.c.prep_time,
            recipes_table.c.cook_time,
        )
    ).fetchall()

    for recipe_id, prep_time, cook_time in results:
        timing_payload: dict[str, int] = {}
        if prep_time is not None:
            timing_payload["prep_time_minutes"] = prep_time
        if cook_time is not None:
            timing_payload["cook_time_minutes"] = cook_time
        if (
            timing_payload
            and "prep_time_minutes" in timing_payload
            and "cook_time_minutes" in timing_payload
        ):
            timing_payload["total_active_time_minutes"] = (
                timing_payload["prep_time_minutes"] + timing_payload["cook_time_minutes"]
            )

        update_values: dict[str, object] = {}
        if prep_time is not None:
            update_values["prep_time_minutes"] = prep_time
        if cook_time is not None:
            update_values["cook_time_minutes"] = cook_time
        if "total_active_time_minutes" in timing_payload:
            update_values["total_active_time_minutes"] = timing_payload["total_active_time_minutes"]
        if timing_payload:
            update_values["timing"] = timing_payload

        if update_values:
            conn.execute(
                sa.update(recipes_table)
                .where(recipes_table.c.id == recipe_id)
                .values(**update_values)
            )

    # SQLite does not support DROP COLUMN prior to recent versions; keep legacy cols
    if not is_sqlite:
        op.drop_column("recipes", "prep_time")
        op.drop_column("recipes", "cook_time")
        op.drop_column("recipes", "difficulty")

    # Remove server defaults now that initial data migration is complete.
    if not is_sqlite:
        for column_name in (
            "cuisine_types",
            "meal_types",
            "dietary_requirements",
            "contains_allergens",
            "tags",
        ):
            op.alter_column("recipes", column_name, server_default=None)
        op.alter_column("recipes", "timing", server_default=None)
        op.alter_column("recipes", "equipment_requirements", server_default=None)

    # --- Recipe ingredients table updates ------------------------------------------
    existing_ri_cols = {col["name"] for col in inspector.get_columns("recipe_ingredients")}
    if "order_in_recipe" not in existing_ri_cols:
        op.add_column(
            "recipe_ingredients",
            sa.Column("order_in_recipe", sa.Integer(), nullable=True),
        )
    if "preparation_details" not in existing_ri_cols:
        op.add_column(
            "recipe_ingredients",
            sa.Column("preparation_details", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        )
    if not is_sqlite:
        op.alter_column(
            "recipe_ingredients",
            "quantity",
            type_=sa.Numeric(12, 3),
            existing_type=sa.Numeric(10, 2),
        )

    recipe_ingredients_table = sa.table(
        "recipe_ingredients",
        sa.column("id", sa.Integer()),
        sa.column("ingredient_id", sa.Integer()),
        sa.column("quantity", sa.Numeric()),
        sa.column("unit", sa.String(length=20)),
        sa.column("is_optional", sa.Boolean()),
        sa.column("note", sa.String(length=200)),
        sa.column("preparation_details", sa.JSON()),
    )

    rows = conn.execute(
        sa.select(
            recipe_ingredients_table.c.id,
            recipe_ingredients_table.c.ingredient_id,
            recipe_ingredients_table.c.quantity,
            recipe_ingredients_table.c.unit,
            recipe_ingredients_table.c.is_optional,
            recipe_ingredients_table.c.note,
        )
    ).fetchall()

    for row in rows:
        prep_payload = {
            "ingredient_id": row.ingredient_id,
            "quantity": float(row.quantity) if row.quantity is not None else None,
            "unit": row.unit,
            "is_optional": row.is_optional,
            "notes": row.note,
            "mechanical_treatments": [],
            "thermal_treatments": [],
            "preparation_steps": [],
        }
        conn.execute(
            sa.update(recipe_ingredients_table)
            .where(recipe_ingredients_table.c.id == row.id)
            .values(preparation_details=prep_payload)
        )

    if not is_sqlite:
        op.alter_column("recipe_ingredients", "preparation_details", server_default=None)


def downgrade() -> None:
    raise RuntimeError("Downgrade is not supported for this migration.")
