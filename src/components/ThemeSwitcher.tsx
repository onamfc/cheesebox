"use client";

/**
 * Theme Switcher Component
 * =========================
 *
 * UI component for switching between available themes.
 * Provides live preview with confirm/revert options.
 */

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/Button';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  category: string;
  preview?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
}

export default function ThemeSwitcher() {
  const { currentTheme, previewTheme, confirmTheme, revertTheme, isPreviewMode } = useTheme();
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available themes
  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/themes');

      if (!response.ok) {
        throw new Error('Failed to load themes');
      }

      const data = await response.json();
      console.log('Loaded themes:', data); // Debug: check if colors are included
      setThemes(data);
    } catch (err) {
      setError('Failed to load themes');
      console.error('Error loading themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (themeId: string) => {
    previewTheme(themeId);
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);
      setError(null);
      await confirmTheme();
    } catch (err) {
      setError('Failed to save theme preference');
      console.error('Error saving theme:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    revertTheme();
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">Loading themes...</p>
      </div>
    );
  }

  if (error && themes.length === 0) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-800">{error}</p>
        <Button variant="secondary" size="sm" onClick={loadThemes} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Preview Mode</h3>
              <p className="text-sm text-blue-700 mt-1">
                You're previewing a theme. Confirm to save or revert to go back.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRevert}
                disabled={saving}
              >
                Revert
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                loading={saving}
                disabled={saving}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Theme List */}
      <div className="space-y-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative px-4 py-3 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md ${
              currentTheme === theme.id
                ? 'border-purple-950 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
            onClick={() => handlePreview(theme.id)}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Theme Name */}
              <h3 className="text-base font-semibold text-gray-900 min-w-[100px]">
                {theme.name}
              </h3>

              {/* Color Palette - Slack-style horizontal swatches */}
              {theme.colors ? (
                <div className="flex gap-1 flex-1">
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.success }}
                    title="Success"
                  />
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.warning }}
                    title="Warning"
                  />
                  <div
                    className="h-8 flex-1 rounded-sm border border-gray-200"
                    style={{ backgroundColor: theme.colors.danger }}
                    title="Danger"
                  />
                </div>
              ) : (
                <div className="flex-1 text-xs text-red-500">
                  No colors defined for {theme.id}
                </div>
              )}

              {/* Active Badge or Preview Hint */}
              <div className="min-w-[100px] text-right">
                {currentTheme === theme.id && !isPreviewMode ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-950 text-white">
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">Click to preview</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Themes Message */}
      {themes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No themes available.</p>
        </div>
      )}
    </div>
  );
}
