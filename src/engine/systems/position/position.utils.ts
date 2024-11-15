import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';
import { findTileByPosition } from '@/engine/systems/tilemap';

//#region CHECKS
export const invalidPosition = ({ x, y }: {
    x: number,
    y: number,
}) => x < 0 || y < 0;

export const samePosition = ({ entityPosition, targetPosition }: {
    entityPosition: { x: number, y: number },
    targetPosition: { x: number, y: number },
}) => entityPosition.x === targetPosition.x && entityPosition.y === targetPosition.y;

export const isFacingPosition = ({ entityId, targetPosition }: {
    entityId?: string | null,
    targetPosition?: { x: number, y: number }
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: isFacingPosition.name });

    const position = getComponent({ componentId: 'Position', entityId });
    const sprite = getComponent({ componentId: 'Sprite', entityId });

    if (!(targetPosition)) targetPosition = getFacingPosition({ entityId })
        ?? error({ message: 'Target position is undefined', where: isFacingPosition.name });

    if (position._x < targetPosition.x) {
        return sprite._direction === 'right';
    } else if (position._x > targetPosition.x) {
        return sprite._direction === 'left';
    } else if (position._y < targetPosition.y) {
        return sprite._direction === 'down';
    } else if (position._y > targetPosition.y) {
        return sprite._direction === 'up';
    }
};

export const getFacingPosition = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: getFacingPosition.name });

    const position = getComponent({ componentId: 'Position', entityId });
    const sprite = getComponent({ componentId: 'Sprite', entityId });

    if (!(sprite._direction)) error({
        message: 'Sprite direction is undefined',
        where: getFacingPosition.name,
    });

    if (sprite._direction === 'up') return { x: position._x, y: position._y - 1 };
    else if (sprite._direction === 'down') return { x: position._x, y: position._y + 1 };
    else if (sprite._direction === 'left') return { x: position._x - 1, y: position._y };
    else if (sprite._direction === 'right') return { x: position._x + 1, y: position._y };
};

export const validItemPosition = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: validItemPosition.name });

    const position = getComponent({ componentId: 'Position', entityId });
    const tile = findTileByPosition({ x: position._x, y: position._y })
        ?? error({ message: 'Player tile is undefined', where: validItemPosition.name });

    return tile._entityIds.length === 1 && tile._entityIds[0] === entityId;
};

export const validPlacePosition = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: validPlacePosition.name });

    const placePosition = getFacingPosition({ entityId })
        ?? error({ message: 'Place position is undefined', where: validPlacePosition.name });

    const placeTile = findTileByPosition({ x: placePosition.x, y: placePosition.y })
        ?? error({ message: 'Place tile is undefined', where: validPlacePosition.name });

    return (
        !(placeTile._solid)
        && placeTile._entityIds.length === 0
        && placeTile._entityColliderIds.length === 0
    );
};
//#endregion

//#region UTILS
//#endregion
