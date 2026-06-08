// purpose: pf2e monster browser tab body — lazy-loads the loader-backed monster browser.
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

type Pf2eMonsterBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Pf2eMonsterBrowserTab = (({ monstersLoaded, monsters }) =>
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
  )) as Pf2eMonsterBrowserTabComponent;

Pf2eMonsterBrowserTab.preload = () => MonsterBrowser.preload();
