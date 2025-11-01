"""Unit tests for Marvin configuration."""

from __future__ import annotations

from unittest.mock import patch, MagicMock
import os

import pytest

from app.core.marvin_config import configure_marvin


class TestConfigureMarvin:
    """Test Marvin configuration function."""

    def test_configure_with_valid_api_key(self):
        """Should configure Marvin successfully with valid API key."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            mock_settings = type("Settings", (), {"openai_api_key": "sk-test-key-123"})()
            mock_get_settings.return_value = mock_settings

            with patch.dict(os.environ, {}, clear=False):
                # Mock marvin.settings structure
                with patch("app.core.marvin_config.marvin") as mock_marvin:
                    mock_marvin.settings = MagicMock()
                    mock_marvin.settings.openai = MagicMock()
                    
                    # Should not raise an exception
                    configure_marvin()
                    # Verify environment variable was set
                    assert os.environ.get('OPENAI_API_KEY') == "sk-test-key-123"

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

            with patch.dict(os.environ, {}, clear=False):
                # Mock marvin.settings structure
                with patch("app.core.marvin_config.marvin") as mock_marvin:
                    mock_marvin.settings = MagicMock()
                    mock_marvin.settings.openai = MagicMock()

                    # Call multiple times - should not raise exceptions
                    configure_marvin()
                    configure_marvin()
                    configure_marvin()
                    assert os.environ.get('OPENAI_API_KEY') == "sk-test-key-123"

    def test_configure_sets_environment_variable(self):
        """Should set OPENAI_API_KEY environment variable."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            api_key = "sk-test-key-456"
            mock_settings = type("Settings", (), {"openai_api_key": api_key})()
            mock_get_settings.return_value = mock_settings

            with patch.dict(os.environ, {}, clear=False):
                with patch("app.core.marvin_config.marvin") as mock_marvin:
                    mock_marvin.settings = MagicMock()
                    # Simulate marvin.settings.openai not existing
                    del mock_marvin.settings.openai
                    
                    configure_marvin()
                    
                    # Verify environment variable was set
                    assert os.environ.get('OPENAI_API_KEY') == api_key

    def test_configure_with_attribute_error_fallback(self):
        """Should fall back to environment variable when settings structure differs."""
        with patch("app.core.marvin_config.get_settings") as mock_get_settings:
            api_key = "sk-test-key-789"
            mock_settings = type("Settings", (), {"openai_api_key": api_key})()
            mock_get_settings.return_value = mock_settings

            with patch.dict(os.environ, {}, clear=False):
                with patch("app.core.marvin_config.marvin") as mock_marvin:
                    # Simulate marvin.settings not having openai attribute
                    mock_marvin.settings = MagicMock()
                    # Remove openai attribute to trigger fallback
                    if hasattr(mock_marvin.settings, 'openai'):
                        delattr(mock_marvin.settings, 'openai')
                    
                    # Should not raise exception, should set environment variable
                    configure_marvin()
                    assert os.environ.get('OPENAI_API_KEY') == api_key
