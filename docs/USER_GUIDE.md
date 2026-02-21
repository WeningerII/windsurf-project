# RPG Character Sheet - User Guide

**Last Updated**: February 18, 2026

## Table of Contents
- [Getting Started](#getting-started)
- [Creating a Character](#creating-a-character)
- [Managing Characters](#managing-characters)
- [Character Sheet Features](#character-sheet-features)
- [Data Management](#data-management)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch
When you first open the RPG Character Sheet application, you'll see:
1. **System Selector** - Choose your game system (D&D 5e, Pathfinder, etc.)
2. **Create Character Button** - Start building your character
3. **Your Characters** - View previously created characters

### Supported Game Systems
- **D&D 5th Edition (2024)** - SRD 5.2 content (315 spells, 87 feats, 204 equipment items)
- **D&D 5th Edition (2014)** - SRD 5.1 content (238 spells, 230 equipment items)
- **D&D 3.5 Edition** - SRD 3.5 content (555 spells, 515 feats)
- **Pathfinder 1e** - Core complete (134 spells, 86 feats, 11 classes)
- **Pathfinder 2e** - Core complete (146 spells, 93 feats, 12 classes)
- **Mutants & Masterminds 3e** - SRD content (61 powers, 74 advantages, 150 equipment)

---

## Creating a Character

### Step 1: Select Game System
1. Click on your preferred game system card
2. Review the system details and version
3. Click "Create New Character" to open a new editable character sheet immediately

### Step 2: Edit Character Information
Use the top card on the sheet to set:
- **Character Name**
- **Level** (1-20)
- **Species/Race**
- **Class**
- **Background**
- **Alignment**

### Step 3: Attributes
Set your character's ability scores:
- **Strength (STR)** - Physical power
- **Dexterity (DEX)** - Agility and reflexes
- **Constitution (CON)** - Endurance and health
- **Intelligence (INT)** - Reasoning and memory
- **Wisdom (WIS)** - Awareness and insight
- **Charisma (CHA)** - Force of personality

**Tip:** Modifiers are automatically calculated based on your scores.

### Step 4: Combat Statistics
Configure your combat stats:
- **Hit Points** - Current, Max, and Temporary HP
- **Armor Class** - Your AC value
- **Speed** - Movement speed in feet
- **Initiative** - Initiative bonus
- **Proficiency Bonus** - Auto-calculated based on level

---

## Managing Characters

### Viewing Characters
- All your characters are displayed on the home screen
- Click any character card to open their sheet
- Character cards show: Name, Level, Species, Class, and System

### Editing Characters
1. Open the character sheet
2. Click on any field to edit
3. Changes are automatically saved to browser storage
4. Click "Back" in the header to return to character list

### Deleting Characters
1. Select a character from the dropdown
2. Click the trash icon in the header
3. Confirm deletion (this cannot be undone)

---

## Character Sheet Features

### Tabbed Navigation
Your character sheet is organized into tabs:
- **Sheet** - Full editable character sheet
- **Inventory** - Track items and quantities
- **Spells** - Spell browser for the selected system
- **Feats** - Feat browser for the selected system
- **Equipment** - Equipment browser for the selected system
- **Monsters** - Monster compendium for the selected system

### Attributes Section
- **Input Fields** - Click to edit attribute scores (1-30)
- **Modifiers** - Automatically calculated and displayed
- **Tooltips** - Hover over labels for descriptions

### Skills Section
- **Proficiency Toggle** - Click the circle/star button to cycle through:
  - ○ = No proficiency
  - ★ = Proficient
  - ★★ = Expertise
- **Skill Ranks** - For systems that use skill ranks (D&D 3.5e, Pathfinder 1e only)
- **Total Bonus** - Automatically calculated from attribute + proficiency + ranks

### Notes Section
- Free-form text area for character notes
- Supports multiple paragraphs
- Auto-saves with character data

---

## Data Management

### Exporting a Character
1. Open the character sheet
2. Click the Download button (⬇) in the header
3. Downloads a JSON file: `{character-name}_character.json`
4. **Use Case:** Backup, sharing, or transferring between devices

### Importing a Character
1. Click "Import Character" button from:
   - Main character list screen, OR
   - Character sheet header (Upload button ⬆)
2. Select a previously exported JSON file
3. Character is added with a new unique ID
4. **Note:** Imported characters get new IDs to prevent conflicts

### Clearing All Data
1. Click "Clear All Characters" button on the home screen
2. Confirm the action (irreversible)
3. All characters are permanently deleted
4. **Warning:** Export your data first if you want to keep it

### Home Screen Data Management
Use the home-screen controls to:
- Export all characters in one file
- Import multiple characters at once
- Clear all stored characters

---

## Keyboard Shortcuts

### Navigation
- **Esc** - Close dialogs and modals
- **Tab** - Navigate between form fields
- **Shift + Tab** - Navigate backwards

### Accessibility
- **Screen Reader Support** - Full ARIA labels and descriptions
- **Keyboard Navigation** - All features accessible via keyboard
- **Focus Indicators** - Clear visual focus states

---

## Troubleshooting

### Character Not Saving
**Problem:** Changes aren't being saved
**Solution:**
- Check browser storage isn't full
- Ensure JavaScript is enabled
- Try exporting and re-importing your data

### Import Failed
**Problem:** Can't import character file
**Solution:**
- Verify file is valid JSON format
- Check file was exported from this application
- Ensure file isn't corrupted

### Performance Issues
**Problem:** App is slow or laggy
**Solution:**
- Clear browser cache
- Reduce number of characters (export and archive old ones)
- Update to latest browser version

### Data Lost
**Problem:** Characters disappeared
**Solution:**
- Check if you're using the same browser and device
- Look for exported backup files
- Check browser's local storage wasn't cleared

---

## Best Practices

### Regular Backups
- Export your characters weekly
- Store backups in multiple locations
- Name files with dates for easy tracking

### Organization
- Use descriptive character names
- Delete unused characters
- Keep active campaigns separate from archived ones

### Performance
- Limit to 50 active characters for best performance
- Archive completed campaigns
- Clear browser cache periodically

---

## Support & Feedback

### Getting Help
- Check this user guide first
- Review the README.md for technical details
- Check the project's issue tracker

### Reporting Bugs
Include the following information:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (if any)

---

## Version Information

**Current Version:** 1.0  
**Last Updated:** February 18, 2026  
**Compatible Systems:** D&D 5e, D&D 3.5e, Pathfinder 1e/2e, M&M 3e

---

## Legal Notice

This application uses content from various System Reference Documents (SRDs) under the Open Gaming License (OGL) 1.0a. All content is SRD-compliant and does not include proprietary material.

For full legal information, see `SRD_COMPLIANCE.md` in this directory.
