import { useState, useEffect } from 'react';
import { GameSystemSelector } from './components/GameSystemSelector';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { GameSystemId } from './types/game-systems';
import { systemRegistry } from './registry';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/Card';
import { Select } from './components/ui/Select';
import { BookOpen, Plus, Trash2, ArrowLeft, Download, Upload } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateUUID, initBrowserCompat } from './utils/browserCompat';
import { SystemSheetRenderer } from './components/SystemSheetRenderer';
import { CharacterDocument, SystemDataModel } from './types/core/document';
import { useDocuments } from './hooks/useDocuments';
import { exportDocuments, importDocuments } from './utils/documentStorage';

function AppContent() {
  const { documents, addDocument, addDocuments, updateDocument, deleteDocument, clearAllDocuments } = useDocuments();
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<GameSystemId | null>(null);

  // Initialize browser compatibility checks on mount
  useEffect(() => {
    initBrowserCompat();
  }, []);

  const handleCreateCharacter = () => {
    if (!selectedSystem) return;
    const sysDef = systemRegistry.get(selectedSystem);
    if (!sysDef) return;

    const doc: CharacterDocument<SystemDataModel> = {
      id: generateUUID(),
      name: 'New Character',
      systemId: selectedSystem,
      system: sysDef.createDefaultData(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addDocument(doc);
    setCurrentDocId(doc.id);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    if (currentDocId === id) setCurrentDocId(null);
  };

  const handleExportDocument = (doc: CharacterDocument<SystemDataModel>) => {
    try {
      const dataStr = exportDocuments([doc]);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const filename = `${doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', filename);
      link.click();
    } catch {
      alert('Failed to export character.');
    }
  };

  const handleImportDocument = () => {
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
          const imported = importDocuments(jsonString);
          if (imported.length > 0) {
            const normalized = imported.map(d => ({ ...d, id: generateUUID(), createdAt: new Date(), updatedAt: new Date() }));
            addDocuments(normalized);
            setCurrentDocId(normalized[0].id);
          }
        } catch {
          alert('Failed to import character. Please ensure the file is a valid export.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const currentDoc = documents.find(d => d.id === currentDocId);

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
            {currentDoc && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentDocId(null)}
                  title="Back to character list"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Select
                  value={currentDocId || ''}
                  onChange={(e) => setCurrentDocId(e.target.value)}
                  className="w-64"
                >
                  <option value="">Select character...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({systemRegistry.get(doc.systemId)?.label})
                    </option>
                  ))}
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExportDocument(currentDoc)}
                  title="Export character"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleImportDocument}
                  title="Import character"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => currentDocId && handleDeleteDocument(currentDocId)}
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
        {currentDoc ? (
          <div className="max-w-7xl mx-auto">
            <SystemSheetRenderer
              document={currentDoc}
              onUpdate={updateDocument}
            />
          </div>
        ) : (
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
                    <Button variant="outline" onClick={handleImportDocument}>
                      <Upload className="w-5 h-5 mr-2" />
                      Import Character
                    </Button>
                    <Button onClick={handleCreateCharacter} size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Character
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <SystemStatusDashboard />

            {documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Characters</CardTitle>
                  <CardDescription>
                    Select a character to view and edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => {
                      const sys = systemRegistry.get(doc.systemId);
                      const level = 'level' in doc.system ? (doc.system as { level: number }).level : undefined;
                      const powerLevel = 'powerLevel' in doc.system ? (doc.system as { powerLevel: number }).powerLevel : undefined;
                      return (
                        <Card
                          key={doc.id}
                          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                          onClick={() => setCurrentDocId(doc.id)}
                        >
                          <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-1">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {level ? `Level ${level}` : ''}
                              {powerLevel ? `PL ${powerLevel}` : ''}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {sys?.label} &bull; {sys?.version}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {documents.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Delete ALL characters? This cannot be undone.')) {
                      clearAllDocuments();
                      setCurrentDocId(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Characters
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for tabletop RPG enthusiasts &bull; Supports D&amp;D, Pathfinder, M&amp;M, and more</p>
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
