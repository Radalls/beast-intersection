import { TileMap, Tile } from '../../engine/components/tilemap';
import { createTileMap, createTileMapTile } from '../templates/template.tilemap';

//#region EVENTS
export const onTileMapCreate = ({ tilemapEntityId, tilemap }: {
    tilemap: TileMap,
    tilemapEntityId: string
}) => createTileMap({ tilemap, tilemapEntityId });

export const onTileMapTileCreate = ({ tilemapEntityId, tile }: {
    tile: Tile,
    tilemapEntityId: string
}) => createTileMapTile({ tile, tilemapEntityId });
//#endregion
