/**
 * Single source of truth for the application's open-content attributions.
 *
 * Both the in-app Legal notices view (`src/components/LegalNotices.tsx`) and the
 * root `NOTICE` generator (`src/scripts/generate-legal-notice.ts`) consume this
 * module, so the two can never drift. It holds only *attribution* prose — the
 * verbatim license bodies (OGL 1.0a, CC-BY-4.0, DPCGL) are fetched from their
 * canonical upstreams into `src/legal/texts/*.txt` and embedded by reference, so
 * no hand-transcribed license text lives here.
 *
 * Provenance is grounded in `docs/srd-sources.md` and `src/utils/openContentPolicy.ts`.
 * Where the shipped provenance is genuinely unsettled (M&M 3e — see LEGAL-2 in the
 * production plan), it is reported honestly as `under-review`, never papered over.
 */

export type ProvenanceStatus = 'open' | 'under-review';

export interface LegalLicenseRef {
  /** Stable id, also the basename (minus `.txt`) of the fetched verbatim text. */
  id: string;
  /** Human-facing license name. */
  name: string;
  /** Canonical URL for the full license. */
  url: string;
  /** Short, plain-language summary (not a substitute for the verbatim text). */
  summary: string;
}

export interface SystemAttribution {
  /** Display label, matching the system selector (e.g. "D&D 5e (2014)"). */
  systemLabel: string;
  /** The open-content document this app draws from (e.g. "System Reference Document 5.1"). */
  content: string;
  /** Which `LegalLicenseRef.id` governs this content. */
  licenseId: string;
  /** The required attribution / use notice for this content. */
  attribution: string;
  /** OGL §15 chain-of-title lines (empty for non-OGL content). */
  section15: readonly string[];
  provenanceStatus: ProvenanceStatus;
  /** Required when `provenanceStatus === 'under-review'`; explains the open question. */
  provenanceNote?: string;
}

export interface LegalAttributions {
  /** ISO date the attributions were last reviewed. */
  updated: string;
  intro: string;
  licenses: readonly LegalLicenseRef[];
  systems: readonly SystemAttribution[];
  disclaimers: {
    notAffiliated: string;
    trademarks: string;
    ai: string;
  };
}

const CC_BY_4_0_URL = 'https://creativecommons.org/licenses/by/4.0/legalcode';

// The d20 System Reference Document §15 base line every OGL-derived d20 system
// inherits. Kept as one constant so the per-system chains stay consistent.
const D20_SRD_SECTION_15 =
  'System Reference Document Copyright 2000-2003, Wizards of the Coast, Inc.; ' +
  'Authors Jonathan Tweet, Monte Cook, Skip Williams, Rich Baker, Andy Collins, ' +
  'David Noonan, Rich Redman, Bruce R. Cordell, John D. Rateliff, Thomas Reid, ' +
  'James Wyatt, based on original material by E. Gary Gygax and Dave Arneson.';

const OGL_SECTION_15 = 'Open Game License v1.0a Copyright 2000, Wizards of the Coast, Inc.';

