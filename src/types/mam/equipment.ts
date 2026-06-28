// Mutants & Masterminds 3e Equipment Types

export interface MaMEquipment {
  id: string;
  name: string;
  system: 'mam3e';
  source: string;

  type: MaMEquipmentType;
  cost: number; // Equipment points

  features?: string[];
  description: string;
}

export type MaMEquipmentType =
  | 'vehicle'
  | 'device'
  | 'headquarters'
  | 'hq-feature'
  | 'weapon'
  | 'armor'
  | 'gear';

export interface Vehicle extends MaMEquipment {
  type: 'vehicle';
  size: VehicleSize;
  strength: number;
  speed: number;
  defense: number;
  toughness: number;
  features: string[];
}

export type VehicleSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan'
  | 'colossal'
  | 'awesome';

export interface Device extends MaMEquipment {
  type: 'device';
  removable: boolean;
  powers: string[]; // Power IDs contained in the device
}

export interface Headquarters extends MaMEquipment {
  type: 'headquarters';
  size: HeadquartersSize;
  toughness: number;
  features: string[];
}

/**
 * A purchasable headquarters Feature (M&M 3e). Features are equipment-point
 * upgrades to a base headquarters, not standalone bases, so they carry no
 * size/toughness of their own — modeled separately from Headquarters to keep
 * the Headquarters[] catalog clean.
 */
export interface HQFeature extends MaMEquipment {
  type: 'hq-feature';
}

export type HeadquartersSize = 'small' | 'medium' | 'large' | 'huge' | 'enormous' | 'colossal';
