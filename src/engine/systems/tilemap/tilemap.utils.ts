import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';

//#region UTILS
export const getTargetXY = ({ target, x, y }: {
    target: 'up' | 'down' | 'left' | 'right',
    x: number,
    y: number,
}) => {
    if (target === 'up') return { targetX: x, targetY: y - 1 };
    else if (target === 'down') return { targetX: x, targetY: y + 1 };
    else if (target === 'left') return { targetX: x - 1, targetY: y };
    else if (target === 'right') return { targetX: x + 1, targetY: y };
    else throw error({ message: 'Invalid target', where: getTargetXY.name });
};

export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: findTileByPosition.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile.position._x === x && tile.position._y === y);
};
//#endregion
