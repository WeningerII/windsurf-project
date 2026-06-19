import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  StickyNote,
  Trash2,
  UserPlus,
  UserMinus,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { QuestList } from './campaign/QuestList';
import { SessionLog } from './campaign/SessionLog';
import type { Campaign } from '../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import { systemRegistry } from '../registry';
import { generateUUID } from '../utils/browserCompat';
import { exportCampaigns, importCampaignsWithReport } from '../utils/campaignStorage';
import { downloadTextFile, pickTextFile } from '../utils/fileTransfer';

interface Props {
  campaigns: Campaign[];
  documents: CharacterDocument<SystemDataModel>[];
  onAddCampaign: (campaign: Campaign) => void;
  onUpdateCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onAddCharacter: (campaignId: string, characterId: string) => void;
  onRemoveCharacter: (campaignId: string, characterId: string) => void;
  onOpenCharacter: (characterId: string) => void;
  /** Merge imported campaigns into the collection (upsert by id). */
  onImportCampaigns?: (campaigns: Campaign[]) => void;
}

export const CampaignManager: React.FC<Props> = ({
  campaigns,
  documents,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onAddCharacter,
  onRemoveCharacter,
  onOpenCharacter,
  onImportCampaigns,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSystemId, setNewSystemId] = useState('all');
  const [addingCharTo, setAddingCharTo] = useState<string | null>(null);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);

  const handleExport = () => {
    downloadTextFile(
      exportCampaigns(campaigns),
      `campaigns-${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const handleImport = () => {
    if (!onImportCampaigns) return;
    pickTextFile((text) => {
      try {
        const { campaigns: imported, droppedCount } = importCampaignsWithReport(text);
        const skipped =
          droppedCount > 0
            ? ` — ${droppedCount} invalid ${droppedCount === 1 ? 'entry' : 'entries'} skipped`
            : '';
        // Valid JSON can still hold no usable campaigns; say so rather than
        // silently no-op'ing (which reads as a successful import).
        if (imported.length === 0) {
          setTransferMessage(`No valid campaigns were found in that file${skipped}.`);
          return;
        }
        onImportCampaigns(imported);
        setTransferMessage(
          droppedCount > 0
            ? `Imported ${imported.length} of ${imported.length + droppedCount} campaigns${skipped}.`
            : `Imported ${imported.length} campaign${imported.length !== 1 ? 's' : ''}.`
        );
      } catch (err) {
        setTransferMessage(err instanceof Error ? err.message : 'Failed to import campaigns.');
      }
    });
  };

  const documentMap = useMemo(() => new Map(documents.map((d) => [d.id, d])), [documents]);
  const systemOptions = useMemo(() => systemRegistry.getAll(), []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const campaign: Campaign = {
      id: generateUUID(),
      name: newName.trim(),
      systemId: newSystemId === 'all' ? undefined : newSystemId,
      characterIds: [],
      notes: '',
      quests: [],
      sessionLog: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAddCampaign(campaign);
    setNewName('');
    setNewSystemId('all');
    setCreatingNew(false);
    setExpandedId(campaign.id);
  };

  const availableCharacters = (campaign: Campaign) =>
    documents.filter((d) => {
      if (campaign.characterIds.includes(d.id)) return false;
      return !campaign.systemId || d.systemId === campaign.systemId;
    });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6" /> Campaigns
          </h3>
          <p className="text-sm text-muted-foreground">
            {campaigns.length === 0
              ? 'Organize characters into parties'
              : `${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {!creatingNew && (
          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                title="Export all campaigns to a JSON backup"
              >
                <Download className="w-4 h-4 mr-1.5" /> Export
              </Button>
            )}
            {onImportCampaigns && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImport}
                title="Import campaigns from a JSON backup"
              >
                <Upload className="w-4 h-4 mr-1.5" /> Import
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setCreatingNew(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> New Campaign
            </Button>
          </div>
        )}
      </div>

      {transferMessage && (
        <p className="text-sm text-muted-foreground" role="status">
          {transferMessage}
        </p>
      )}

      {/* New campaign form */}
      {creatingNew && (
        <div className="grid gap-2 p-3 rounded-lg border bg-card sm:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)_auto_auto] sm:items-center">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') setCreatingNew(false);
            }}
            placeholder="Campaign name..."
            className="h-10 min-w-0 px-3 py-2 text-sm border border-input rounded bg-transparent focus:outline-none focus:border-primary"
          />
          <Select
            aria-label="Campaign system"
            value={newSystemId}
            onChange={(e) => setNewSystemId(e.target.value)}
          >
            <option value="all">All systems</option>
            {systemOptions.map((system) => (
              <option key={system.id} value={system.id}>
                {system.label}
              </option>
            ))}
          </Select>
          <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
            Create
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCreatingNew(false);
              setNewName('');
              setNewSystemId('all');
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Campaign list */}
      <div className="space-y-2">
        {campaigns.map((campaign) => {
          const isExpanded = expandedId === campaign.id;
          const campaignSystem = campaign.systemId
            ? systemRegistry.get(campaign.systemId)
            : undefined;
          const members = campaign.characterIds
            .map((id) => documentMap.get(id))
            .filter(Boolean) as CharacterDocument<SystemDataModel>[];
          const available = availableCharacters(campaign);
          const eligibleCharacterCount = documents.filter(
            (doc) => !campaign.systemId || doc.systemId === campaign.systemId
          ).length;
          const noAvailableCharactersMessage = campaign.systemId
            ? eligibleCharacterCount === 0
              ? `No ${campaignSystem?.label ?? 'matching system'} characters are available.`
              : `All ${campaignSystem?.label ?? 'matching system'} characters are already in this campaign.`
            : 'All characters are already in this campaign.';

          return (
            <div
              key={campaign.id}
              className="rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-sm"
            >
              {/* Campaign header */}
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold text-base">{campaign.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {members.length} member{members.length !== 1 ? 's' : ''}
                    </span>
                    {campaignSystem && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-[10px] px-1.5 py-0 align-middle"
                      >
                        {campaignSystem.label}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Member avatars */}
                  <div className="flex -space-x-2">
                    {members.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-primary text-[10px] font-bold"
                        title={m.name}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {members.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3 space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      System
                    </div>
                    <Select
                      aria-label={`System for ${campaign.name}`}
                      value={campaign.systemId ?? 'all'}
                      onChange={(e) =>
                        onUpdateCampaign({
                          ...campaign,
                          systemId: e.target.value === 'all' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="all">All systems</option>
                      {systemOptions.map((system) => (
                        <option key={system.id} value={system.id}>
                          {system.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Party members */}
                  {members.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Party Members
                      </div>
                      {members.map((member) => {
                        const sys = systemRegistry.get(member.systemId);
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group/member"
                          >
                            <button
                              className="flex items-center gap-2 min-w-0 text-left"
                              onClick={() => onOpenCharacter(member.id)}
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium text-sm truncate block">
                                  {member.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {sys?.label}
                                </span>
                              </div>
                            </button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover/member:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                              onClick={() => onRemoveCharacter(campaign.id, member.id)}
                              title={`Remove ${member.name} from campaign`}
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No members yet. Add characters below.
                    </p>
                  )}

                  {/* Add character */}
                  {addingCharTo === campaign.id ? (
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Add Character
                      </div>
                      {available.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          {noAvailableCharactersMessage}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                          {available.map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => {
                                onAddCharacter(campaign.id, doc.id);
                              }}
                              className="flex items-center gap-2 p-2 rounded border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left text-sm"
                            >
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                                {doc.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="truncate block text-xs font-medium">
                                  {doc.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {systemRegistry.get(doc.systemId)?.label}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px] px-1.5 py-0 shrink-0"
                              >
                                <UserPlus className="w-3 h-3" />
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingCharTo(null)}
                        className="mt-1"
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingCharTo(campaign.id)}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Character
                    </Button>
                  )}

                  {/* Quests */}
                  <QuestList campaign={campaign} onUpdate={onUpdateCampaign} />

                  {/* Session log */}
                  <SessionLog campaign={campaign} onUpdate={onUpdateCampaign} />

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <StickyNote className="w-3 h-3" /> Campaign Notes
                    </div>
                    <textarea
                      value={campaign.notes}
                      onChange={(e) => onUpdateCampaign({ ...campaign, notes: e.target.value })}
                      placeholder="House rules, NPC names, loot..."
                      className="w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                    />
                  </div>

                  {/* Delete campaign */}
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Campaign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {campaigns.length === 0 && !creatingNew && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              No campaigns yet. Create one to group your characters into a party.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
