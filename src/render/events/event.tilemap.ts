import { TileMap, Tile } from '@/engine/components/tilemap';
import { createTileMap, createTileMapTile, destroyElement } from '@/render/templates';

//#region EVENTS
export const onTileMapCreate = ({ tileMapEntityId, tileMap }: {
    tileMap: TileMap,
    tileMapEntityId: string
}) => createTileMap({ tileMap, tileMapEntityId });

export const onTileMapTileCreate = ({ tileMapEntityId, tile }: {
    tile: Tile,
    tileMapEntityId: string
}) => createTileMapTile({ tile, tileMapEntityId });

export const onTileMapTileDestroy = ({ tileMapEntityId, tile }: {
    tile: Tile,
    tileMapEntityId: string
}) => destroyElement({ elementId: `${tileMapEntityId}-tile-${tile.position._x}-${tile.position._y}` });
//#endregion
