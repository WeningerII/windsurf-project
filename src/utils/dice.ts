/**
 * Dice rolling utilities.
 */

export function rollDice(sides: number, count: number = 1): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

export function parseDiceNotation(notation: string): {
  count: number;
  sides: number;
  modifier: number;
} {
  const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
  if (!match) {
    throw new Error(`Invalid dice notation: ${notation}`);
  }

  return {
    count: match[1] ? parseInt(match[1]) : 1,
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3]) : 0,
  };
}

export function rollDiceNotation(notation: string): number {
  const { count, sides, modifier } = parseDiceNotation(notation);
  const rolls = rollDice(sides, count);
  return rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
}
