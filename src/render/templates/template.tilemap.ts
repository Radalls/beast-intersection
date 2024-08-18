import { TileMap, Tile } from "../../engine/components/tilemap";
import { getEntity, createEntity, getSpritePath, TILE_PIXEL_SIZE } from "./template";

//#region CONSTANTS
//#endregion

//#region TEMPLATES
export const createTileMap = ({ tilemapEntityId, tilemap }: {
    tilemapEntityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.top = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.left = `${TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ tilemapEntityId, tile }: {
    tilemapEntityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    const tileEntity = createEntity({
        entityId: tilemapEntityId,
        htmlId: `${tilemapEntityId}-tile-${tile.position._x}-${tile.position._y}`,
        htmlClass: "tile",
        htmlParent: tilemapEntity,
    });

    tileEntity.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileEntity.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
};
//#endregion
