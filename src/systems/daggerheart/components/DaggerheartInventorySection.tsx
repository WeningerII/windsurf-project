import { Coins, Plus, X } from 'lucide-react';
import { CurrencyEditor } from '../../../components/CurrencyEditor';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import type { DaggerheartInventoryDefinition } from '../../../types/daggerheart';
import {
  isDaggerheartConsumableDefinition,
  MAX_DAGGERHEART_CONSUMABLE_QUANTITY,
} from '../../../rules/daggerheartInventory';
import { parseNum } from '../../../utils/math';
import { DAGGERHEART_CURRENCY_FIELDS } from '../daggerheartSheetConstants';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartInventorySection({ controller }: Props) {
  const { canUpdate } = controller;

  const renderInventoryLibraryCard = (definition: DaggerheartInventoryDefinition) => {
    const ownedEntry = controller.data.inventory.find((entry) => entry.itemId === definition.id);
    const isConsumable = isDaggerheartConsumableDefinition(definition);
    const quantity = ownedEntry?.quantity ?? 0;
    const addDisabled = isConsumable && quantity >= MAX_DAGGERHEART_CONSUMABLE_QUANTITY;

    return (
      <article key={definition.id} className="space-y-3 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">{definition.name}</h4>
              <Badge variant="outline">
                {definition.category === 'loot' ? 'Loot' : 'Consumable'}
              </Badge>
              {ownedEntry && (
                <Badge variant="secondary">
                  {isConsumable
                    ? `${quantity}/${MAX_DAGGERHEART_CONSUMABLE_QUANTITY}`
                    : `Owned x${quantity}`}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{definition.description}</p>
          </div>
        </div>
        {definition.tags && definition.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {definition.tags.map((tag) => (
              <Badge key={`${definition.id}-${tag}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {canUpdate && (
          <button
            type="button"
            onClick={() => controller.addInventoryDefinition(definition)}
            disabled={addDisabled}
            className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
          >
            {ownedEntry ? (isConsumable ? 'Add Another' : 'Add Copy') : 'Add to Inventory'}
          </button>
        )}
      </article>
    );
  };

  const renderInventoryEntry = (
    { entry, definition }: (typeof controller.inventoryEntries)[number],
    index: number
  ) => {
    const isSourceBacked = Boolean(definition);
    const isConsumable = isDaggerheartConsumableDefinition(definition);
    const notesLabel = isSourceBacked ? 'Notes' : 'Description';

    return (
      <article key={`${entry.itemId}-${index}`} className="space-y-3 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {isSourceBacked ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{definition?.name}</h4>
                  <Badge variant="outline">
                    {definition?.category === 'loot' ? 'Loot' : 'Consumable'}
                  </Badge>
                  {definition?.tags?.includes('relic') && <Badge variant="warning">Relic</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{definition?.description}</p>
              </div>
            ) : (
              <input
                value={entry.name}
                onChange={(event) =>
                  controller.updateInventoryEntry(entry.itemId, { name: event.target.value }, index)
                }
                className="w-full border-b border-input bg-transparent text-sm font-medium focus:border-primary focus:outline-none"
                disabled={!canUpdate}
                placeholder="Item name"
              />
            )}

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Qty</span>
                <input
                  type="number"
                  value={entry.quantity}
                  onChange={(event) =>
                    controller.updateInventoryEntry(
                      entry.itemId,
                      { quantity: parseNum(event.target.value, 1) },
                      index
                    )
                  }
                  className="w-16 border-b border-input bg-transparent text-center text-sm tabular-nums focus:border-primary focus:outline-none"
                  min={1}
                  max={isConsumable ? MAX_DAGGERHEART_CONSUMABLE_QUANTITY : undefined}
                  disabled={!canUpdate}
                  title={`${entry.name || definition?.name || 'Inventory item'} quantity`}
                />
              </label>
              {isConsumable && canUpdate && (
                <button
                  type="button"
                  onClick={() => controller.consumeInventoryItem(entry.itemId)}
                  className="rounded border border-input px-2 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  Use One
                </button>
              )}
            </div>
          </div>
          {canUpdate && (
            <button
              type="button"
              onClick={() => controller.removeInventoryEntry(index)}
              className="rounded p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Remove inventory item"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {notesLabel}
          </p>
          <textarea
            value={entry.description}
            onChange={(event) =>
              controller.updateInventoryEntry(
                entry.itemId,
                { description: event.target.value },
                index
              )
            }
            className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground focus:border-primary focus:outline-none"
            rows={isSourceBacked ? 3 : 2}
            disabled={!canUpdate}
            placeholder={isSourceBacked ? 'Optional notes...' : 'Item description...'}
          />
        </div>
      </article>
    );
  };

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Coins className="h-5 w-5" /> Inventory & Gold
          </h3>
          <p className="text-sm text-muted-foreground">
            Track Daggerheart gold, carried loot, and consumables from the SRD libraries. Ten
            handfuls roll into a bag, and ten bags roll into a chest.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Loot {controller.inventoryCounts.loot}</Badge>
          <Badge variant="secondary">Consumables {controller.inventoryCounts.consumables}</Badge>
          <Badge variant="outline">
            Gold {controller.currency.handfuls}H / {controller.currency.bags}B /{' '}
            {controller.currency.chests}C
          </Badge>
        </div>
      </div>

      <CurrencyEditor
        currency={controller.currency}
        onChange={canUpdate ? controller.updateCurrency : undefined}
        entries={[...DAGGERHEART_CURRENCY_FIELDS]}
      />

      {controller.relicEntries.length > 1 && (
        <p className="text-sm text-amber-600">
          Multiple relics are recorded in inventory. The SRD only allows carrying one relic at a
          time.
        </p>
      )}

      <Tabs defaultValue="inventory">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="loot">Loot Library</TabsTrigger>
          <TabsTrigger value="consumables">Consumables</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-3">
          {controller.inventoryEntries.length > 0 ? (
            controller.inventoryEntries.map(renderInventoryEntry)
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No inventory recorded yet. Add custom gear or pull items from the SRD libraries.
            </p>
          )}

          {canUpdate && (
            <button
              type="button"
              onClick={controller.addCustomInventoryItem}
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-input py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Add Custom Item
            </button>
          )}
        </TabsContent>

        <TabsContent value="loot" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Reusable Daggerheart SRD loot, recipes, relics, and utility items.
            </p>
            <input
              type="search"
              value={controller.lootSearch}
              onChange={(event) => controller.setLootSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search loot"
              aria-label="Search Daggerheart loot"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredLoot.map(renderInventoryLibraryCard)}
          </div>
          {controller.filteredLoot.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              No SRD loot matches the current search.
            </p>
          )}
        </TabsContent>

        <TabsContent value="consumables" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Consumables are one-use SRD items. You can carry up to{' '}
              {MAX_DAGGERHEART_CONSUMABLE_QUANTITY} of each.
            </p>
            <input
              type="search"
              value={controller.consumableSearch}
              onChange={(event) => controller.setConsumableSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search consumables"
              aria-label="Search Daggerheart consumables"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredConsumables.map(renderInventoryLibraryCard)}
          </div>
          {controller.filteredConsumables.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              No SRD consumables match the current search.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
