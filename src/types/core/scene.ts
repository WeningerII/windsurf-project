export type SceneGridType = 'square';
export type SceneTokenKind = 'character' | 'monster' | 'npc' | 'object';
export type SceneMarkerKind = 'terrain' | 'hazard';

export interface SceneGrid {
  type: SceneGridType;
  width: number;
  height: number;
  cellSize: number;
}

export interface SceneCoordinate {
  x: number;
  y: number;
}

export interface SceneToken {
  id: string;
  name: string;
  kind: SceneTokenKind;
  position: SceneCoordinate;
  size: number;
  refId?: string;
  hidden?: boolean;
}

export interface SceneMarker {
  id: string;
  kind: SceneMarkerKind;
  label: string;
  position: SceneCoordinate;
  width: number;
  height: number;
}

export interface SceneInitiativeEntry {
  tokenId: string;
  value: number;
}

export interface SceneState {
  sceneId: string;
  name: string;
  systemId: string;
  campaignId?: string;
  grid: SceneGrid;
  tokens: Record<string, SceneToken>;
  markers: Record<string, SceneMarker>;
  initiative: SceneInitiativeEntry[];
  round: number;
  activeTokenId?: string;
  seed: string;
}

export type SceneEventType =
  | 'token.added'
  | 'token.moved'
  | 'token.removed'
  | 'marker.added'
  | 'marker.removed'
  | 'initiative.set'
  | 'turn.advanced';

export interface SceneEventBase<TType extends SceneEventType, TPayload> {
  id: string;
  type: TType;
  sequence: number;
  createdAt: Date;
  actorId?: string;
  payload: TPayload;
}

export type SceneEvent =
  | SceneEventBase<'token.added', { token: SceneToken }>
  | SceneEventBase<'token.moved', { tokenId: string; position: SceneCoordinate }>
  | SceneEventBase<'token.removed', { tokenId: string }>
  | SceneEventBase<'marker.added', { marker: SceneMarker }>
  | SceneEventBase<'marker.removed', { markerId: string }>
  | SceneEventBase<'initiative.set', { entries: SceneInitiativeEntry[]; activeTokenId?: string }>
  | SceneEventBase<'turn.advanced', { nextTokenId?: string }>;

export interface SceneDocument {
  id: string;
  name: string;
  systemId: string;
  campaignId?: string;
  initialState: SceneState;
  events: SceneEvent[];
  createdAt: Date;
  updatedAt: Date;
  version: 1;
}

export type SceneActionType =
  | 'place-token'
  | 'move-token'
  | 'remove-token'
  | 'add-marker'
  | 'remove-marker'
  | 'set-initiative'
  | 'advance-turn';

export type SceneActionIntent =
  | { type: 'place-token'; actorId?: string; token: SceneToken }
  | { type: 'move-token'; actorId?: string; tokenId: string; position: SceneCoordinate }
  | { type: 'remove-token'; actorId?: string; tokenId: string }
  | { type: 'add-marker'; actorId?: string; marker: SceneMarker }
  | { type: 'remove-marker'; actorId?: string; markerId: string }
  | {
      type: 'set-initiative';
      actorId?: string;
      entries: SceneInitiativeEntry[];
      activeTokenId?: string;
    }
  | { type: 'advance-turn'; actorId?: string };

export interface SceneIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning';
  eventId?: string;
  sequence?: number;
}
