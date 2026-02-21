import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerAllSystems } from '../../systems';
import { GameSystemSelector } from '../../components/GameSystemSelector';
import type { GameSystemId } from '../../types/game-systems';

beforeAll(() => {
  registerAllSystems();
});

describe('GameSystemSelector', () => {
  it('should render all 6 game systems', () => {
    const mockOnSelect = vi.fn();
    
    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('D&D 5e (2024)')).toBeInTheDocument();
    expect(screen.getByText('D&D 5e (2014)')).toBeInTheDocument();
    expect(screen.getByText('D&D 3.5e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 1e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 2e')).toBeInTheDocument();
    expect(screen.getByText('M&M 3e')).toBeInTheDocument();
  });

  it('should call onSelect with correct system ID when clicked', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();
    
    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);
    
    const dnd5e2024Button = screen.getByText('D&D 5e (2024)').closest('button');
    expect(dnd5e2024Button).toBeInTheDocument();
    
    if (dnd5e2024Button) {
      await user.click(dnd5e2024Button);
      expect(mockOnSelect).toHaveBeenCalledWith('dnd-5e-2024' as GameSystemId);
    }
  });

  it('should display system version info', () => {
    const mockOnSelect = vi.fn();
    
    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('SRD 5.2')).toBeInTheDocument();
  });

  it('should have accessible buttons for all systems', () => {
    const mockOnSelect = vi.fn();
    
    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
    
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should display content metadata for systems', () => {
    const mockOnSelect = vi.fn();
    
    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);
    
    const spellIndicators = screen.getAllByText(/\d+ spells/);
    expect(spellIndicators.length).toBeGreaterThan(0);
  });
});
