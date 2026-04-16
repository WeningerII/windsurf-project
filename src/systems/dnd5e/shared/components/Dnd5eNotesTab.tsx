import { TabsContent } from '../../../../components/ui/Tabs';

type Dnd5ePersonality = Partial<{
  appearance: string;
  backstory: string;
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}>;

interface Props {
  personality?: Dnd5ePersonality;
  notes?: string;
  canUpdate: boolean;
  onAppearanceChange?: (value: string) => void;
  onBackstoryChange?: (value: string) => void;
  onPersonalityFieldChange?: (
    field: 'traits' | 'ideals' | 'bonds' | 'flaws',
    value: string
  ) => void;
  onNotesChange?: (value: string) => void;
}

export function Dnd5eNotesTab({
  personality,
  notes,
  canUpdate,
  onAppearanceChange,
  onBackstoryChange,
  onPersonalityFieldChange,
  onNotesChange,
}: Props) {
  return (
    <TabsContent value="notes">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <h3 className="text-lg font-semibold">Identity</h3>
          <div>
            <label className="mb-1 block text-sm font-medium">Appearance</label>
            <textarea
              value={personality?.appearance || ''}
              onChange={(event) => onAppearanceChange?.(event.target.value)}
              aria-label="Appearance"
              className="min-h-[90px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Physical appearance..."
              disabled={!canUpdate}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Backstory</label>
            <textarea
              value={personality?.backstory || ''}
              onChange={(event) => onBackstoryChange?.(event.target.value)}
              aria-label="Backstory"
              className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Character backstory..."
              disabled={!canUpdate}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-4">
          <h3 className="text-lg font-semibold">Personality</h3>
          {(['traits', 'ideals', 'bonds', 'flaws'] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
              <textarea
                value={personality?.[field] || ''}
                onChange={(event) => onPersonalityFieldChange?.(field, event.target.value)}
                aria-label={field}
                className="min-h-[70px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder={`${field}...`}
                disabled={!canUpdate}
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea
              value={notes || ''}
              onChange={(event) => onNotesChange?.(event.target.value)}
              aria-label="Notes"
              className="min-h-[110px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Additional notes..."
              disabled={!canUpdate}
            />
          </div>
        </div>
      </section>
    </TabsContent>
  );
}
