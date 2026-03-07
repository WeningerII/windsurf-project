#!/usr/bin/env tsx
// Display implementation progress — reads computed metadata (counts derived from data imports)

import { dnd5eMetadata, getProgress } from '../data/dnd/5e-2014/metadata';

function showProgress() {
  console.log('\n🎲 RPG Character Sheet - Implementation Progress\n');
  console.log('='.repeat(60));

  const overallProgress = getProgress();
  console.log(`\n📊 Overall D&D 5e Progress: ${overallProgress.toFixed(1)}%`);

  const stats = dnd5eMetadata.stats;

  // Spells
  console.log('\n📜 Spells:');
  console.log(`   Total: ${stats.spells.count}`);
  console.log('\n   By Level:');
  Object.entries(stats.spells.byLevel).forEach(([level, count]) => {
    const bar = '█'.repeat(20);
    console.log(`     Level ${level}: [${bar}] ${count}`);
  });

  console.log('\n   By School:');
  Object.entries(stats.spells.bySchool).forEach(([school, count]) => {
    const bar = '█'.repeat(20);
    const schoolName = school.charAt(0).toUpperCase() + school.slice(1);
    console.log(`     ${schoolName.padEnd(15)}: [${bar}] ${count}`);
  });

  // Classes
  console.log('\n⚔️  Classes:');
  console.log(`   Total: ${stats.classes.count}`);

  // Species
  console.log('\n🧝 Species:');
  console.log(`   Total: ${stats.species.count}`);

  // Backgrounds
  console.log('\n📋 Backgrounds:');
  console.log(`   Total: ${stats.backgrounds.count}`);

  // Monsters
  console.log('\n👹 Monsters:');
  console.log(`   Total: ${stats.monsters.count}`);

  // Feats
  console.log('\n🎯 Feats:');
  console.log(`   Total: ${stats.feats.count}`);

  // Equipment
  console.log('\n⚔️  Equipment:');
  console.log(`   Weapons: ${stats.equipment.weapons}`);
  console.log(`   Armor: ${stats.equipment.armor}`);
  console.log(`   Adventuring Gear: ${stats.equipment.adventuringGear}`);
  console.log(`   Magic Items: ${stats.equipment.magicItems}`);

  // Special Abilities
  console.log('\n✨ Special Abilities:');
  Object.entries(stats.specialAbilities).forEach(([ability, count]) => {
    const abilityName =
      ability
        .split(/(?=[A-Z])/)
        .join(' ')
        .charAt(0)
        .toUpperCase() +
      ability
        .split(/(?=[A-Z])/)
        .join(' ')
        .slice(1);
    console.log(`   ${abilityName.padEnd(20)}: ${count}`);
  });

  console.log('\n' + '='.repeat(60));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  showProgress();
}

export { showProgress };
