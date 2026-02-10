import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { generateUUID } from '../utils/browserCompat';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  value: string;
  description?: string;
}

interface InventoryManagerProps {
  items: InventoryItem[];
  onAddItem?: (item: InventoryItem) => void;
  onRemoveItem?: (itemId: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  items,
  onAddItem,
  onRemoveItem,
}) => {
  const parseInteger = (value: string, fallback: number) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const parseDecimal = (value: string, fallback: number) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    quantity: 1,
    weight: 0,
    value: '0 gp',
    description: '',
  });

  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  const handleAddItem = () => {
    if (formData.name && onAddItem) {
      const quantity = typeof formData.quantity === 'number' && Number.isFinite(formData.quantity)
        ? formData.quantity
        : 1;
      const weight = typeof formData.weight === 'number' && Number.isFinite(formData.weight)
        ? formData.weight
        : 0;
      onAddItem({
        id: generateUUID(),
        name: formData.name,
        quantity,
        weight,
        value: formData.value || '0 gp',
        description: formData.description,
      });
      setFormData({
        name: '',
        quantity: 1,
        weight: 0,
        value: '0 gp',
        description: '',
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} items • {totalWeight.toFixed(1)} lbs
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-card border border-input rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Item Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg"
                placeholder="e.g., Longsword"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity ?? 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInteger(e.target.value, 1),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weight ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: parseDecimal(e.target.value, 0),
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={formData.value || '0 gp'}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg"
                placeholder="e.g., 15 gp"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg"
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Add Item
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-input rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground mt-2">
                  <div>
                    <span className="font-medium">Qty:</span> {item.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {(item.weight * item.quantity).toFixed(1)} lbs
                  </div>
                  <div>
                    <span className="font-medium">Value:</span> {item.value}
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRemoveItem?.(item.id)}
                  className="p-2 hover:bg-muted rounded-lg transition-all text-destructive"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No items in inventory. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
