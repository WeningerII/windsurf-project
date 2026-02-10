import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the application header', () => {
    render(<App />);
    expect(screen.getByText('RPG Character Sheet')).toBeInTheDocument();
    expect(screen.getByText('Multi-system tabletop character manager')).toBeInTheDocument();
  });

  it('displays system selector on initial load', () => {
    render(<App />);
    expect(screen.getByText('Choose a Game System')).toBeInTheDocument();
  });

  it('shows create character button when system is selected', () => {
    render(<App />);
    const systemCards = screen.getAllByRole('button');
    fireEvent.click(systemCards[0]);
    expect(screen.getByText('Create New Character')).toBeInTheDocument();
  });

  it('persists characters to localStorage', () => {
    render(<App />);
    
    const systemCards = screen.getAllByRole('button');
    fireEvent.click(systemCards[0]);
    
    const createButton = screen.getByText('Create New Character');
    fireEvent.click(createButton);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Enter character name'), { target: { value: 'New Character' } });

    for (let i = 0; i < 6; i += 1) {
      fireEvent.click(screen.getByText('Next'));
    }
    fireEvent.click(screen.getByText('Create Character'));
    
    expect(localStorage.getItem('rpg-characters')).toBeTruthy();
    
    const savedData = localStorage.getItem('rpg-characters');
    expect(savedData).toBeTruthy();
    if (savedData) {
      const stored = JSON.parse(savedData) as { characters?: Array<{ name?: string }> };
      expect(Array.isArray(stored.characters)).toBe(true);
      expect(stored.characters?.length).toBe(1);
      expect(stored.characters?.[0].name).toBe('New Character');
    }
  });
});
