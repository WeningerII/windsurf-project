// purpose: d20-legacy (pf1e / 3.5e) monster browser tab body — lazy-loads the monster browser.
import React, { Suspense } from 'react';
import type { Monster } from '../../../types/creatures/monsters';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';

const MonsterBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/MonsterBrowser');
  return { default: module.MonsterBrowser };
});

interface Props {
  monstersLoaded: boolean;
  monsters: Monster[];
}

type D20MonsterBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const D20MonsterBrowserTab = (({ monstersLoaded, monsters }) =>
  !monstersLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load monsters...</div>
  ) : monsters.length === 0 ? (
    <div className="text-center py-8 text-muted-foreground">
      No monster dataset is currently available for this system.
    </div>
  ) : (
    <Suspense
      fallback={
        <div className="text-center py-8 text-muted-foreground text-sm">
          Loading Monster Browser...
        </div>
      }
    >
      <MonsterBrowser monsters={monsters} />
    </Suspense>
  )) as D20MonsterBrowserTabComponent;

D20MonsterBrowserTab.preload = () => MonsterBrowser.preload();
