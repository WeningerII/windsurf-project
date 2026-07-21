import { useMemo, useState } from 'react';
import { Download, Map as MapIcon, Plus, Upload } from 'lucide-react';
import { foldSceneEvents } from '../scene/runtime';
import { systemRegistry } from '../registry';
import type { Campaign } from '../types/core/campaign';
import type { SceneDocument } from '../types/core/scene';
import {
  exportScenes,
  importMapAssetsFromPayload,
  importScenesWithReport,
} from '../utils/sceneStorage';
import { downloadTextFile, pickTextFile } from '../utils/fileTransfer';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { useToast } from './ui/Toast';
import { SceneCreateForm } from './scene/SceneCreateForm';

const DEFAULT_SYSTEM_ID = 'dnd-5e-2024';

interface Props {
  scenes: SceneDocument[];
  campaigns: Campaign[];
  /** Shell-owned selection (useAppNav.sceneId); highlights the current scene. */
  selectedSceneId: string | null;
  /**
   * The shell's scene-selection seam. Selecting here (card click, create,
   * import) routes through useAppNav.selectScene, which also flips to the
   * Scene surface for non-null ids — picker → canvas is one action.
   */
  onSelectScene: (id: string | null) => void;
  onAddScene: (scene: SceneDocument) => void;
  onAddScenes: (scenes: SceneDocument[]) => void;
}

/**
 * Select-only scenes home for the Library's Scenes segment: campaign filter,
 * scene cards, create, and import — extracted from SceneManager's former left
 * list rail. The operating canvas (grid, panels) is SceneManager on the Scene
 * surface; this view deliberately renders no operating panels so the
 * picker → canvas IA is real.
 */
export function LibraryScenesView({
  scenes,
  campaigns,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onAddScenes,
}: Props) {
  const systemOptions = useMemo(() => systemRegistry.getAll(), []);
  const fallbackSystemId = systemOptions[0]?.id ?? DEFAULT_SYSTEM_ID;
  const [creatingNew, setCreatingNew] = useState(false);
  // Scene-list filter: '' = all, a campaign id = that campaign's encounters,
  // 'none' = scenes not assigned to any campaign.
  const [sceneCampaignFilter, setSceneCampaignFilter] = useState('');
  const [importIssue, setImportIssue] = useState<string | null>(null);
  const { toast } = useToast();

  // Card fold summaries: event logs grow without bound, and folding every
  // scene inline made each keystroke O(total events across all scenes).
  const foldedScenesById = useMemo(
    () => new Map(scenes.map((scene) => [scene.id, foldSceneEvents(scene)])),
    [scenes]
  );

  const handleImportScenes = () => {
    pickTextFile((text) => {
      try {
        const { scenes: imported, droppedCount } = importScenesWithReport(text);
        const skipped =
          droppedCount > 0
            ? ` — ${droppedCount} invalid ${droppedCount === 1 ? 'entry' : 'entries'} skipped`
            : '';
        // Valid JSON can still contain no usable scenes (every candidate
        // structurally invalid). Say so instead of silently no-op'ing.
        if (imported.length === 0) {
          setImportIssue(
            droppedCount > 0
              ? `No valid scenes were found in that file${skipped}.`
              : 'No valid scenes were found in that file.'
          );
          return;
        }
        setImportIssue(null);
        onAddScenes(imported);
        // A partial import is surfaced, not silent — as a toast, because
        // selecting the first imported scene flips to the Scene surface.
        if (droppedCount > 0) {
          toast(
            `Imported ${imported.length} of ${imported.length + droppedCount} scenes${skipped}.`,
            'info'
          );
        }
        // Map images ride the export by value; each is re-hashed before it is
        // stored, and a failed check only drops the image (the scene renders
        // its bare grid). Async on purpose — scene import stays synchronous.
        void importMapAssetsFromPayload(text).then(({ droppedCount: droppedAssets }) => {
          if (droppedAssets > 0) {
            toast(
              `${droppedAssets} map image${droppedAssets === 1 ? '' : 's'} failed verification and ${droppedAssets === 1 ? 'was' : 'were'} skipped.`,
              'info'
            );
          }
        });
        onSelectScene(imported[0].id);
      } catch (err) {
        setImportIssue(err instanceof Error ? err.message : 'Failed to import scenes.');
      }
    });
  };

  const filteredScenes = scenes.filter((scene) =>
    sceneCampaignFilter === ''
      ? true
      : sceneCampaignFilter === 'none'
        ? !scene.campaignId
        : scene.campaignId === sceneCampaignFilter
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <MapIcon className="h-6 w-6" /> Scenes
          </h3>
          <p className="text-sm text-muted-foreground">
            {scenes.length} scene{scenes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleImportScenes}>
            <Upload className="mr-1.5 h-4 w-4" />
            Import Scenes
          </Button>
          {scenes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadTextFile(
                  exportScenes(scenes),
                  `all_scenes_${new Date().toISOString().slice(0, 10)}.json`
                )
              }
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export All Scenes
            </Button>
          )}
          {!creatingNew && (
            <Button variant="outline" size="sm" onClick={() => setCreatingNew(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Scene
            </Button>
          )}
        </div>
      </div>

      <SceneCreateForm
        open={creatingNew}
        systemOptions={systemOptions}
        campaigns={campaigns}
        defaultSystemId={fallbackSystemId}
        onCancel={() => setCreatingNew(false)}
        onCreate={(scene) => {
          onAddScene(scene);
          setCreatingNew(false);
          setImportIssue(null);
          // Create-then-open: the seam selects the new scene AND lands on the
          // live canvas (useAppNav flips the surface for non-null ids).
          onSelectScene(scene.id);
        }}
      />

      {importIssue && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {importIssue}
        </div>
      )}

      {scenes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No scenes yet. Create one to get started, or import a scenes file.
        </p>
      ) : (
        <div className="space-y-2">
          {campaigns.length > 0 && (
            <Select
              aria-label="Filter scenes by campaign"
              className="max-w-xs"
              value={sceneCampaignFilter}
              onChange={(event) => setSceneCampaignFilter(event.target.value)}
            >
              <option value="">All campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
              <option value="none">No campaign</option>
            </Select>
          )}
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {filteredScenes.map((scene) => {
              const { state: sceneState, issues } = foldedScenesById.get(scene.id)!;
              const system = systemRegistry.get(scene.systemId);
              const campaign = scene.campaignId
                ? campaigns.find((entry) => entry.id === scene.campaignId)
                : undefined;
              const isSelected = scene.id === selectedSceneId;

              return (
                <button
                  key={scene.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectScene(scene.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{scene.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {system?.label ?? scene.systemId}
                        {campaign ? ` / ${campaign.name}` : ''}
                      </div>
                    </div>
                    {issues.length > 0 && (
                      <Badge variant="destructive" className="shrink-0">
                        {issues.length}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                    <span>{Object.keys(sceneState.tokens).length} tokens</span>
                    <span>{Object.keys(sceneState.markers).length} markers</span>
                    <span>{scene.events.length} events</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
