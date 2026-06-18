import { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Campaign } from '../../types/core/campaign';
import { generateUUID } from '../../utils/browserCompat';
import { addSessionEntry, createSessionEntry, removeSessionEntry } from '../../utils/campaignStory';

interface Props {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

/**
 * Chronological session recaps for a campaign. Entries are stored oldest-first
 * (so a default title can number them) and rendered newest-first. The recap
 * body is required; the title defaults to "Session N" when left blank.
 */
export function SessionLog({ campaign, onUpdate }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAdd = () => {
    const trimmedBody = body.trim();
    if (!trimmedBody) return;
    const finalTitle = title.trim() || `Session ${campaign.sessionLog.length + 1}`;
    onUpdate(
      addSessionEntry(
        campaign,
        createSessionEntry(generateUUID(), finalTitle, trimmedBody, new Date())
      )
    );
    setTitle('');
    setBody('');
  };

  // Newest first for reading; the underlying array stays chronological.
  const entries = [...campaign.sessionLog].reverse();

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> Session Log
      </div>

      {entries.length > 0 && (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border bg-background/50 p-2.5 group/entry">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-sm font-medium block truncate">{entry.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {entry.createdAt.toLocaleDateString(undefined, DATE_FORMAT)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdate(removeSessionEntry(campaign, entry.id))}
                  title="Delete entry"
                  aria-label={`Delete session entry ${entry.title}`}
                  className="shrink-0 opacity-0 group-hover/entry:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {entry.body && (
                <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
                  {entry.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-1.5 pt-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Session ${campaign.sessionLog.length + 1} title (optional)...`}
          aria-label="Session title"
          className="w-full h-8 px-2.5 text-sm border border-input rounded bg-transparent focus:outline-none focus:border-primary"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened this session?"
          aria-label="Session recap"
          className="w-full min-h-[60px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
        />
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={handleAdd} disabled={!body.trim()}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Log Session
          </Button>
        </div>
      </div>
    </div>
  );
}
