import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  iconClassName?: string;
  children?: React.ReactNode;
}

export const CombatStatCard: React.FC<Props> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  iconClassName = 'text-primary',
  children,
}) => {
  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-xl border shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-12 h-12 ${iconClassName}`} />
      </div>
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </span>
      {children ? (
        children
      ) : (
        <>
          <span className="text-3xl font-bold mb-1 tabular-nums">{value}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </>
      )}
    </div>
  );
};
