import { Coins } from 'lucide-react';
import { parseNum } from '../utils/math';

interface CurrencyEntry {
  key: string;
  label: string;
  color: string;
}

const DND_CURRENCIES: CurrencyEntry[] = [
  { key: 'copper', label: 'CP', color: 'text-orange-600' },
  { key: 'silver', label: 'SP', color: 'text-slate-400' },
  { key: 'electrum', label: 'EP', color: 'text-blue-400' },
  { key: 'gold', label: 'GP', color: 'text-amber-500' },
  { key: 'platinum', label: 'PP', color: 'text-slate-200' },
];

interface Props<T extends Record<string, number>> {
  currency: T;
  onChange?: (currency: T) => void;
  entries?: CurrencyEntry[];
}

export function CurrencyEditor<T extends Record<string, number>>({
  currency,
  onChange,
  entries,
}: Props<T>) {
  const fields = entries ?? DND_CURRENCIES.filter((e) => e.key in currency);

  return (
    <section className="bg-card p-4 rounded-lg border space-y-2">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Coins className="w-4 h-4" /> Currency
      </h3>
      <div className="flex items-center gap-3 flex-wrap">
        {fields.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-1">
            <input
              type="number"
              value={(currency as Record<string, number>)[key] ?? 0}
              onChange={(e) => onChange?.({ ...currency, [key]: parseNum(e.target.value, 0) } as T)}
              className="w-16 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums text-sm"
              min={0}
              disabled={!onChange}
              title={label}
            />
            <span className={`text-xs font-medium ${color}`}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
