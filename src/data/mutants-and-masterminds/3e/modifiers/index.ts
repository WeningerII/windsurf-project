// M&M 3e Power Modifiers Index

import { extras } from './extras';
import { flaws } from './flaws';

export const powerModifiers = {
  extras,
  flaws,
};

export const getModifier = (id: string) => {
  const all = [
    ...powerModifiers.extras,
    ...powerModifiers.flaws,
  ];
  return all.find((m) => m.id === id);
};
