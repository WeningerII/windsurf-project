// purpose: Monster browser tab body — lazy-loads the loader-backed 5e SRD monster browser.
import { Suspense, type ComponentType } from 'react';
import { TabsContent } from '../../../../components/ui/Tabs';
import type { Monster } from '../../../../types/creatures/monsters';
import { lazyWithPreload } from '../../../../utils/lazyWithPreload';

type MonsterBrowserProps = {
  monsters: Monster[];
  onSelectMonster?: (monster: Monster) => void;
};

const MonsterBrowser = lazyWithPreload<MonsterBrowserProps>(async () => {
  const module = await import('../../../../components/MonsterBrowser');
  return {
    default: module.MonsterBrowser as ComponentType<MonsterBrowserProps>,
  };
});

interface Props {
  monstersLoaded: boolean;
  monsters: Monster[];
}

type Dnd5eMonsterBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Dnd5eMonsterBrowserTab = (({ monstersLoaded, monsters }: Props) => (
  <TabsContent value="monsters" className="space-y-4">
    {!monstersLoaded ? (
      <div className="py-8 text-center text-muted-foreground">
        Open the Monsters tab to load monster data.
      </div>
    ) : monsters.length === 0 ? (
      <div className="py-8 text-center text-muted-foreground">
        No monster dataset is currently available for this system.
      </div>
    ) : (
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading monster browser...
          </div>
        }
      >
        <MonsterBrowser monsters={monsters} />
      </Suspense>
    )}
  </TabsContent>
)) as Dnd5eMonsterBrowserTabComponent;

Dnd5eMonsterBrowserTab.preload = () => MonsterBrowser.preload();
