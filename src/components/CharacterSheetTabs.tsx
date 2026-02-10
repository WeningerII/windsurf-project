import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Character, GameSystem } from '../types/game-systems';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Shield, Sword, Wand, Users, BookOpen, Check, X } from 'lucide-react';
import { SpellBrowser } from './SpellBrowser';
import { MonsterBrowser } from './MonsterBrowser';
import { FeatBrowser } from './FeatBrowser';
import { EquipmentBrowser } from './EquipmentBrowser';
import { loadSpellsForSystem, loadMonstersForSystem, loadFeatsForSystem, loadEquipmentForSystem } from '../utils/dataLoader';
import { Spell } from '../types/magic/spells';
import { Monster } from '../types/creatures/monsters';
import { FeatDefinition } from '../types/character-options/feats';
import { Item } from '../types/equipment/items';
import { MonsterStatBlock } from './MonsterStatBlock';
import { InventoryManager } from './InventoryManager';
import { CharacterSheet } from './CharacterSheet';
import { SpellSlots } from '../types/core/character';

interface CharacterSheetTabsProps {
  character: Character;
  gameSystem: GameSystem;
  onUpdate: (character: Character) => void;
}

export const CharacterSheetTabs: React.FC<CharacterSheetTabsProps> = ({
  character,
  gameSystem,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('sheet');
  const [spells, setSpells] = useState<Spell[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [feats, setFeats] = useState<FeatDefinition[]>([]);
  const [equipment, setEquipment] = useState<Item[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['sheet', 'inventory']));
  const [loading, setLoading] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const knownSpellIds = useMemo(() => new Set(character.spellcasting?.spellsKnown || []), [character.spellcasting?.spellsKnown]);
  const characterFeatIds = useMemo(() => new Set(character.feats.map(f => f.id)), [character.feats]);

  const handleAddSpell = useCallback((spell: { id: string; name: string }) => {
    if (knownSpellIds.has(spell.id)) {
      showNotification(`${spell.name} is already known`, 'info');
      return;
    }
    const emptySlots: SpellSlots = {
      1: { max: 0, used: 0 }, 2: { max: 0, used: 0 }, 3: { max: 0, used: 0 },
      4: { max: 0, used: 0 }, 5: { max: 0, used: 0 }, 6: { max: 0, used: 0 },
      7: { max: 0, used: 0 }, 8: { max: 0, used: 0 }, 9: { max: 0, used: 0 },
    };
    const currentSpellcasting = character.spellcasting || {
      classes: [],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: emptySlots,
    };
    onUpdate({
      ...character,
      spellcasting: {
        ...currentSpellcasting,
        spellsKnown: [...currentSpellcasting.spellsKnown, spell.id],
      },
    });
    showNotification(`Added ${spell.name} to known spells`);
  }, [character, onUpdate, knownSpellIds, showNotification]);

  const handleRemoveSpell = useCallback((spellId: string) => {
    if (!character.spellcasting) return;
    onUpdate({
      ...character,
      spellcasting: {
        ...character.spellcasting,
        spellsKnown: character.spellcasting.spellsKnown.filter(id => id !== spellId),
      },
    });
  }, [character, onUpdate]);

  const handleAddFeat = useCallback((feat: { id: string; name: string; description: string; source: string }) => {
    if (characterFeatIds.has(feat.id)) {
      showNotification(`${feat.name} is already selected`, 'info');
      return;
    }
    onUpdate({
      ...character,
      feats: [...character.feats, { id: feat.id, name: feat.name, description: feat.description, source: feat.source }],
    });
    showNotification(`Added ${feat.name} to feats`);
  }, [character, onUpdate, characterFeatIds, showNotification]);

  const handleRemoveFeat = useCallback((featId: string) => {
    onUpdate({
      ...character,
      feats: character.feats.filter(f => f.id !== featId),
    });
  }, [character, onUpdate]);

  const handleAddEquipment = useCallback((item: { id: string; name: string }) => {
    onUpdate({
      ...character,
      inventory: [
        ...character.inventory,
        { itemId: item.id, quantity: 1, customName: item.name },
      ],
    });
    showNotification(`Added ${item.name} to inventory`);
  }, [character, onUpdate, showNotification]);

  useEffect(() => {
    setSpells([]);
    setMonsters([]);
    setFeats([]);
    setEquipment([]);
    setLoadedTabs(new Set(['sheet', 'inventory']));
    setSelectedMonster(null);
    setLoading(false);
  }, [character.system]);

  useEffect(() => {
    const dataTabs = new Set(['spells', 'monsters', 'feats', 'equipment']);

    async function loadTabData(tab: string) {
      if (!dataTabs.has(tab) || loadedTabs.has(tab)) return;
      
      setLoading(true);
      try {
        switch (tab) {
          case 'spells':
            if (spells.length === 0) {
              const spellData = await loadSpellsForSystem(character.system);
              setSpells(spellData);
            }
            break;
          case 'monsters':
            if (monsters.length === 0) {
              const monsterData = await loadMonstersForSystem(character.system);
              setMonsters(monsterData);
            }
            break;
          case 'feats':
            if (feats.length === 0) {
              const featData = await loadFeatsForSystem(character.system);
              setFeats(featData);
            }
            break;
          case 'equipment':
            if (equipment.length === 0) {
              const equipData = await loadEquipmentForSystem(character.system);
              setEquipment(equipData);
            }
            break;
        }
        setLoadedTabs(prev => new Set([...prev, tab]));
      } catch (error) {
        // Silent error handling - tab will remain unloaded
      } finally {
        setLoading(false);
      }
    }
    
    loadTabData(activeTab);
  }, [activeTab, character.system, spells.length, monsters.length, feats.length, equipment.length, loadedTabs]);

  return (
    <div className="w-full relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white'
        }`}>
          <Check className="w-4 h-4" />
          {notification.message}
        </div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sheet">
            <BookOpen className="w-4 h-4 mr-2" />
            Sheet
          </TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="spells">
            <Wand className="w-4 h-4 mr-2" />
            Spells ({spells.length})
          </TabsTrigger>
          <TabsTrigger value="feats">
            <Shield className="w-4 h-4 mr-2" />
            Feats ({feats.length})
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Sword className="w-4 h-4 mr-2" />
            Equipment ({equipment.length})
          </TabsTrigger>
          <TabsTrigger value="monsters">
            <Users className="w-4 h-4 mr-2" />
            Monsters ({monsters.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sheet" className="space-y-4">
          <CharacterSheet
            character={character}
            gameSystem={gameSystem}
            onUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManager
            items={character.inventory.map((item) => ({
              id: item.itemId,
              name: item.customName || item.itemId,
              quantity: item.quantity,
              weight: 0,
              value: '0 gp',
              description: item.notes,
            }))}
            onAddItem={(item) => {
              const updatedCharacter = {
                ...character,
                inventory: [
                  ...character.inventory,
                  {
                    itemId: item.id,
                    quantity: item.quantity,
                    customName: item.name,
                    notes: item.description,
                  },
                ],
              };
              onUpdate(updatedCharacter);
            }}
            onRemoveItem={(itemId) => {
              const updatedCharacter = {
                ...character,
                inventory: character.inventory.filter((i) => i.itemId !== itemId),
              };
              onUpdate(updatedCharacter);
            }}
          />
        </TabsContent>

        <TabsContent value="spells" className="space-y-4">
          {/* Known Spells Summary */}
          {(character.spellcasting?.spellsKnown?.length ?? 0) > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Known Spells ({character.spellcasting!.spellsKnown.length})</h3>
              <div className="flex flex-wrap gap-2">
                {character.spellcasting!.spellsKnown.map(spellId => {
                  const spell = spells.find(s => s.id === spellId);
                  return (
                    <span key={spellId} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded">
                      {spell?.name || spellId}
                      <button
                        onClick={() => handleRemoveSpell(spellId)}
                        className="hover:text-destructive transition-colors"
                        title="Remove spell"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div className="bg-card border border-input rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Spell Browser - {gameSystem.name}</h2>
            {loading ? (
              <div className="text-center py-8">Loading spells...</div>
            ) : spells.length > 0 ? (
              <SpellBrowser spells={spells.map(spell => ({
                id: spell.id,
                name: spell.name,
                level: spell.level,
                school: spell.school,
                castingTime: typeof spell.castingTime === 'object' ? `${spell.castingTime.amount ?? 1} ${spell.castingTime.type}` : String(spell.castingTime),
                range: typeof spell.range === 'object' && 'feet' in spell.range ? `${spell.range.feet} feet` : String(spell.range.type || spell.range),
                duration: typeof spell.duration === 'object' && 'maxDuration' in spell.duration ? spell.duration.maxDuration || 'Instantaneous' : String(spell.duration.type || spell.duration),
                description: spell.description,
                classes: spell.classes || [],
              }))} onSelectSpell={(spell) => handleAddSpell(spell)} />
            ) : (
              <p className="text-muted-foreground">No spells available for this system yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="feats" className="space-y-4">
          {/* Selected Feats Summary */}
          {character.feats.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Selected Feats ({character.feats.length})</h3>
              <div className="flex flex-wrap gap-2">
                {character.feats.map(feat => (
                  <span key={feat.id} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded">
                    {feat.name}
                    <button
                      onClick={() => handleRemoveFeat(feat.id)}
                      className="hover:text-destructive transition-colors"
                      title="Remove feat"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-card border border-input rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Feat Browser - {gameSystem.name}</h2>
            {loading ? (
              <div className="text-center py-8">Loading feats...</div>
            ) : feats.length > 0 ? (
              <FeatBrowser feats={feats.map(feat => ({
                id: feat.id || feat.name,
                name: feat.name,
                system: feat.system,
                source: feat.source,
                description: feat.description,
                benefits: feat.benefits,
                prerequisites: feat.prerequisites?.map(p => ({
                  type: p.type || 'unknown',
                  description: p.description || ''
                }))
              }))} onSelectFeat={(feat) => handleAddFeat({ id: feat.id, name: feat.name, description: feat.description, source: feat.source })} />
            ) : (
              <p className="text-muted-foreground">No feats available for this system yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="bg-card border border-input rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Equipment Browser - {gameSystem.name}</h2>
            {loading ? (
              <div className="text-center py-8">Loading equipment...</div>
            ) : equipment.length > 0 ? (
              <EquipmentBrowser equipment={equipment.map(item => ({
                id: item.id,
                name: item.name,
                type: item.type,
                rarity: item.rarity || 'common',
                cost: typeof item.cost === 'object' ? `${item.cost.amount} ${item.cost.currency}` : String(item.cost),
                weight: item.weight ?? 0,
                description: item.description,
                properties: []
              }))} onSelectEquipment={(item) => handleAddEquipment(item)} />
            ) : (
              <p className="text-muted-foreground">No equipment available for this system yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monsters" className="space-y-4">
          {!selectedMonster ? (
            <div className="bg-card border border-input rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Monster Compendium - {gameSystem.name}</h2>
              {loading ? (
                <div className="text-center py-8">Loading monsters...</div>
              ) : monsters.length > 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Browse and view monsters from {gameSystem.name}. Currently showing {monsters.length} monsters.
                  </p>
                  <MonsterBrowser
                    monsters={monsters}
                    onSelectMonster={setSelectedMonster}
                  />
                </>
              ) : (
                <p className="text-muted-foreground">No monsters available for this system yet.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMonster(null)}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-all"
              >
                ← Back to Monster List
              </button>
              <MonsterStatBlock monster={selectedMonster} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
