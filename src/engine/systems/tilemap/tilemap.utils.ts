import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';

//#region UTILS
export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tilemapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByPosition.name });

    return getComponent({ componentId: 'TileMap', entityId: tilemapEntityId })
        .tiles.find(tile => tile.position._x === x && tile.position._y === y);
};
//#endregion
