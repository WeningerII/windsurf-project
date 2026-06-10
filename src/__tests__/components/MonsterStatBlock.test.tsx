import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Monster } from '../../types/creatures/monsters';
import { MonsterStatBlock } from '../../components/MonsterStatBlock';

const fullMonster: Monster = {
  id: 'ancient-dragon',
  name: 'Ancient Red Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  size: 'gargantuan',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 24,
  experiencePoints: 62000,
  armorClass: 22,
  hitPoints: { count: 28, die: 'd20', notation: '28d20+252', modifier: 252 },
  speed: { walk: 40, fly: 80, climb: 40 },
  abilities: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
  savingThrows: { dex: 7, con: 16, wis: 9, cha: 13 },
  skills: { perception: 16, stealth: 7 },
  damageVulnerabilities: ['cold'],
  damageResistances: ['fire'],
  damageImmunities: ['poison'],
  conditionImmunities: ['charmed'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    { name: 'Legendary Resistance', description: 'Can choose to succeed a failed save.' },
  ],
  actions: [{ name: 'Multiattack', description: 'Makes three attacks.' }],
  reactions: [{ name: 'Wing Deflection', description: 'Adds +5 to AC.' }],
  legendaryActions: [
    { name: 'Detect', cost: 1, description: 'Makes a Wisdom (Perception) check.' },
  ],
};

const simpleMonster: Monster = {
  id: 'wolf',
  name: 'Wolf',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', notation: '2d8+2', modifier: 2 },
  // Deliberately a legacy numeric speed: the renderer tolerates numbers from
  // older saved data, and the test below asserts that fallback formatting.
  // The published Monster type only allows CreatureSpeed, hence the cast.
  speed: 40 as unknown as Monster['speed'],
  abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
  senses: ['passive Perception 13'],
  languages: [],
  actions: [{ name: 'Bite', description: 'Melee Weapon Attack.' }],
};

describe('MonsterStatBlock', () => {
  it('renders main stat block sections and derived text', () => {
    render(<MonsterStatBlock monster={fullMonster} />);

    expect(screen.getByText('Ancient Red Dragon')).toBeInTheDocument();
    expect(screen.getByText('CR 24')).toBeInTheDocument();
    expect(screen.getByText('28d20+252')).toBeInTheDocument();
    expect(screen.getByText('walk 40 ft., fly 80 ft., climb 40 ft.')).toBeInTheDocument();
    expect(screen.getByText('Saving Throws:')).toBeInTheDocument();
    expect(screen.getByText('Skills:')).toBeInTheDocument();
    expect(screen.getByText('Special Abilities')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Reactions')).toBeInTheDocument();
    expect(screen.getByText('Legendary Actions')).toBeInTheDocument();
    expect(screen.getByText('Source: SRD 5.1 • dnd-5e-2014')).toBeInTheDocument();
  });

  it('formats simple numeric speed and ability modifiers', () => {
    render(<MonsterStatBlock monster={simpleMonster} />);

    expect(screen.getByText('40 ft.')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('-4')).toBeInTheDocument();
    expect(screen.getByText('Bite')).toBeInTheDocument();
  });

  it('renders negative HP modifiers without a stray plus sign', () => {
    render(
      <MonsterStatBlock
        monster={{
          ...simpleMonster,
          hitPoints: { count: 2, die: 'd8', modifier: -2, notation: '' },
        }}
      />
    );

    expect(screen.getByText('2d8-2')).toBeInTheDocument();
    expect(screen.queryByText(/\+-/)).not.toBeInTheDocument();
  });
});
