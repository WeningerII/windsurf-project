// purpose: Weapon Masteries tab body — 2024-only mastery selection grid (gated by enableWeaponMasteries).
import { Badge } from '../../../../components/ui/Badge';
import { TabsContent } from '../../../../components/ui/Tabs';

interface Props {
  weaponMasteries: string[];
  options: readonly string[];
  canUpdate: boolean;
  onToggleMastery?: (mastery: string) => void;
}

export function Dnd5eWeaponMasteriesTab({
  weaponMasteries,
  options,
  canUpdate,
  onToggleMastery,
}: Props) {
  return (
    <TabsContent value="masteries">
      <section className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Weapon Masteries</h3>
          <Badge variant="secondary">{weaponMasteries.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((mastery) => {
            const active = weaponMasteries.includes(mastery.toLowerCase());
            return (
              <button
                key={mastery}
                type="button"
                onClick={() => onToggleMastery?.(mastery)}
                disabled={!canUpdate}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-input hover:border-primary/40'
                }`}
              >
                {mastery}
              </button>
            );
          })}
        </div>
      </section>
    </TabsContent>
  );
}
