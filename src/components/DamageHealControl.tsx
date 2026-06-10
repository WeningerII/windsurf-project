import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface DamageHealControlProps {
  onApply: (amount: number, type: 'damage' | 'heal') => void;
}

export const DamageHealControl: React.FC<DamageHealControlProps> = ({ onApply }) => {
  const [amount, setAmount] = useState('');

  const handleApply = (type: 'damage' | 'heal') => {
    const num = parseInt(amount, 10);
    if (!num || num <= 0) return;
    onApply(num, type);
    setAmount('');
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        type="button"
        onClick={() => handleApply('damage')}
        className="w-6 h-6 rounded border border-destructive/40 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
        title="Apply damage"
      >
        <Minus className="w-3 h-3" />
      </button>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-12 text-center text-xs bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
        placeholder="±"
        aria-label="Damage or heal amount"
        min={1}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          if (e.shiftKey) {
            handleApply('heal');
            return;
          }
          handleApply('damage');
        }}
      />
      <button
        type="button"
        onClick={() => handleApply('heal')}
        className="w-6 h-6 rounded border border-green-500/40 flex items-center justify-center text-green-600 hover:bg-green-500/10 transition-colors"
        title="Apply healing"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
