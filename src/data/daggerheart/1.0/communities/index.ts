import type { DaggerheartCommunity, DaggerheartFeature } from '../../../../types/daggerheart';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-08';

function feature(id: string, name: string, description: string): DaggerheartFeature {
  return { id, name, description };
}

function community(
  id: string,
  name: string,
  description: string,
  adjectives: string[],
  entryFeature: DaggerheartFeature
): DaggerheartCommunity {
  return {
    id,
    name,
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description,
    adjectives,
    feature: entryFeature,
  };
}

export const daggerheartCommunities: DaggerheartCommunity[] = [
  community(
    'highborne',
    'Highborne',
    'A privileged upbringing among wealth and influence, where status and leverage shape daily life.',
    ['amiable', 'candid', 'conniving', 'enterprising', 'ostentatious', 'unflappable'],
    feature(
      'highborne-privilege',
      'Privilege',
      'Gain advantage on rolls to consort with nobles, negotiate prices, or use reputation to get what you want.'
    )
  ),
  community(
    'loreborne',
    'Loreborne',
    'A scholarly or politically focused upbringing shaped by study, preservation, or institutions of knowledge.',
    ['direct', 'eloquent', 'inquisitive', 'patient', 'rhapsodic', 'witty'],
    feature(
      'loreborne-well-read',
      'Well-Read',
      'Gain advantage on rolls involving the history, culture, or politics of a prominent person or place.'
    )
  ),
  community(
    'orderborne',
    'Orderborne',
    'A disciplined or faith-shaped background grounded in doctrine, duty, and shared principles.',
    ['ambitious', 'benevolent', 'pensive', 'prudent', 'sardonic', 'stoic'],
    feature(
      'orderborne-dedicated',
      'Dedicated',
      'Record three sayings or values from your upbringing; once per rest, embody one to roll a d20 as your Hope Die.'
    )
  ),
  community(
    'ridgeborne',
    'Ridgeborne',
    'A mountain upbringing that prizes grit, resilience, and survival on dangerous terrain.',
    ['bold', 'hardy', 'indomitable', 'loyal', 'reserved', 'stubborn'],
    feature(
      'ridgeborne-steady',
      'Steady',
      'Gain advantage on rolls to cross cliffs and ledges, navigate harsh terrain, or use survival knowledge.'
    )
  ),
  community(
    'seaborne',
    'Seaborne',
    'A life shaped by coasts, tides, ships, and the rhythms of large bodies of water.',
    ['candid', 'cooperative', 'exuberant', 'fierce', 'resolute', 'weathered'],
    feature(
      'seaborne-know-the-tide',
      'Know the Tide',
      'When you roll with Fear, store a tide token; spend stored tokens before an action roll for +1 each.'
    )
  ),
  community(
    'slyborne',
    'Slyborne',
    'A criminal or underworld upbringing built around schemes, codes, and survival outside the law.',
    ['calculating', 'clever', 'formidable', 'perceptive', 'shrewd', 'tenacious'],
    feature(
      'slyborne-scoundrel',
      'Scoundrel',
      'Gain advantage on rolls to negotiate with criminals, detect lies, or find a place to hide.'
    )
  ),
  community(
    'underborne',
    'Underborne',
    'A subterranean upbringing in burrows, caverns, or underground cities where ingenuity and nerve matter.',
    ['composed', 'elusive', 'indomitable', 'innovative', 'resourceful', 'unpretentious'],
    feature(
      'underborne-low-light-living',
      'Low-Light Living',
      'Gain advantage on rolls to hide, investigate, or perceive details in low light or heavy shadow.'
    )
  ),
  community(
    'wanderborne',
    'Wanderborne',
    'A nomadic upbringing defined by travel, adaptation, and bonds built on shared roads and hardships.',
    ['inscrutable', 'magnanimous', 'mirthful', 'reliable', 'savvy', 'unorthodox'],
    feature(
      'wanderborne-nomadic-pack',
      'Nomadic Pack',
      'Add a Nomadic Pack to your inventory; once per session, spend a Hope to pull out a mundane useful item.'
    )
  ),
  community(
    'wildborne',
    'Wildborne',
    'A forest-based upbringing rooted in conservation, quiet movement, and coexistence with the wild.',
    ['hardy', 'loyal', 'nurturing', 'reclusive', 'sagacious', 'vibrant'],
    feature(
      'wildborne-lightfoot',
      'Lightfoot',
      'Your movement is naturally silent, giving you advantage on rolls to move without being heard.'
    )
  ),
];

export const daggerheartCommunitiesById: Record<string, DaggerheartCommunity> = Object.fromEntries(
  daggerheartCommunities.map((entry) => [entry.id, entry])
);

export function getDaggerheartCommunity(id: string): DaggerheartCommunity | undefined {
  return daggerheartCommunitiesById[id];
}
