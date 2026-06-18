import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { SceneOracleAnswer, SceneOracleOdds, SceneState } from '../../types/core/scene';
import { ORACLE_ANSWER_LABEL, ORACLE_ODDS, ORACLE_ODDS_LABEL } from '../../scene/oracle';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

interface OraclePanelProps {
  state: SceneState;
  onConsult: (params: { question?: string; odds: SceneOracleOdds }) => void;
}

const ANSWER_BADGE: Record<SceneOracleAnswer, string> = {
  'exceptional-yes': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold',
  yes: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  no: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'exceptional-no': 'bg-destructive/15 text-destructive font-semibold',
};

/**
 * GM-emulation oracle: ask a yes/no question, pick how likely a "yes" is, and
 * get a d100 answer (with exceptional bands for strong/twist results). This is
 * a transparent randomizer — the player interprets the fiction — not an AI GM.
 * Consultations go through the event-sourced scene path into a replayable log.
 */
export function OraclePanel({ state, onConsult }: OraclePanelProps) {
  const [question, setQuestion] = useState('');
  const [odds, setOdds] = useState<SceneOracleOdds>('even');

  const handleConsult = () => {
    const trimmed = question.trim();
    onConsult({ odds, ...(trimmed ? { question: trimmed } : {}) });
    setQuestion('');
  };

  const recent = [...state.oracleLog].reverse();

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4" /> Oracle
        </h5>
      </div>

      <div className="space-y-2 text-sm">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConsult();
          }}
          placeholder="Ask a yes/no question (optional)…"
          aria-label="Oracle question"
          className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:border-primary"
        />

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <Select
            aria-label="Oracle odds"
            value={odds}
            onChange={(e) => setOdds(e.target.value as SceneOracleOdds)}
          >
            {ORACLE_ODDS.map((value) => (
              <option key={value} value={value}>
                {ORACLE_ODDS_LABEL[value]}
              </option>
            ))}
          </Select>
          <Button size="sm" onClick={handleConsult}>
            <Sparkles className="mr-1.5 h-4 w-4" />
            Consult
          </Button>
        </div>

        {recent.length > 0 && (
          <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  {entry.question ? (
                    <span className="font-medium text-foreground">{entry.question}</span>
                  ) : (
                    <span className="italic">{ORACLE_ODDS_LABEL[entry.odds]}</span>
                  )}
                  {` — d100 ${entry.roll}/${entry.target}`}
                </span>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[10px] px-1.5 py-0 ${ANSWER_BADGE[entry.answer]}`}
                >
                  {ORACLE_ANSWER_LABEL[entry.answer]}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
