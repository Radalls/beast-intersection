import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';

//#region UTILS
export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tileMapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tileMapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByPosition.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile.position._x === x && tile.position._y === y);
};
//#endregion
