import { Position } from '@/engine/components/position';
import { Sprite } from '@/engine/components/sprite';
import { createElement, destroyElement, updatePosition, createSprite } from '@/render/templates';

//#region UTILS
export const onEntityCreate = ({ entityId }: { entityId: string }) => createElement({ entityId });

export const onEntityDestroy = ({ entityId }: { entityId: string }) => destroyElement({ elementId: entityId });

export const onEntityPositionUpdate = ({ entityId, position }: {
    entityId: string,
    position: Position,
}) => updatePosition({ elementId: entityId, position });

export const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Sprite,
}) => createSprite({ elementId: entityId, sprite });
//#endregion
