import { TileMap, Tile } from '@/engine/components/tilemap';
import { createTileMap, createTileMapTile, destroyEntity } from '@/render/templates';

//#region EVENTS
export const onTileMapCreate = ({ tilemapEntityId, tilemap }: {
    tilemap: TileMap,
    tilemapEntityId: string
}) => createTileMap({ tilemap, tilemapEntityId });

export const onTileMapTileCreate = ({ tilemapEntityId, tile }: {
    tile: Tile,
    tilemapEntityId: string
}) => createTileMapTile({ tile, tilemapEntityId });

export const onTileMapTileDestroy = ({ tilemapEntityId, tile }: {
    tile: Tile,
    tilemapEntityId: string
}) => destroyEntity({ entityId: `${tilemapEntityId}-tile-${tile.position._x}-${tile.position._y}` });
//#endregion
