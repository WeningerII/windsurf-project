import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  /**
   * Per-instance id prefix so a trigger and its panel can point at each other
   * (`aria-controls` / `aria-labelledby`) without colliding when several tab
   * sets are mounted at once — the sheet tab strip and the Dock are on screen
   * together, and every system sheet mounts its own strip.
   */
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

const triggerDomId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelDomId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

/**
 * Horizontal-tablist arrow keys (WAI-ARIA Authoring Practices, tabs pattern).
 * Left/Right/Home/End move FOCUS only — activation stays manual (Enter/Space,
 * i.e. the native button click). Manual activation is deliberate: several tab
 * panels here mount lazily-fetched SRD browsers, so auto-activating on every
 * arrow keypress would fetch chunks the user is only passing over. Up/Down are
 * intentionally NOT handled — these strips are horizontal, and swallowing them
 * would break page scrolling.
 */
const TABLIST_NAV_KEYS = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const activeTab = value ?? internalValue;
    const baseId = React.useId();

    const setActiveTab = React.useCallback(
      (v: string) => {
        if (value === undefined) setInternalValue(v);
        onValueChange?.(v);
      },
      [value, onValueChange]
    );

    const ctx = React.useMemo(
      () => ({ activeTab, setActiveTab, baseId }),
      [activeTab, setActiveTab, baseId]
    );

    return (
      <TabsContext.Provider value={ctx}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !TABLIST_NAV_KEYS.includes(event.key)) return;

        // Read the tabs from the DOM rather than a registry: triggers are
        // owner-rendered (each sheet builds its own strip) and may be wrapped,
        // so subscription bookkeeping would be the fragile half of this.
        const tabs = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')
        ).filter(
          (tab) => !tab.hasAttribute('disabled') && tab.getAttribute('aria-disabled') !== 'true'
        );
        if (tabs.length === 0) return;
        const current = tabs.indexOf(document.activeElement as HTMLElement);
        if (current === -1) return;

        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : event.key === 'ArrowRight'
                ? (current + 1) % tabs.length
                : (current - 1 + tabs.length) % tabs.length;

        event.preventDefault();
        tabs[next].focus();
      },
      [onKeyDown]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          className
        )}
        role="tablist"
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId } = useTabs();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        // Default before {...props} so switching tabs inside a <form> does not
        // submit it, while callers can still override the type via props.
        type="button"
        role="tab"
        id={triggerDomId(baseId, value)}
        aria-selected={isActive}
        // Only the ACTIVE trigger names a panel: inactive TabsContent unmounts,
        // and aria-controls pointing at an absent id is itself an a11y defect.
        aria-controls={isActive ? panelDomId(baseId, value) : undefined}
        // Roving tabindex: the strip is one tab stop, arrows move within it.
        // Without this an eight-tab sheet costs eight Tab presses to step past.
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={(event) => {
          setActiveTab(value);
          onClick?.(event);
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:bg-background/50 hover:text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab, baseId } = useTabs();
    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelDomId(baseId, value)}
        // A tabpanel with no accessible name is announced as an unnamed region;
        // borrow its trigger's label, which is the whole point of the pairing.
        aria-labelledby={triggerDomId(baseId, value)}
        // Focusable so the roving strip has somewhere to hand focus off to (and
        // so the focus-visible ring below can ever actually appear).
        tabIndex={0}
        data-state="active"
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-0 duration-200',
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
