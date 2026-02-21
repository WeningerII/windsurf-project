/**
 * Core Document Architecture
 * 
 * This file defines the generic container structure for all character data.
 * It follows the "Document & Data Model" pattern where the Core Application
 * manages the container (ID, metadata) and the System handles the implementation details.
 */

/**
 * The base interface that all System Data Models must extend.
 * This ensures that every system has at least a minimal structure.
 * 
 * Systems should define their own specific interfaces extending this.
 * e.g., interface Dnd5eData extends SystemDataModel { attributes: ... }
 */
export interface SystemDataModel {
  [key: string]: unknown;
}

/**
 * The Generic Character Document.
 * 
 * This is the object that gets saved to localStorage/database.
 * It wraps the system-specific data in a type-safe container.
 * 
 * @template T The specific System Data Model (defaults to generic)
 */
export interface CharacterDocument<T extends SystemDataModel = SystemDataModel> {
  // Universal Identity & Metadata
  id: string;
  name: string;
  
  // The System Discriminator
  // This tells the app which System Engine to load
  systemId: string;
  
  // Universal Visuals
  img?: string;
  
  // The Black Box
  // This contains ALL system-specific mechanics (stats, items, spells, etc.)
  // The Core App should rarely touch this directly, instead delegating to the System Engine.
  system: T;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
