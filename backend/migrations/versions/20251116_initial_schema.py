"""initial schema

Revision ID: 20251116_initial_schema
Revises: None
Create Date: 2025-11-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20251116_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade database schema."""
    # Table: ingredients
    op.create_table(
        "ingredients",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=30), nullable=False),
        sa.Column("storage_location", sa.String(length=100), nullable=True),
        sa.Column("quantity", sa.Numeric(12, 3), nullable=True),
        sa.Column("unit", sa.String(length=50), nullable=True),
        sa.Column("expiry_date", sa.Date(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.UniqueConstraint("name", name="uq_ingredient_name"),
    )
    op.create_index("ix_ingredients_name", "ingredients", ["name"], unique=False)
    op.create_index("ix_ingredients_category", "ingredients", ["category"], unique=False)
    op.create_index(
        "ix_ingredients_storage_location", "ingredients", ["storage_location"], unique=False
    )
    op.create_index(
        "idx_ingredient_category_location_deleted",
        "ingredients",
        ["category", "storage_location", "is_deleted"],
        unique=False,
    )

    # Table: recipes
    op.create_table(
        "recipes",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("instructions", sa.Text(), nullable=False),
        sa.Column("author", sa.String(length=100), nullable=True),
        sa.Column("source", sa.String(length=200), nullable=True),
        sa.Column("cuisine_types", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("meal_types", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("cooking_method", sa.String(length=50), nullable=True),
        sa.Column("dietary_requirements", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("contains_allergens", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("allergen_warnings", sa.Text(), nullable=True),
        sa.Column("timing", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("prep_time_minutes", sa.Integer(), nullable=True),
        sa.Column("cook_time_minutes", sa.Integer(), nullable=True),
        sa.Column("marinating_time_minutes", sa.Integer(), nullable=True),
        sa.Column("resting_time_minutes", sa.Integer(), nullable=True),
        sa.Column("inactive_time_minutes", sa.Integer(), nullable=True),
        sa.Column("total_active_time_minutes", sa.Integer(), nullable=True),
        sa.Column("difficulty_metrics", sa.JSON(), nullable=True),
        sa.Column("servings", sa.Integer(), nullable=False, server_default=sa.text("1")),
        sa.Column("yield_description", sa.String(length=100), nullable=True),
        sa.Column("equipment_requirements", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("oven_temperature_celsius", sa.Float(), nullable=True),
        sa.Column("oven_settings", sa.String(length=100), nullable=True),
        sa.Column("nutrition_info", sa.JSON(), nullable=True),
        sa.Column("storage_instructions", sa.JSON(), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("variations", sa.Text(), nullable=True),
        sa.Column("estimated_cost_per_serving", sa.Numeric(10, 2), nullable=True),
        sa.Column("seasonality", sa.JSON(), nullable=True),
    )
    op.create_index("ix_recipes_name", "recipes", ["name"], unique=False)
    op.create_index("ix_recipes_author", "recipes", ["author"], unique=False)
    op.create_index("ix_recipes_cooking_method", "recipes", ["cooking_method"], unique=False)
    op.create_index("idx_recipe_method_deleted", "recipes", ["cooking_method", "is_deleted"], False)
    op.create_index("idx_recipe_author_deleted", "recipes", ["author", "is_deleted"], False)

    # Table: recipe_ingredients
    op.create_table(
        "recipe_ingredients",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("recipe_id", sa.Integer(), nullable=False),
        sa.Column("ingredient_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Numeric(12, 3), nullable=False),
        sa.Column("unit", sa.String(length=20), nullable=False),
        sa.Column("is_optional", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("note", sa.String(length=200), nullable=True),
        sa.Column("order_in_recipe", sa.Integer(), nullable=True),
        sa.Column("preparation_details", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.ForeignKeyConstraint(["recipe_id"], ["recipes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["ingredient_id"], ["ingredients.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("recipe_id", "ingredient_id", name="uq_recipe_ingredient"),
    )
    op.create_index(
        "idx_recipe_ingredient_pair", "recipe_ingredients", ["recipe_id", "ingredient_id"], False
    )
    op.create_index("ix_recipe_ingredients_recipe_id", "recipe_ingredients", ["recipe_id"], False)
    op.create_index(
        "ix_recipe_ingredients_ingredient_id", "recipe_ingredients", ["ingredient_id"], False
    )


def downgrade() -> None:
    """Downgrade database schema."""
    op.drop_index("ix_recipe_ingredients_ingredient_id", table_name="recipe_ingredients")
    op.drop_index("ix_recipe_ingredients_recipe_id", table_name="recipe_ingredients")
    op.drop_index("idx_recipe_ingredient_pair", table_name="recipe_ingredients")
    op.drop_table("recipe_ingredients")

    op.drop_index("idx_recipe_author_deleted", table_name="recipes")
    op.drop_index("idx_recipe_method_deleted", table_name="recipes")
    op.drop_index("ix_recipes_cooking_method", table_name="recipes")
    op.drop_index("ix_recipes_author", table_name="recipes")
    op.drop_index("ix_recipes_name", table_name="recipes")
    op.drop_table("recipes")

    op.drop_index("idx_ingredient_category_location_deleted", table_name="ingredients")
    op.drop_index("ix_ingredients_storage_location", table_name="ingredients")
    op.drop_index("ix_ingredients_category", table_name="ingredients")
    op.drop_index("ix_ingredients_name", table_name="ingredients")
    op.drop_table("ingredients")


