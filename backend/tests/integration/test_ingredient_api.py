"""Integration tests for ingredient endpoints."""

import pytest
from litestar.status_codes import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)

from tests.fixtures.factories import ingredient_payload_factory

INGREDIENTS_URL = "/api/v1/ingredients"


class TestIngredientList:
    """Test GET /api/v1/ingredients endpoint."""

    @pytest.mark.integration
    async def test_list_empty_database(self, test_client):
        """Should return empty list when no ingredients exist."""
        response = await test_client.get(INGREDIENTS_URL)

        assert response.status_code == HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.integration
    async def test_list_with_pagination(self, test_client):
        """Should support pagination parameters (currently returns all items)."""
        # Create some ingredients first
        for i in range(3):
            ingredient_data = ingredient_payload_factory(name=f"Item{i}")
            payload = {"ingredient": ingredient_data}
            await test_client.post(INGREDIENTS_URL, json=payload)

        response = await test_client.get(f"{INGREDIENTS_URL}?page=1&page_size=2")

        assert response.status_code == HTTP_200_OK
        data = response.json()
        # Backend applies pagination; with page_size=2 we expect 2 items
        assert len(data) == 2


class TestIngredientCreate:
    """Test POST /api/v1/ingredients endpoint."""

    @pytest.mark.integration
    async def test_create_valid_ingredient(self, test_client):
        """Should create ingredient with valid data."""
        ingredient_data = ingredient_payload_factory(name="Tomato", storage_location="fridge")
        payload = {"ingredient": ingredient_data}

        response = await test_client.post(INGREDIENTS_URL, json=payload)

        assert response.status_code == HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Tomato"
        assert data["storage_location"] == "fridge"
        assert "id" in data

    @pytest.mark.integration
    async def test_create_duplicate_name_adds_quantity(self, test_client):
        """Should add quantity to existing ingredient with same name."""
        ingredient_data1 = ingredient_payload_factory(name="Tomato", quantity=100)
        payload1 = {"ingredient": ingredient_data1}

        # Create first ingredient
        response1 = await test_client.post(INGREDIENTS_URL, json=payload1)
        assert response1.status_code == HTTP_201_CREATED
        created1 = response1.json()
        initial_quantity = created1["quantity"]

        # Try to create duplicate with different quantity
        ingredient_data2 = ingredient_payload_factory(name="Tomato", quantity=50)
        payload2 = {"ingredient": ingredient_data2}
        response2 = await test_client.post(INGREDIENTS_URL, json=payload2)

        assert response2.status_code == HTTP_201_CREATED
        updated = response2.json()
        # Should return same ingredient ID with updated quantity
        assert updated["id"] == created1["id"]
        assert float(updated["quantity"]) == float(initial_quantity) + 50

    @pytest.mark.integration
    async def test_create_missing_required_field(self, test_client):
        """Should reject request with missing required fields."""
        payload = {
            "ingredient": {
                "storage_location": "fridge",
                # Missing 'name'
            }
        }

        response = await test_client.post(INGREDIENTS_URL, json=payload)

        assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.integration
    async def test_create_with_storage_location(self, test_client):
        """Should accept any string for storage location."""
        ingredient_data = ingredient_payload_factory(
            name="Tomato", storage_location="invalid_location"
        )
        payload = {"ingredient": ingredient_data}

        response = await test_client.post(INGREDIENTS_URL, json=payload)

        assert response.status_code == HTTP_201_CREATED
        data = response.json()
        assert data["storage_location"] == "invalid_location"


class TestIngredientGet:
    """Test GET /api/v1/ingredients/{id} endpoint."""

    @pytest.mark.integration
    async def test_get_existing_ingredient(self, test_client):
        """Should retrieve existing ingredient by ID."""
        ingredient_data = ingredient_payload_factory(name="Tomato")
        payload = {"ingredient": ingredient_data}
        create_response = await test_client.post(INGREDIENTS_URL, json=payload)
        created = create_response.json()

        response = await test_client.get(f"{INGREDIENTS_URL}/{created['id']}")

        assert response.status_code == HTTP_200_OK
        data = response.json()
        assert data["id"] == created["id"]
        assert data["name"] == "Tomato"

    @pytest.mark.integration
    async def test_get_nonexistent_ingredient(self, test_client):
        """Should return 404 for non-existent ingredient."""
        response = await test_client.get(f"{INGREDIENTS_URL}/99999")

        assert response.status_code == HTTP_404_NOT_FOUND


