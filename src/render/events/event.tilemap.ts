import { Tile } from '@/engine/components/tilemap';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';
import { createTileMap, createTileMapTile, destroyElement } from '@/render/templates';

//#region EVENTS
export const onTileMapCreate = () => createTileMap();

export const onTileMapTileCreate = ({ tile }: { tile: Tile }) => createTileMapTile({ tile });

export const onTileMapTileDestroy = ({ tile }: {
    tile: Tile,
}) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: onTileMapTileDestroy.name });

    destroyElement({ elementId: `${tileMapEntityId}-tile-${tile.position._x}-${tile.position._y}` });
};
//#endregion