export const legalAttributions: LegalAttributions = {
  updated: '2026-06-27',
  intro:
    'This is an independent, fan-made tabletop-RPG character and encounter toolkit. ' +
    'It reproduces and builds upon open-game and open-content materials published by ' +
    'their respective rights holders under the open licenses below. The verbatim ' +
    'license texts are reproduced in full as required by those licenses.',
  licenses: [
    {
      id: 'OGL-1.0a',
      name: 'Open Game License v1.0a',
      url: 'https://opengamingfoundation.org/ogl.html',
      summary:
        'Wizards of the Coast’s Open Game License governs the d20 / d20-derived ' +
        'System Reference Documents used here (D&D 3.5e, Pathfinder 1e, Pathfinder 2e ' +
        'Core-era content, and the Mutants & Masterminds 3e Hero SRD). Open Game ' +
        'Content may be reused under its terms; Product Identity may not.',
    },
    {
      id: 'CC-BY-4.0',
      name: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      url: CC_BY_4_0_URL,
      summary:
        'Wizards of the Coast released SRD 5.1 (2014) and SRD 5.2 (2024) under CC BY ' +
        '4.0. Material may be shared and adapted with attribution.',
    },
    {
      id: 'DPCGL',
      name: 'Darrington Press Community Gaming License (DPCGL)',
      url: 'https://darringtonpress.com/license/',
      summary:
        'Darrington Press’s community license governs the Daggerheart System ' +
        'Reference Document 1.0. Community content may be created under its terms; ' +
        'Daggerheart remains the property of Critical Role, LLC.',
    },
  ],
  systems: [
    {
      systemLabel: 'D&D 5e (2014)',
      content: 'System Reference Document 5.1 (SRD 5.1)',
      licenseId: 'CC-BY-4.0',
      attribution:
        'This work includes material from the System Reference Document 5.1 ' +
        '(“SRD 5.1”) by Wizards of the Coast LLC and available at ' +
        'https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is ' +
        'licensed under the Creative Commons Attribution 4.0 International License ' +
        'available at ' +
        CC_BY_4_0_URL +
        '.',
      section15: [],
      provenanceStatus: 'open',
    },
    {
      systemLabel: 'D&D 5e (2024)',
      content: 'System Reference Document 5.2 (SRD 5.2)',
      licenseId: 'CC-BY-4.0',
      attribution:
        'This work includes material from the System Reference Document 5.2 ' +
        '(“SRD 5.2”) by Wizards of the Coast LLC and available at ' +
        'https://www.dndbeyond.com/srd. The SRD 5.2 is licensed under the Creative ' +
        'Commons Attribution 4.0 International License available at ' +
        CC_BY_4_0_URL +
        '.',
      section15: [],
      provenanceStatus: 'open',
    },
    {
      systemLabel: 'D&D 3.5e',
      content: 'System Reference Document 3.5 (SRD 3.5)',
      licenseId: 'OGL-1.0a',
      attribution:
        'D&D 3.5e content is drawn from the open-content System Reference Document 3.5 ' +
        '(core SRD, excluding Psionics and Epic) and is used under the Open Game ' +
        'License v1.0a. The full §15 chain of title is reproduced below.',
      section15: [OGL_SECTION_15, D20_SRD_SECTION_15],
      provenanceStatus: 'open',
    },
    {
      systemLabel: 'Pathfinder 1e',
      content: 'Pathfinder Roleplaying Game Core Rulebook + Bestiary (PRD, Open Game Content)',
      licenseId: 'OGL-1.0a',
      attribution:
        'Pathfinder 1e content is drawn from the Paizo Pathfinder Reference Document ' +
        '(Core Rulebook and Bestiary 1 Open Game Content) and is used under the Open ' +
        'Game License v1.0a. The full §15 chain of title is reproduced below.',
      section15: [
        OGL_SECTION_15,
        D20_SRD_SECTION_15,
        'Pathfinder Roleplaying Game Core Rulebook © 2009, Paizo Publishing, LLC; ' +
          'Author: Jason Bulmahn, based on material by Jonathan Tweet, Monte Cook, and Skip Williams.',
        'Pathfinder Roleplaying Game Bestiary © 2009, Paizo Publishing, LLC; ' +
          'Author: Jason Bulmahn, based on material by Jonathan Tweet, Monte Cook, and Skip Williams.',
      ],
      provenanceStatus: 'open',
    },
    {
      systemLabel: 'Pathfinder 2e',
      content: 'Pathfinder Core Rulebook (Second Edition) + Bestiary (Open Game Content)',
      licenseId: 'OGL-1.0a',
      attribution:
        'Pathfinder 2e content is drawn from the Open Game Content of the Pathfinder ' +
        'Core Rulebook (Second Edition) and Bestiary and is used under the Open Game ' +
        'License v1.0a. (Paizo has since adopted the ORC License for newer material; ' +
        'the Core-era content used here remains OGL Open Game Content.)',
      section15: [
        OGL_SECTION_15,
        'Pathfinder Core Rulebook (Second Edition) © 2019, Paizo Inc.; Authors: ' +
          'Logan Bonner, Jason Bulmahn, Stephen Radney-MacFarland, and Mark Seifter.',
        'Pathfinder Bestiary (Second Edition) © 2019, Paizo Inc.; Authors: Logan ' +
          'Bonner, Jason Bulmahn, Stephen Radney-MacFarland, Mark Seifter, et al.',
      ],
      provenanceStatus: 'open',
    },
    {
      systemLabel: 'Mutants & Masterminds 3e',
      content: 'Mutants & Masterminds 3e Hero SRD',
      licenseId: 'OGL-1.0a',
      attribution:
        'Mutants & Masterminds 3e content is intended to be drawn from the open-content ' +
        'M&M 3e Hero SRD (d20herosrd.com) under the Open Game License v1.0a.',
      section15: [
        OGL_SECTION_15,
        'Mutants & Masterminds Hero’s Handbook, Copyright 2011, Green Ronin ' +
          'Publishing, LLC; Author Steve Kenson.',
      ],
      provenanceStatus: 'under-review',
      provenanceNote:
        'The shipped data currently cites the commercial book title “Hero’s ' +
        'Handbook” rather than the open-content Hero SRD designation, which is not ' +
        'itself an open-content marker. Pending re-verification of every entry against ' +
        'the d20herosrd Open Game Content (tracked as LEGAL-2), this system’s ' +
        'provenance is reported as under review rather than asserted as clean.',
    },
    {
      systemLabel: 'Daggerheart',
      content: 'Daggerheart System Reference Document 1.0 (SRD 1.0)',
      licenseId: 'DPCGL',
      attribution:
        'This product includes materials from the Daggerheart System Reference Document ' +
        '1.0, © Critical Role, LLC, used under the Darrington Press Community ' +
        'Gaming License (DPCGL). Daggerheart and all related marks are trademarks of ' +
        'Critical Role, LLC, used under the DPCGL.',
      section15: [],
      provenanceStatus: 'open',
    },
  ],
  disclaimers: {
    notAffiliated:
      'This is an independent, fan-made tool. It is not affiliated with, endorsed, ' +
      'sponsored, or approved by Wizards of the Coast LLC, Paizo Inc., Green Ronin ' +
      'Publishing LLC, Darrington Press LLC, Critical Role LLC, or any other rights ' +
      'holder.',
    trademarks:
      'Dungeons & Dragons, D&D, Pathfinder, Mutants & Masterminds, Daggerheart, and all ' +
      'other product names, logos, and trademarks are the property of their respective ' +
      'owners and are used here for identification and compatibility purposes only. No ' +
      'challenge to any trademark or copyright is intended.',
    ai:
      'Some features can optionally generate text and images using AI models. ' +
      'AI-generated content is provided as-is, may be inaccurate or rules-incorrect, ' +
      'and is not legally cleared for any particular use. All AI features are disabled ' +
      'by default and must be explicitly enabled by the operator.',
  },
};
