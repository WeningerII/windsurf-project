import { useEffect, useState } from 'react';
import { createSceneDocument, positiveIntegerOrDefault } from '../../scene/runtime';
import { generateUUID } from '../../utils/browserCompat';
import type { Campaign } from '../../types/core/campaign';
import type { SceneDocument } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface SceneCreateFormProps {
  /** Whether the form is expanded; the parent owns the toggling button. */
  open: boolean;
  systemOptions: ReadonlyArray<{ id: string; label: string }>;
  campaigns: Campaign[];
  /** Fallback system when the chosen one isn't in the options. */
  defaultSystemId: string;
  onCancel: () => void;
  /** Emitted with the built scene; the parent persists and selects it. */
  onCreate: (scene: SceneDocument) => void;
}

/**
 * Self-contained "new scene" form, extracted from SceneManager to shrink that
 * component. Owns its own draft fields; the parent keeps the toggle so the
 * collapsed "New Scene" button can live in the toolbar. Behavior is unchanged:
 * choosing a campaign adopts its system, and the field state persists while the
 * form stays mounted (only the name clears on create/cancel).
 */
export function SceneCreateForm({
  open,
  systemOptions,
  campaigns,
  defaultSystemId,
  onCancel,
  onCreate,
}: SceneCreateFormProps) {
  const [name, setName] = useState('');
  const [systemId, setSystemId] = useState<string>(defaultSystemId);
  const [campaignId, setCampaignId] = useState('');
  const [width, setWidth] = useState('12');
  const [height, setHeight] = useState('10');

  // Keep the chosen system valid as the registry/options resolve.
  useEffect(() => {
    if (systemOptions.some((system) => system.id === systemId)) return;
    setSystemId(defaultSystemId);
  }, [defaultSystemId, systemId, systemOptions]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const id = generateUUID();
    const chosenCampaignId = campaignId || undefined;
    const campaign = chosenCampaignId
      ? campaigns.find((entry) => entry.id === chosenCampaignId)
      : undefined;
    const scene = createSceneDocument({
      id,
      name: trimmed,
      systemId: campaign?.systemId ?? systemId,
      campaignId: chosenCampaignId,
      seed: id,
      grid: {
        width: positiveIntegerOrDefault(width, 12),
        height: positiveIntegerOrDefault(height, 10),
      },
    });

    onCreate(scene);
    setName('');
  };

  if (!open) return null;

  return (
    <div className="grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_minmax(10rem,14rem)_5rem_5rem_auto_auto] md:items-center">
      <Input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleCreate();
          if (event.key === 'Escape') onCancel();
        }}
        placeholder="Scene name"
      />
      <Select
        aria-label="Scene campaign"
        value={campaignId}
        onChange={(event) => {
          const nextCampaignId = event.target.value;
          setCampaignId(nextCampaignId);
          const campaign = campaigns.find((entry) => entry.id === nextCampaignId);
          if (campaign?.systemId) {
            setSystemId(campaign.systemId);
          }
        }}
      >
        <option value="">No campaign</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.name}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Scene system"
        value={systemId}
        onChange={(event) => setSystemId(event.target.value)}
      >
        {systemOptions.map((system) => (
          <option key={system.id} value={system.id}>
            {system.label}
          </option>
        ))}
      </Select>
      <Input
        aria-label="Scene width"
        inputMode="numeric"
        value={width}
        onChange={(event) => setWidth(event.target.value)}
      />
      <Input
        aria-label="Scene height"
        inputMode="numeric"
        value={height}
        onChange={(event) => setHeight(event.target.value)}
      />
      <Button size="sm" onClick={handleCreate} disabled={!name.trim()}>
        Create
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          onCancel();
          setName('');
        }}
      >
        Cancel
      </Button>
    </div>
  );
}
