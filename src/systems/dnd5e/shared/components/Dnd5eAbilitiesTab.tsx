// purpose: Abilities tab body — renders the shared 5e ability-score grid with the 27-point planner.
import { AbilityScoreGrid } from '../../../../components/sheet';
import { TabsContent } from '../../../../components/ui/Tabs';

interface Props {
  attributes: Record<string, number>;
  abilityNames: Record<string, string>;
  canUpdate: boolean;
  onUpdate?: (attributes: Record<string, number>) => void;
}

export function Dnd5eAbilitiesTab({ attributes, abilityNames, canUpdate, onUpdate }: Props) {
  return (
    <TabsContent value="abilities">
      <AbilityScoreGrid
        attributes={attributes}
        names={abilityNames}
        planner="dnd5e"
        onUpdate={canUpdate ? onUpdate : undefined}
      />
    </TabsContent>
  );
}
