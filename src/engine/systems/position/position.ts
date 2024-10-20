import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getStore } from '@/engine/services/store';
import { updateSpriteDirection } from '@/engine/systems/sprite';
import { event } from '@/render/events';

//#region CHECKS
const invalidPosition = ({ x, y }: {
    x: number,
    y: number,
}) => x < 0 || y < 0;

const samePosition = ({ entityPosition, inputPosition }: {
    entityPosition: { x: number, y: number },
    inputPosition: { x: number, y: number },
}) => entityPosition.x === inputPosition.x && entityPosition.y === inputPosition.y;
//#endregion

//#region SYSTEMS
export const updatePosition = ({ entityId, tileMapEntityId, target, x, y }: {
    entityId?: string | null,
    target?: 'up' | 'down' | 'left' | 'right',
    tileMapEntityId?: string | null,
    x: number,
    y: number,
}) => {
    if (invalidPosition({ x, y })) {
        throw error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });
    }

    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updatePosition.name });

    if (target) {
        updateSpriteDirection({ entityId, target });
    }

    const position = getComponent({ componentId: 'Position', entityId });
    if (samePosition({
        entityPosition: { x: position._x, y: position._y },
        inputPosition: { x, y },
    })) throw error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });

    position._x = x;
    position._y = y;

    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: updatePosition.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId });
    if (position._tileMapName !== tileMap._name) {
        position._tileMapName = tileMap._name;
    }

    event({ entityId, type: EventTypes.ENTITY_POSITION_UPDATE });
    event({ entityId, type: EventTypes.ENTITY_SPRITE_UPDATE });
};
//#endregion
