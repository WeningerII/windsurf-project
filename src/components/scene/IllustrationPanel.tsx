import { useState } from 'react';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import type { GeneratedImageData } from '../../ai/contracts';
import type { IllustrateSceneResult } from '../../ai/illustrateSceneFlow';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

/** Art-style presets (kept provider-agnostic; just prompt flavor). */
const ILLUSTRATION_STYLES = ['painterly', 'ink', 'watercolor', 'photoreal', 'comic'] as const;

interface IllustrationPanelProps {
  /** Generate an image from a prompt + style. Injected so the panel is testable. */
  illustrate: (params: { prompt: string; style: string }) => Promise<IllustrateSceneResult>;
}

/**
 * AI scene illustration: a creative aid that turns a text prompt into a picture
 * the GM can view or download. Deliberately NOT wired into the event-sourced
 * scene state — generated imagery is human-judged and ephemeral, so it can never
 * corrupt anything deterministic. Rendered only when AI is enabled.
 */
export function IllustrationPanel({ illustrate }: IllustrationPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>(ILLUSTRATION_STYLES[0]);
  const [busy, setBusy] = useState(false);
  const [image, setImage] = useState<GeneratedImageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await illustrate({ prompt, style });
      if (result.ok) setImage(result.image);
      else setError(result.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <ImageIcon className="h-4 w-4" /> Scene Art
        </h5>
      </div>
      <div className="space-y-2">
        <textarea
          aria-label="Illustration prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="e.g. a torchlit crypt with cracked sarcophagi and green mist…"
          rows={2}
          disabled={busy}
          className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
        />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <Select
            aria-label="Art style"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            disabled={busy}
          >
            {ILLUSTRATION_STYLES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={busy || !prompt.trim()}
            title="Generate an illustration from this prompt"
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {busy ? 'Generating…' : 'Generate'}
          </Button>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {image && (
          <div className="space-y-1.5">
            <img
              src={image.dataUrl}
              alt={`AI illustration: ${prompt}`}
              className="w-full rounded-md border"
            />
            <a
              href={image.dataUrl}
              download="scene-illustration.png"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          AI imagery is a creative aid you review; it is not saved to the campaign.
        </p>
      </div>
    </div>
  );
}
