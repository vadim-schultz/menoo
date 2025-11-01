import { Button } from '../../../shared/components';
import type { ApiError } from '../../../shared/types';

interface RecipeAIAssistantProps {
  canGenerate: boolean;
  canEnhance: boolean;
  generating: boolean;
  onGenerate: () => void;
  onEnhance: () => void;
  generationError?: ApiError | null;
}

export function RecipeAIAssistant({
  canGenerate,
  canEnhance,
  generating,
  onGenerate,
  onEnhance,
  generationError,
}: RecipeAIAssistantProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        marginTop: '1rem',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>🤖</span>
          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>AI Assistant</h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
          {canGenerate && !canEnhance
            ? 'Add ingredients and click "Generate with AI" to create a complete recipe.'
            : canEnhance
              ? 'Fill in missing fields or generate a complete recipe with AI.'
              : 'Add ingredients to enable AI recipe generation.'}
        </p>
        {generationError && (
          <p
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.75rem',
              color: 'var(--color-error)',
            }}
          >
            ⚠️ {generationError.detail || 'AI generation failed. Please try again.'}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        {canEnhance && (
          <Button
            variant="secondary"
            onClick={onEnhance}
            disabled={generating}
            type="button"
          >
            {generating ? 'Enhancing...' : 'Fill with AI'}
          </Button>
        )}
        {canGenerate && (
          <Button onClick={onGenerate} disabled={generating} type="button">
            {generating ? 'Generating...' : 'Generate with AI'}
          </Button>
        )}
      </div>
    </div>
  );
}

