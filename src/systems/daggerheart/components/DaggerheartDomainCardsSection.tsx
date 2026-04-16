import { X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import {
  DOMAIN_CARD_TYPE_LABELS,
  LOADOUT_LIMIT,
  normalizeDomainId,
} from '../daggerheartSheetConstants';
import { DaggerheartDomainCardAutomation } from '../daggerheartSheetShared';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartDomainCardsSection({ controller }: Props) {
  const { canUpdate } = controller;

  const renderOwnedDomainCard = ({
    entry,
    definition,
  }: (typeof controller.ownedDomainCards)[number]) => {
    const domainLabel =
      controller.domainOptions.find(
        (domain) => domain.id === normalizeDomainId(String(entry.domain))
      )?.name ?? String(entry.domain || 'Unknown');
    const location = entry.location ?? 'loadout';
    const showStructuredDetails = Boolean(definition);

    return (
      <article key={entry.id} className="space-y-3 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {showStructuredDetails || !canUpdate ? (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold">{entry.name}</h4>
                  <Badge variant="outline">{domainLabel}</Badge>
                  <Badge variant="secondary">Level {entry.level}</Badge>
                  {entry.type && (
                    <Badge variant="secondary">{DOMAIN_CARD_TYPE_LABELS[entry.type]}</Badge>
                  )}
                  {entry.recallCost !== undefined && (
                    <Badge variant="warning">Recall {entry.recallCost}</Badge>
                  )}
                  {!showStructuredDetails && <Badge variant="warning">Legacy</Badge>}
                </div>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {entry.description}
                </p>
                <DaggerheartDomainCardAutomation card={definition} />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={entry.name}
                    onChange={(event) =>
                      controller.updateDomainCardEntry(entry.id, { name: event.target.value })
                    }
                    className="border-b border-input bg-transparent text-sm font-medium focus:border-primary focus:outline-none"
                    placeholder="Legacy card name"
                  />
                  <Badge variant="warning">Legacy</Badge>
                  <Badge variant="outline">{domainLabel}</Badge>
                  <Badge variant="secondary">Level {entry.level}</Badge>
                </div>
                <textarea
                  value={entry.description}
                  onChange={(event) =>
                    controller.updateDomainCardEntry(entry.id, { description: event.target.value })
                  }
                  className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground focus:border-primary focus:outline-none"
                  rows={4}
                />
                <DaggerheartDomainCardAutomation card={definition} />
              </div>
            )}
          </div>
          {canUpdate && (
            <div className="flex flex-col items-end gap-2">
              {location === 'loadout' ? (
                <button
                  type="button"
                  onClick={() => controller.moveDomainCard(entry.id, 'vault')}
                  className="rounded border border-input px-2 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  Move to Vault
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => controller.moveDomainCard(entry.id, 'loadout')}
                  disabled={controller.loadoutCount >= LOADOUT_LIMIT}
                  className="rounded border border-input px-2 py-1 text-xs transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                >
                  Move to Loadout
                </button>
              )}
              <button
                type="button"
                onClick={() => controller.removeDomainCard(entry.id)}
                className="rounded p-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Remove domain card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Domain Cards</h3>
          <p className="text-sm text-muted-foreground">
            Build a real Daggerheart loadout from the SRD domain decks. You can keep up to{' '}
            {LOADOUT_LIMIT} cards active at one time and stash the rest in your vault.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            Loadout {controller.loadoutCount}/{LOADOUT_LIMIT}
          </Badge>
          <Badge variant="outline">Vault {controller.vaultCards.length}</Badge>
          <Badge variant="outline">Owned {controller.ownedDomainCards.length}</Badge>
        </div>
      </div>

      {controller.selectedDomains.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {controller.selectedDomains.map((domain) => (
            <article key={domain.id} className="space-y-2 rounded-lg border bg-muted/10 p-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{domain.name}</h4>
                <Badge variant="secondary">{domain.classIds.length} classes</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{domain.description}</p>
            </article>
          ))}
        </div>
      )}

      <Tabs defaultValue="loadout">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="loadout">Loadout</TabsTrigger>
          <TabsTrigger value="vault">Vault</TabsTrigger>
          <TabsTrigger value="library">Card Library</TabsTrigger>
        </TabsList>

        <TabsContent value="loadout" className="space-y-3">
          {controller.loadoutCards.length > 0 ? (
            controller.loadoutCards.map(renderOwnedDomainCard)
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No active domain cards yet. Add cards from the library tab.
            </p>
          )}
        </TabsContent>

        <TabsContent value="vault" className="space-y-3">
          {controller.vaultCards.length > 0 ? (
            controller.vaultCards.map(renderOwnedDomainCard)
          ) : (
            <p className="text-sm italic text-muted-foreground">No cards in the vault yet.</p>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {controller.selectedClass
                  ? `Showing ${controller.selectedClass.name}'s domain cards through level ${controller.data.level}.`
                  : `Showing all SRD domain cards through level ${controller.data.level}.`}
              </p>
              <div className="flex flex-wrap gap-2">
                {(controller.selectedDomains.length > 0
                  ? controller.selectedDomains
                  : controller.domainOptions
                ).map((domain) => (
                  <Badge key={domain.id} variant="outline">
                    {domain.name}
                  </Badge>
                ))}
              </div>
            </div>
            <input
              type="search"
              value={controller.domainCardSearch}
              onChange={(event) => controller.setDomainCardSearch(event.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none md:w-72"
              placeholder="Search domain cards"
              aria-label="Search Daggerheart domain cards"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {controller.filteredDomainCards.map((card) => {
              const alreadyOwned = controller.ownedDomainCardIds.has(card.id);
              return (
                <article key={card.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold">{card.name}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">
                          {card.domain}
                        </Badge>
                        <Badge variant="secondary">Level {card.level}</Badge>
                        <Badge variant="secondary">{DOMAIN_CARD_TYPE_LABELS[card.type]}</Badge>
                        <Badge variant="warning">Recall {card.recallCost}</Badge>
                      </div>
                    </div>
                    {alreadyOwned && <Badge variant="info">Owned</Badge>}
                  </div>

                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <DaggerheartDomainCardAutomation card={card} />

                  {canUpdate && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => controller.addDomainCard(card, 'loadout')}
                        disabled={alreadyOwned || controller.loadoutCount >= LOADOUT_LIMIT}
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Add to Loadout
                      </button>
                      <button
                        type="button"
                        onClick={() => controller.addDomainCard(card, 'vault')}
                        disabled={alreadyOwned}
                        className="rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                      >
                        Add to Vault
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {controller.filteredDomainCards.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              No SRD domain cards match the current filters.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