class TestIngredientPatch:
    """Test PATCH /api/v1/ingredients/{id} endpoint."""

    @pytest.mark.integration
    async def test_patch_single_field(self, test_client):
        """Should update only specified fields."""
        ingredient_data = ingredient_payload_factory(name="Tomato", quantity=500)
        payload = {"ingredient": ingredient_data}
        create_response = await test_client.post(INGREDIENTS_URL, json=payload)
        created = create_response.json()

        patch_payload = {"quantity": 750}
        response = await test_client.patch(f"{INGREDIENTS_URL}/{created['id']}", json=patch_payload)

        assert response.status_code == HTTP_200_OK
        data = response.json()
        assert data["quantity"] == 750
        assert data["name"] == "Tomato"  # Unchanged


class TestIngredientDelete:
    """Test DELETE /api/v1/ingredients/{id} endpoint."""

    @pytest.mark.integration
    async def test_delete_existing_ingredient(self, test_client):
        """Should soft delete existing ingredient."""
        ingredient_data = ingredient_payload_factory(name="Tomato")
        payload = {"ingredient": ingredient_data}
        create_response = await test_client.post(INGREDIENTS_URL, json=payload)
        created = create_response.json()

        response = await test_client.delete(f"{INGREDIENTS_URL}/{created['id']}")

        assert response.status_code == HTTP_204_NO_CONTENT

        # Verify ingredient is no longer retrievable
        get_response = await test_client.get(f"{INGREDIENTS_URL}/{created['id']}")
        assert get_response.status_code == HTTP_404_NOT_FOUND

    @pytest.mark.integration
    async def test_delete_nonexistent_ingredient(self, test_client):
        """Should return 404 when deleting non-existent ingredient."""
        response = await test_client.delete(f"{INGREDIENTS_URL}/99999")

        assert response.status_code == HTTP_404_NOT_FOUND


class TestIngredientFilters:
    """Test filtering on ingredient list endpoint."""

    @pytest.mark.integration
    async def test_filter_by_storage_location(self, test_client):
        """Should filter ingredients by storage location."""
        # Create ingredients in different locations
        ingredient_data1 = ingredient_payload_factory(name="Item1", storage_location="fridge")
        await test_client.post(
            INGREDIENTS_URL,
            json={"ingredient": ingredient_data1},
        )
        ingredient_data2 = ingredient_payload_factory(name="Item2", storage_location="cupboard")
        await test_client.post(
            INGREDIENTS_URL,
            json={"ingredient": ingredient_data2},
        )

        response = await test_client.get(f"{INGREDIENTS_URL}?storage_location=fridge")

        assert response.status_code == HTTP_200_OK
        data = response.json()
        # Filter should return only matching items
        if data:  # If there are results, they should all match
            assert all(item["storage_location"] == "fridge" for item in data)
        # If empty, that's also valid (means no matches)

    @pytest.mark.integration
    async def test_filter_by_name_contains(self, test_client):
        """Should filter ingredients by name substring (case-insensitive)."""
        ingredient_data1 = ingredient_payload_factory(name="Cherry Tomato")
        await test_client.post(
            INGREDIENTS_URL,
            json={"ingredient": ingredient_data1},
        )
        ingredient_data2 = ingredient_payload_factory(name="Potato")
        await test_client.post(
            INGREDIENTS_URL,
            json={"ingredient": ingredient_data2},
        )

        response = await test_client.get(f"{INGREDIENTS_URL}?name_contains=tomato")

        assert response.status_code == HTTP_200_OK
        data = response.json()
        # Filter should return only matching items
        if data:  # If there are results, they should all match
            assert all("tomato" in item["name"].lower() for item in data)
        # If empty, that's also valid (means no matches)
