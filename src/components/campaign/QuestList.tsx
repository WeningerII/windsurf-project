import { useState } from 'react';
import { Flag, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import type { Campaign, CampaignQuestStatus } from '../../types/core/campaign';
import { generateUUID } from '../../utils/browserCompat';
import {
  addObjective,
  addQuest,
  createObjective,
  createQuest,
  editQuest,
  questProgress,
  removeObjective,
  removeQuest,
  setQuestStatus,
  toggleObjective,
} from '../../utils/campaignStory';

interface Props {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

const STATUS_OPTIONS: { value: CampaignQuestStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const STATUS_BADGE: Record<CampaignQuestStatus, string> = {
  active: 'bg-primary/15 text-primary',
  completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failed: 'bg-destructive/15 text-destructive',
};

/**
 * Quest tracker for a campaign: a list of story arcs, each a checklist of
 * objectives with an active/completed/failed status. Every mutation runs a
 * pure transform from `campaignStory` and hands the result to `onUpdate`, which
 * the parent routes through the campaign persistence hook (it owns the
 * campaign's `updatedAt`).
 */
export function QuestList({ campaign, onUpdate }: Props) {
  const [newTitle, setNewTitle] = useState('');
  const [objectiveDrafts, setObjectiveDrafts] = useState<Record<string, string>>({});

  const handleAddQuest = () => {
    const title = newTitle.trim();
    if (!title) return;
    onUpdate(addQuest(campaign, createQuest(generateUUID(), title, '', new Date())));
    setNewTitle('');
  };

  const handleAddObjective = (questId: string) => {
    const text = (objectiveDrafts[questId] ?? '').trim();
    if (!text) return;
    onUpdate(addObjective(campaign, questId, createObjective(generateUUID(), text), new Date()));
    setObjectiveDrafts((prev) => ({ ...prev, [questId]: '' }));
  };

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <Flag className="w-3 h-3" /> Quests
      </div>

      {campaign.quests.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No quests yet. Track a story arc and its objectives below.
        </p>
      ) : (
        <ul className="space-y-2">
          {campaign.quests.map((quest) => {
            const progress = questProgress(quest);
            return (
              <li key={quest.id} className="rounded-lg border bg-background/50 p-2.5 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    aria-label={`Quest title`}
                    value={quest.title}
                    onChange={(e) =>
                      onUpdate(editQuest(campaign, quest.id, { title: e.target.value }, new Date()))
                    }
                    placeholder="Quest title..."
                    className="flex-1 min-w-0 bg-transparent text-sm font-semibold focus:outline-none focus:border-b focus:border-primary"
                  />
                  {progress.total > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 shrink-0 ${
                        progress.done === progress.total ? STATUS_BADGE.completed : ''
                      }`}
                    >
                      {progress.done}/{progress.total}
                    </Badge>
                  )}
                  <Select
                    aria-label={`Status for ${quest.title || 'quest'}`}
                    value={quest.status}
                    onChange={(e) =>
                      onUpdate(
                        setQuestStatus(
                          campaign,
                          quest.id,
                          e.target.value as CampaignQuestStatus,
                          new Date()
                        )
                      )
                    }
                    className={`h-7 w-auto text-xs ${STATUS_BADGE[quest.status]}`}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onUpdate(removeQuest(campaign, quest.id))}
                    title="Delete quest"
                    aria-label={`Delete quest ${quest.title || ''}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <input
                  aria-label="Quest summary"
                  value={quest.summary}
                  onChange={(e) =>
                    onUpdate(editQuest(campaign, quest.id, { summary: e.target.value }, new Date()))
                  }
                  placeholder="One-line goal (optional)..."
                  className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:border-b focus:border-primary/50"
                />

                {quest.objectives.length > 0 && (
                  <ul className="space-y-1">
                    {quest.objectives.map((objective) => (
                      <li key={objective.id} className="flex items-center gap-2 group/obj">
                        <input
                          type="checkbox"
                          checked={objective.done}
                          onChange={() =>
                            onUpdate(toggleObjective(campaign, quest.id, objective.id, new Date()))
                          }
                          aria-label={objective.text || 'objective'}
                          className="h-3.5 w-3.5 shrink-0 accent-primary"
                        />
                        <span
                          className={`flex-1 min-w-0 text-xs ${
                            objective.done ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {objective.text}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdate(removeObjective(campaign, quest.id, objective.id, new Date()))
                          }
                          title="Remove objective"
                          aria-label={`Remove objective ${objective.text || ''}`}
                          className="opacity-0 group-hover/obj:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-1.5">
                  <input
                    value={objectiveDrafts[quest.id] ?? ''}
                    onChange={(e) =>
                      setObjectiveDrafts((prev) => ({ ...prev, [quest.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddObjective(quest.id);
                    }}
                    placeholder="Add an objective..."
                    aria-label={`Add objective to ${quest.title || 'quest'}`}
                    className="flex-1 min-w-0 h-7 px-2 text-xs border border-input rounded bg-transparent focus:outline-none focus:border-primary"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleAddObjective(quest.id)}
                    disabled={!(objectiveDrafts[quest.id] ?? '').trim()}
                    title="Add objective"
                    aria-label="Add objective"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-1.5 pt-1">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddQuest();
          }}
          placeholder="New quest title..."
          aria-label="New quest title"
          className="flex-1 min-w-0 h-8 px-2.5 text-sm border border-input rounded bg-transparent focus:outline-none focus:border-primary"
        />
        <Button size="sm" variant="outline" onClick={handleAddQuest} disabled={!newTitle.trim()}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Quest
        </Button>
      </div>
    </div>
  );
}
