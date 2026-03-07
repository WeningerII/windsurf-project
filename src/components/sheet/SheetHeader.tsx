import React from 'react';

interface Props {
  name: string;
  onNameChange?: (name: string) => void;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const SheetHeader: React.FC<Props> = ({ name, onNameChange, children, rightContent }) => {
  return (
    <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
      <div className="space-y-1 flex-1">
        <input
          value={name}
          onChange={(e) => onNameChange?.(e.target.value)}
          className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
          title="Character name"
          placeholder="Character name"
          disabled={!onNameChange}
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {children}
        </div>
      </div>
      {rightContent && <div className="text-right ml-6">{rightContent}</div>}
    </div>
  );
};
