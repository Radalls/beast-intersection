import { Position } from '@/engine/components/position';
import { Sprite } from '@/engine/components/sprite';
import { State } from '@/engine/components/state';
import { createElement, destroyElement, updatePosition, createSprite, getElement } from '@/render/templates';

//#region UTILS
export const onEntityCreate = ({ entityId }: { entityId: string }) => createElement({ entityId });

export const onEntityDestroy = ({ entityId }: { entityId: string }) => destroyElement({ elementId: entityId });

export const onEntityDisplay = ({ entityId, state }: {
    entityId: string,
    state: State,
}) => {
    const element = getElement({ elementId: entityId });

    element.style.display = (state._active) ? 'block' : 'none';
};

export const onEntityPositionUpdate = ({ entityId, position }: {
    entityId: string,
    position: Position,
}) => updatePosition({ elementId: entityId, position });

export const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Sprite,
}) => createSprite({ elementId: entityId, sprite });
//#endregion
