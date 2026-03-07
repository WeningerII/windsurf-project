import React from 'react';
import { Monster } from '../types/creatures/monsters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Skull, Shield, Heart, Zap, Swords, Star } from 'lucide-react';

interface MonsterStatBlockProps {
  monster: Monster;
}

export const MonsterStatBlock: React.FC<MonsterStatBlockProps> = ({ monster }) => {
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const formatSpeed = () => {
    if (typeof monster.speed === 'number') {
      return `${monster.speed} ft.`;
    }
    return Object.entries(monster.speed)
      .map(([type, value]) => `${type} ${value} ft.`)
      .join(', ');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-destructive/5 border-b-2 border-destructive">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="w-8 h-8 text-destructive" />
            <div>
              <CardTitle className="text-2xl">{monster.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {monster.size.charAt(0).toUpperCase() + monster.size.slice(1)} {monster.type},{' '}
                {monster.alignment}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">Challenge</div>
            <div className="text-2xl font-bold text-destructive">CR {monster.challengeRating}</div>
            <div className="text-xs text-muted-foreground">{monster.experiencePoints} XP</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Core Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Armor Class</div>
              <div className="text-lg font-bold">{monster.armorClass}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            <div>
              <div className="text-xs text-muted-foreground">Hit Points</div>
              <div className="text-lg font-bold">
                {monster.hitPoints.notation ||
                  `${monster.hitPoints.count}d${monster.hitPoints.die}${monster.hitPoints.modifier ? `+${monster.hitPoints.modifier}` : ''}`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-xs text-muted-foreground">Speed</div>
              <div className="text-lg font-bold">{formatSpeed()}</div>
            </div>
          </div>
        </div>

        {/* Ability Scores */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Ability Scores
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(monster.abilities).map(([ability, score]) => (
              <div key={ability} className="text-center p-3 border rounded-lg">
                <div className="text-xs font-medium text-muted-foreground uppercase">{ability}</div>
                <div className="text-xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">{getModifier(score)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Saving Throws, Skills, etc. */}
        <div className="space-y-2 text-sm">
          {monster.savingThrows && Object.keys(monster.savingThrows).length > 0 && (
            <div>
              <span className="font-semibold">Saving Throws:</span>{' '}
              {Object.entries(monster.savingThrows).map(([ability, bonus]) => (
                <span key={ability} className="ml-2">
                  {ability.toUpperCase()} {bonus >= 0 ? '+' : ''}
                  {bonus}
                </span>
              ))}
            </div>
          )}

          {monster.skills && Object.keys(monster.skills).length > 0 && (
            <div>
              <span className="font-semibold">Skills:</span>{' '}
              {Object.entries(monster.skills).map(([skill, bonus]) => (
                <span key={skill} className="ml-2">
                  {skill} {bonus >= 0 ? '+' : ''}
                  {bonus}
                </span>
              ))}
            </div>
          )}

          {monster.damageVulnerabilities && monster.damageVulnerabilities.length > 0 && (
            <div>
              <span className="font-semibold">Damage Vulnerabilities:</span>{' '}
              {monster.damageVulnerabilities.join(', ')}
            </div>
          )}

          {monster.damageResistances && monster.damageResistances.length > 0 && (
            <div>
              <span className="font-semibold">Damage Resistances:</span>{' '}
              {monster.damageResistances.join(', ')}
            </div>
          )}

          {monster.damageImmunities && monster.damageImmunities.length > 0 && (
            <div>
              <span className="font-semibold">Damage Immunities:</span>{' '}
              {monster.damageImmunities.join(', ')}
            </div>
          )}

          {monster.conditionImmunities && monster.conditionImmunities.length > 0 && (
            <div>
              <span className="font-semibold">Condition Immunities:</span>{' '}
              {monster.conditionImmunities.join(', ')}
            </div>
          )}

          {monster.senses && monster.senses.length > 0 && (
            <div>
              <span className="font-semibold">Senses:</span> {monster.senses.join(', ')}
            </div>
          )}

          {monster.languages && monster.languages.length > 0 && (
            <div>
              <span className="font-semibold">Languages:</span>{' '}
              {monster.languages.length === 0 ? '—' : monster.languages.join(', ')}
            </div>
          )}
        </div>

        {/* Special Abilities */}
        {monster.specialAbilities && monster.specialAbilities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Special Abilities
            </h3>
            <div className="space-y-3">
              {monster.specialAbilities.map((ability, index) => (
                <div key={index} className="pl-4 border-l-2 border-primary/30">
                  <div className="font-semibold">{ability.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{ability.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {monster.actions && monster.actions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Swords className="w-4 h-4" />
              Actions
            </h3>
            <div className="space-y-3">
              {monster.actions.map((action, index) => (
                <div key={index} className="pl-4 border-l-2 border-destructive/30">
                  <div className="font-semibold">{action.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reactions */}
        {monster.reactions && monster.reactions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Reactions</h3>
            <div className="space-y-3">
              {monster.reactions.map((reaction, index) => (
                <div key={index} className="pl-4 border-l-2 border-yellow-500/30">
                  <div className="font-semibold">{reaction.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{reaction.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legendary Actions */}
        {monster.legendaryActions && monster.legendaryActions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-yellow-600">Legendary Actions</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The {monster.name.toLowerCase()} can take 3 legendary actions, choosing from the
              options below. Only one legendary action can be used at a time and only at the end of
              another creature&apos;s turn. The {monster.name.toLowerCase()} regains spent legendary
              actions at the start of its turn.
            </p>
            <div className="space-y-3">
              {monster.legendaryActions.map((action, index) => (
                <div key={index} className="pl-4 border-l-2 border-yellow-500/50">
                  <div className="font-semibold">
                    {action.name}{' '}
                    {action.cost && action.cost > 1 && `(Costs ${action.cost} Actions)`}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        <div className="pt-4 border-t text-xs text-muted-foreground text-center">
          Source: {monster.source} • {monster.system}
        </div>
      </CardContent>
    </Card>
  );
};
