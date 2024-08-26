import { createEntity, TILE_PIXEL_SIZE } from './template';
import { getEntity, getSpritePath } from './template.utils';

import { TileMap, Tile } from '@/engine/components/tilemap';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
export const createTileMap = ({ tilemapEntityId, tilemap }: {
    tilemap: Pick<TileMap, '_height' | '_width'>,
    tilemapEntityId: string
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.top = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.left = `${TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ tilemapEntityId, tile }: {
    tile: Pick<Tile, 'position' | 'sprite'>,
    tilemapEntityId: string
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    const tileEntity = createEntity({
        entityId: tilemapEntityId,
        htmlClass: 'tile',
        htmlId: `${tilemapEntityId}-tile-${tile.position._x}-${tile.position._y}`,
        htmlParent: tilemapEntity,
    });

    tileEntity.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileEntity.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
};
//#endregion
