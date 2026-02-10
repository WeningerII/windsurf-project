import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CheckCircle, Loader, BookOpen, Shield, Users, Sword } from 'lucide-react';
import { GameSystemId } from '../types/game-systems';
import { loadSpellsForSystem, loadClassesForSystem, loadSpeciesForSystem, loadMonstersForSystem, loadEquipmentForSystem, loadFeatsForSystem } from '../utils/dataLoader';

interface SystemStats {
  spells: number;
  classes: number;
  species: number;
  monsters: number;
  equipment: number;
  feats: number;
  status: 'loading' | 'ready' | 'error';
}

export const SystemStatusDashboard: React.FC = () => {
  const [stats, setStats] = useState<Record<GameSystemId, SystemStats>>({
    'dnd-5e-2024': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
    'dnd-5e-2014': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
    'pf2e': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
    'dnd-3.5e': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
    'pf1e': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
    'mam3e': { spells: 0, classes: 0, species: 0, monsters: 0, equipment: 0, feats: 0, status: 'loading' },
  });

  useEffect(() => {
    let canceled = false;
    const systems: GameSystemId[] = ['dnd-5e-2024', 'dnd-5e-2014', 'pf2e', 'dnd-3.5e', 'pf1e', 'mam3e'];
    
    const loadAllSystems = async () => {
      await Promise.all(
        systems.map(async (systemId) => {
          try {
            const [spells, classes, species, monsters, equipment, feats] = await Promise.all([
              loadSpellsForSystem(systemId),
              loadClassesForSystem(systemId),
              loadSpeciesForSystem(systemId),
              loadMonstersForSystem(systemId),
              loadEquipmentForSystem(systemId),
              loadFeatsForSystem(systemId),
            ]);

            if (!canceled) {
              setStats(prev => ({
                ...prev,
                [systemId]: {
                  spells: spells.length,
                  classes: classes.length,
                  species: species.length,
                  monsters: monsters.length,
                  equipment: equipment.length,
                  feats: feats.length,
                  status: 'ready',
                },
              }));
            }
          } catch (error) {
            if (!canceled) {
              setStats(prev => ({
                ...prev,
                [systemId]: { ...prev[systemId], status: 'error' },
              }));
            }
          }
        })
      );
    };

    loadAllSystems();
    return () => {
      canceled = true;
    };
  }, []);

  const systemNames: Record<GameSystemId, string> = {
    'dnd-5e-2024': 'D&D 5e (2024)',
    'dnd-5e-2014': 'D&D 5e (2014)',
    'pf2e': 'Pathfinder 2e',
    'dnd-3.5e': 'D&D 3.5e',
    'pf1e': 'Pathfinder 1e',
    'mam3e': 'M&M 3e',
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Shield className="w-6 h-6" />
          System Status - All 6 RPG Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(stats).map(([systemId, data]) => (
            <div
              key={systemId}
              className="p-4 border border-input rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {systemNames[systemId as GameSystemId]}
                  </h3>
                  {data.status === 'ready' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {data.status === 'loading' && (
                    <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.status === 'ready' ? 'Connected' : 'Loading...'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold">{data.spells}</div>
                    <div className="text-xs text-muted-foreground">Spells</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-semibold">{data.classes}</div>
                    <div className="text-xs text-muted-foreground">Classes</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="font-semibold">{data.species}</div>
                    <div className="text-xs text-muted-foreground">Species</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-red-500" />
                  <div>
                    <div className="font-semibold">{data.monsters}</div>
                    <div className="text-xs text-muted-foreground">Monsters</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Sword className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-semibold">{data.equipment}</div>
                    <div className="text-xs text-muted-foreground">Equipment</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold">{data.feats}</div>
                    <div className="text-xs text-muted-foreground">Feats</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2">Total Content Across All Systems</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.spells, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Spells</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.classes, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Classes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.species, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Species</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.monsters, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Monsters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.equipment, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Equipment</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(stats).reduce((sum, s) => sum + s.feats, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Feats</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
