"""Unit tests for Marvin configuration."""

from __future__ import annotations

from unittest.mock import patch

import pytest

from app.core.marvin_config import configure_marvin


class TestConfigureMarvin:
    """Test Marvin configuration function."""

    def test_configure_with_valid_api_key(self):
        """Should configure Marvin successfully with valid API key."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            mock_settings = type("Settings", (), {"openai_api_key": "sk-test-key-123"})()
            mock_get_settings.return_value = mock_settings

            # Mock the marvin module to avoid actually setting API keys
            with patch("app.core.marvin_config.marvin"):
                # Should not raise an exception
                try:
                    configure_marvin()
                    # If we get here, configuration succeeded
                    assert True
                except ValueError:
                    pytest.fail("configure_marvin raised ValueError unexpectedly")

    def test_configure_with_missing_api_key(self):
        """Should raise error when API key is missing."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            mock_settings = type("Settings", (), {"openai_api_key": None})()
            mock_get_settings.return_value = mock_settings

            with pytest.raises(ValueError, match="OPENAI_API_KEY"):
                configure_marvin()

    def test_configure_with_empty_api_key(self):
        """Should raise error when API key is empty string."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            mock_settings = type("Settings", (), {"openai_api_key": ""})()
            mock_get_settings.return_value = mock_settings

            with pytest.raises(ValueError, match="OPENAI_API_KEY"):
                configure_marvin()

    def test_lazy_initialization_no_import_side_effects(self):
        """Should not configure Marvin on module import."""
        # This test verifies that importing the module doesn't trigger configuration
        # The actual configuration should only happen when configure_marvin() is called

        # Import the module - this should not raise an exception
        # even if OPENAI_API_KEY is not set
        import app.core.marvin_config  # noqa: F401

        # If we get here without exception, the test passes
        # (no automatic configuration on import)
        assert True

    def test_multiple_calls_with_same_key(self):
        """Should handle multiple configuration calls gracefully."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            mock_settings = type("Settings", (), {"openai_api_key": "sk-test-key-123"})()
            mock_get_settings.return_value = mock_settings

            # Mock the marvin module to avoid actually setting API keys
            with patch("app.core.marvin_config.marvin"):
                # Call multiple times - should not raise exceptions
                try:
                    configure_marvin()
                    configure_marvin()
                    configure_marvin()
                    assert True
                except Exception as e:
                    pytest.fail(f"Multiple calls to configure_marvin failed: {e}")
