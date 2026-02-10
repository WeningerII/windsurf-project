import { useState, useEffect } from 'react';
import { CharacterSheetTabs } from './components/CharacterSheetTabs';
import { CharacterCreation } from './components/CharacterCreation';
import { DataManagement } from './components/DataManagement';
import { GameSystemSelector } from './components/GameSystemSelector';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { Character, GameSystemId } from './types/game-systems';
import { getGameSystem } from './data/game-systems';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/Card';
import { Select } from './components/ui/Select';
import { BookOpen, Plus, Trash2, ArrowLeft, Download, Upload } from 'lucide-react';
import { useCharacters } from './hooks/useCharacters';
import { exportCharacters, importCharacters } from './utils/storage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateUUID, initBrowserCompat } from './utils/browserCompat';

function AppContent() {
  const { characters, addCharacter, addCharacters, updateCharacter: updateChar, deleteCharacter: deleteChar, clearAllCharacters } = useCharacters();
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<GameSystemId | null>(null);
  const [creationSystemId, setCreationSystemId] = useState<GameSystemId | null>(null);

  // Initialize browser compatibility checks on mount
  useEffect(() => {
    initBrowserCompat();
  }, []);

  const startCharacterCreation = () => {
    if (!selectedSystem) return;
    setCreationSystemId(selectedSystem);
  };

  const handleCreationCancel = () => {
    setCreationSystemId(null);
  };

  const handleCreationComplete = (character: Character) => {
    try {
      addCharacter(character);
      setCurrentCharacterId(character.id);
      setCreationSystemId(null);
    } catch (err) {
      alert('Failed to create character. Please try again.');
    }
  };

  const handleUpdateCharacter = (updatedCharacter: Character) => {
    try {
      updateChar(updatedCharacter);
    } catch (err) {
      alert('Failed to save character changes.');
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    try {
      deleteChar(characterId);
      if (currentCharacterId === characterId) {
        setCurrentCharacterId(null);
      }
    } catch (err) {
      alert('Failed to delete character.');
    }
  };

  const normalizeImportedCharacters = (imported: Character[]): Character[] => {
    const now = new Date();
    return imported.map((char) => ({
      ...char,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    }));
  };

  const handleImportCharacters = (imported: Character[]) => {
    if (imported.length === 0) return;
    try {
      const normalized = normalizeImportedCharacters(imported);
      addCharacters(normalized);
      setCurrentCharacterId(normalized[0].id);
    } catch (err) {
      alert('Failed to import characters. Please ensure the file is valid.');
    }
  };

  const handleExportCharacter = (character: Character) => {
    try {
      const dataStr = exportCharacters([character]);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      alert('Failed to export character.');
    }
  };

  const handleImportCharacter = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const importedChars = importCharacters(jsonString);
          handleImportCharacters(importedChars);
        } catch (error) {
          alert('Failed to import character. Please ensure the file is a valid character export.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const currentCharacter = characters.find((c) => c.id === currentCharacterId);
  const gameSystem = currentCharacter ? getGameSystem(currentCharacter.system) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RPG Character Sheet</h1>
                <p className="text-sm text-muted-foreground">
                  Multi-system tabletop character manager
                </p>
              </div>
            </div>
            {currentCharacter && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentCharacterId(null)}
                  title="Back to character list"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Select
                  value={currentCharacterId || ''}
                  onChange={(e) => setCurrentCharacterId(e.target.value)}
                  className="w-64"
                >
                  <option value="">Select character...</option>
                  {characters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({getGameSystem(char.system)?.name})
                    </option>
                  ))}
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExportCharacter(currentCharacter)}
                  title="Export character"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleImportCharacter}
                  title="Import character"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => currentCharacterId && handleDeleteCharacter(currentCharacterId)}
                  title="Delete character"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {creationSystemId ? (
          <CharacterCreation
            systemId={creationSystemId}
            onComplete={handleCreationComplete}
            onCancel={handleCreationCancel}
          />
        ) : !currentCharacter ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Choose a Game System</CardTitle>
                <CardDescription>
                  Select a tabletop RPG system to create your character
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameSystemSelector
                  selectedSystem={selectedSystem}
                  onSelect={setSelectedSystem}
                />
                {selectedSystem && (
                  <div className="mt-6 flex justify-between items-center">
                    <Button variant="outline" onClick={handleImportCharacter}>
                      <Upload className="w-5 h-5 mr-2" />
                      Import Character
                    </Button>
                    <Button onClick={startCharacterCreation} size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Character
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <SystemStatusDashboard />

            {characters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Characters</CardTitle>
                  <CardDescription>
                    Select a character to view and edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((char) => {
                      const sys = getGameSystem(char.system);
                      return (
                        <Card
                          key={char.id}
                          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                          onClick={() => setCurrentCharacterId(char.id)}
                        >
                          <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-1">{char.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Level {char.level} {char.speciesId || ''} {char.classLevels.length > 0 ? char.classLevels.map(cl => cl.classId).join('/') : ''}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {sys?.name} • {sys?.version}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <DataManagement
              characters={characters}
              onImport={handleImportCharacters}
              onClearAll={() => {
                clearAllCharacters();
                setCurrentCharacterId(null);
              }}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {gameSystem && (
              <CharacterSheetTabs
                character={currentCharacter}
                gameSystem={gameSystem}
                onUpdate={handleUpdateCharacter}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for tabletop RPG enthusiasts • Supports D&D, Pathfinder, M&M, and more</p>
        </div>
      </footer>
    </div>
  );
}

// Wrap entire app in ErrorBoundary for crash protection
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
