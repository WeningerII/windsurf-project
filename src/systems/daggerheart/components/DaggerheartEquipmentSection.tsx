import { X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { INVENTORY_WEAPON_LIMIT } from '../daggerheartSheetConstants';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartEquipmentSection({ controller }: Props) {
  if (controller.optionsState !== 'ready') {
    return null;
  }

  const { canUpdate } = controller;
  const activePrimaryWeaponId = controller.activePrimaryWeapon?.id;
  const activeSecondaryWeaponId = controller.activeSecondaryWeapon?.id;

  const renderWeaponCard = (
    label: string,
    weapon: typeof controller.activePrimaryWeapon,
    options?: {
      clear?: () => void;
      store?: () => void;
      canStore?: boolean;
    }
  ) => {
    if (!weapon) {
      return (
        <article className="space-y-2 rounded-lg border border-dashed p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold">{label}</h4>
            <Badge variant="outline">Empty</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose a {label.toLowerCase()} from the library.
          </p>
        </article>
      );
    }

    return (
      <article className="space-y-3 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">{weapon.name}</h4>
              <Badge variant="secondary">Tier {weapon.tier}</Badge>
              <Badge variant="outline">{label}</Badge>
              {weapon.requiresSpellcast && <Badge variant="warning">Spellcast</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {weapon.trait} • {weapon.range} • {weapon.damage} • Burden {weapon.burden}
            </p>
          </div>
          {canUpdate && (
            <div className="flex flex-col items-end gap-2">
              {options?.canStore && options.store && (
                <button
                  type="button"
                  onClick={options.store}
                  className="rounded border border-input px-2 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  Stow
                </button>
              )}
              {options?.clear && (
                <button
                  type="button"
                  onClick={options.clear}
                  className="rounded p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title={`Clear ${label.toLowerCase()}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
        {weapon.feature && <p className="text-sm text-muted-foreground">{weapon.feature}</p>}
      </article>
    );
  };

  const renderArmorCard = () => {
    if (!controller.activeArmor) {
      return (
        <article className="space-y-2 rounded-lg border border-dashed p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold">Active Armor</h4>
            <Badge variant="outline">Unarmored</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Unarmored thresholds are derived from level only.
          </p>
        </article>
      );
    }

    return (
      <article className="space-y-3 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">{controller.activeArmor.name}</h4>
              <Badge variant="secondary">Tier {controller.activeArmor.tier}</Badge>
              <Badge variant="outline">Active Armor</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Base thresholds {controller.activeArmor.baseMajorThreshold}/
              {controller.activeArmor.baseSevereThreshold} • Armor Score{' '}
              {controller.activeArmor.baseArmorScore}
            </p>
          </div>
          {canUpdate && (
            <button
              type="button"
              onClick={controller.clearArmor}
              className="rounded p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Unequip armor"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {controller.activeArmor.feature && (
          <p className="text-sm text-muted-foreground">{controller.activeArmor.feature}</p>
        )}
      </article>
    );
  };

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Equipment Loadout</h3>
          <p className="text-sm text-muted-foreground">
            Equip one primary weapon, one secondary weapon, and one suit of armor. You can keep up
            to {INVENTORY_WEAPON_LIMIT} additional weapons stowed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Tier {controller.currentTier}</Badge>
          <Badge variant={controller.activeBurden > 2 ? 'warning' : 'outline'}>
            Burden {controller.activeBurden}/2
          </Badge>
          <Badge variant="outline">
            Stowed {controller.weaponLoadout.inventoryIds.length}/{INVENTORY_WEAPON_LIMIT}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {renderWeaponCard('Primary Weapon', controller.activePrimaryWeapon, {
          clear: controller.clearPrimaryWeapon,
          store: activePrimaryWeaponId
            ? () => controller.storeWeapon(activePrimaryWeaponId)
            : undefined,
          canStore:
            Boolean(activePrimaryWeaponId) &&
            !controller.weaponLoadout.inventoryIds.includes(activePrimaryWeaponId || '') &&
            controller.weaponLoadout.inventoryIds.length < INVENTORY_WEAPON_LIMIT,
        })}
        {renderWeaponCard('Secondary Weapon', controller.activeSecondaryWeapon, {
          clear: controller.clearSecondaryWeapon,
          store: activeSecondaryWeaponId
            ? () => controller.storeWeapon(activeSecondaryWeaponId)
            : undefined,
          canStore:
            Boolean(activeSecondaryWeaponId) &&
            !controller.weaponLoadout.inventoryIds.includes(activeSecondaryWeaponId || '') &&
            controller.weaponLoadout.inventoryIds.length < INVENTORY_WEAPON_LIMIT,
        })}
        {renderArmorCard()}
      </div>

      {controller.stowedWeapons.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold">Inventory Weapons</h4>
            <Badge variant="outline">{controller.stowedWeapons.length} carried</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {controller.stowedWeapons.map((weapon) => (
              <article key={weapon.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-semibold">{weapon.name}</h5>
                      <Badge variant="secondary">Tier {weapon.tier}</Badge>
                      <Badge variant="outline">{weapon.category}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {weapon.trait} • {weapon.range} • {weapon.damage} • Burden {weapon.burden}
                    </p>
                  </div>
                  {canUpdate && (
                    <button
                      type="button"
                      onClick={() => controller.removeStoredWeapon(weapon.id)}
                      className="rounded p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="Remove stowed weapon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {weapon.feature && (
                  <p className="text-sm text-muted-foreground">{weapon.feature}</p>
                )}
                {canUpdate && (
                  <div className="flex flex-wrap gap-2">
                    {weapon.category === 'primary' && (
                      <button
                        type="button"
                        onClick={() => controller.equipPrimaryWeapon(weapon.id)}
                        disabled={
                          (controller.activeSecondaryWeapon?.burden || 0) + weapon.burden > 2
                        }
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Equip Primary
                      </button>
                    )}
                    {weapon.category === 'secondary' && (
                      <button
                        type="button"
                        onClick={() => controller.equipSecondaryWeapon(weapon.id)}
                        disabled={(controller.activePrimaryWeapon?.burden || 0) + weapon.burden > 2}
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Equip Secondary
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="primary">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="primary">Primary Library</TabsTrigger>
          <TabsTrigger value="secondary">Secondary Library</TabsTrigger>
          <TabsTrigger value="armor">Armor Library</TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing SRD primary weapons up to tier {controller.currentTier}. Two-handed primary
              weapons cannot be paired with an active secondary weapon.
            </p>
            <input
              type="search"
              value={controller.weaponSearch}
              onChange={(event) => controller.setWeaponSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search weapons"
              aria-label="Search Daggerheart weapons"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredPrimaryWeapons.map((weapon) => {
              const isEquipped = controller.activePrimaryWeapon?.id === weapon.id;
              const isStowed = controller.weaponLoadout.inventoryIds.includes(weapon.id);
              const burdenBlocked =
                (controller.activeSecondaryWeapon?.burden || 0) + weapon.burden > 2;
              return (
                <article key={weapon.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{weapon.name}</h4>
                        <Badge variant="secondary">Tier {weapon.tier}</Badge>
                        <Badge variant="outline">{weapon.damageType}</Badge>
                        {weapon.requiresSpellcast && <Badge variant="warning">Spellcast</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {weapon.trait} • {weapon.range} • {weapon.damage} • Burden {weapon.burden}
                      </p>
                    </div>
                    {isEquipped && <Badge variant="info">Equipped</Badge>}
                  </div>
                  {weapon.feature && (
                    <p className="text-sm text-muted-foreground">{weapon.feature}</p>
                  )}
                  {canUpdate && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => controller.equipPrimaryWeapon(weapon.id)}
                        disabled={isEquipped || burdenBlocked}
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Equip Primary
                      </button>
                      <button
                        type="button"
                        onClick={() => controller.storeWeapon(weapon.id)}
                        disabled={
                          isEquipped ||
                          isStowed ||
                          controller.weaponLoadout.inventoryIds.length >= INVENTORY_WEAPON_LIMIT
                        }
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Stow Weapon
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="secondary" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Secondary weapons stay within one hand of burden. The current primary weapon leaves{' '}
              {controller.availableSecondaryBurden} hand(s) free.
            </p>
            <input
              type="search"
              value={controller.weaponSearch}
              onChange={(event) => controller.setWeaponSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search weapons"
              aria-label="Search Daggerheart secondary weapons"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredSecondaryWeapons.map((weapon) => {
              const isEquipped = controller.activeSecondaryWeapon?.id === weapon.id;
              const isStowed = controller.weaponLoadout.inventoryIds.includes(weapon.id);
              const burdenBlocked =
                (controller.activePrimaryWeapon?.burden || 0) + weapon.burden > 2;
              return (
                <article key={weapon.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{weapon.name}</h4>
                        <Badge variant="secondary">Tier {weapon.tier}</Badge>
                        {weapon.tags?.includes('shield') && <Badge variant="warning">Shield</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {weapon.trait} • {weapon.range} • {weapon.damage} • Burden {weapon.burden}
                      </p>
                    </div>
                    {isEquipped && <Badge variant="info">Equipped</Badge>}
                  </div>
                  {weapon.feature && (
                    <p className="text-sm text-muted-foreground">{weapon.feature}</p>
                  )}
                  {canUpdate && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => controller.equipSecondaryWeapon(weapon.id)}
                        disabled={isEquipped || burdenBlocked}
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Equip Secondary
                      </button>
                      <button
                        type="button"
                        onClick={() => controller.storeWeapon(weapon.id)}
                        disabled={
                          isEquipped ||
                          isStowed ||
                          controller.weaponLoadout.inventoryIds.length >= INVENTORY_WEAPON_LIMIT
                        }
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Stow Weapon
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="armor" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing armor through tier {controller.currentTier}. Armor recalculates Armor Score
              and damage thresholds from the SRD tables.
            </p>
            <input
              type="search"
              value={controller.armorSearch}
              onChange={(event) => controller.setArmorSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search armor"
              aria-label="Search Daggerheart armor"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredArmor.map((armor) => {
              const isEquipped = controller.activeArmor?.id === armor.id;
              return (
                <article key={armor.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{armor.name}</h4>
                        <Badge variant="secondary">Tier {armor.tier}</Badge>
                        <Badge variant="outline">Armor Score {armor.baseArmorScore}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Base thresholds {armor.baseMajorThreshold}/{armor.baseSevereThreshold}
                      </p>
                    </div>
                    {isEquipped && <Badge variant="info">Equipped</Badge>}
                  </div>
                  {armor.feature && (
                    <p className="text-sm text-muted-foreground">{armor.feature}</p>
                  )}
                  {canUpdate && (
                    <button
                      type="button"
                      onClick={() => controller.equipArmor(armor.id)}
                      disabled={isEquipped}
                      className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                    >
                      Equip Armor
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
