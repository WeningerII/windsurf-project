import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dnd5eRiderTogglesSection } from '../../systems/dnd5e/shared/components/Dnd5eRiderTogglesSection';

describe('Dnd5eRiderTogglesSection', () => {
  it('renders nothing when no toggles are available', () => {
    const { container } = render(
      <Dnd5eRiderTogglesSection availableToggles={[]} activeToggles={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('activates an available toggle on click', () => {
    const onChange = vi.fn();
    render(
      <Dnd5eRiderTogglesSection
        availableToggles={['rage', 'sneak-attack']}
        activeToggles={[]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Rage' }));
    expect(onChange).toHaveBeenCalledWith(['rage']);
  });

  it('deactivates an active toggle and marks it pressed', () => {
    const onChange = vi.fn();
    render(
      <Dnd5eRiderTogglesSection
        availableToggles={['rage', 'great-weapon-master']}
        activeToggles={['rage']}
        onChange={onChange}
      />
    );
    const rage = screen.getByRole('button', { name: 'Rage' });
    expect(rage).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(rage);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
