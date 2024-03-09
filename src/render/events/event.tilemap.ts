import { TileMap, Tile } from "../../engine/components/tilemap";
import { createTileMap, createTileMapTile } from "../templates/template.tilemap";

//#region EVENTS
export const onTileMapCreate = ({ tilemapEntityId, tilemap }: {
    tilemapEntityId: string,
    tilemap: TileMap,
}) => createTileMap({ tilemapEntityId, tilemap });

export const onTileMapTileCreate = ({ tilemapEntityId, tile }: {
    tilemapEntityId: string,
    tile: Tile,
}) => createTileMapTile({ tilemapEntityId, tile });
//#endregion
