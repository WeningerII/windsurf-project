import React, { useState, useRef } from 'react';
import { Character } from '../types/game-systems';
import { exportCharacters, importCharacters } from '../utils/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Download, Upload, Trash2, AlertCircle } from 'lucide-react';

interface DataManagementProps {
  characters: Character[];
  onImport: (characters: Character[]) => void;
  onClearAll: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  characters,
  onImport,
  onClearAll,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonData = exportCharacters(characters);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rpg-characters-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess('Characters exported successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export characters');
      setSuccess(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedCharacters = importCharacters(text);
      onImport(importedCharacters);
      setSuccess(`Successfully imported ${importedCharacters.length} character(s)!`);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import characters');
      setSuccess(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all characters? This cannot be undone.')) {
      onClearAll();
      setSuccess('All characters deleted successfully.');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export, import, or manage your character data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-500/10 text-green-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button onClick={handleExport} disabled={characters.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export Characters
          </Button>
          <Button onClick={handleImportClick} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Characters
          </Button>
          <Button
            onClick={handleClearAll}
            variant="destructive"
            disabled={characters.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import character file"
        />

        <div className="text-xs text-muted-foreground">
          <p>• Export: Download all your characters as a JSON file</p>
          <p>• Import: Load characters from a previously exported file</p>
          <p>• Clear: Delete all character data from browser storage</p>
        </div>
      </CardContent>
    </Card>
  );
};
