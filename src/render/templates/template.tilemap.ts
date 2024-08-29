import { createElement, TILE_PIXEL_SIZE } from './template';
import { getElement, getSpritePath } from './template.utils';

import { TileMap, Tile } from '@/engine/components/tilemap';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
export const createTileMap = ({ tileMapEntityId, tileMap }: {
    tileMap: TileMap,
    tileMapEntityId: string
}) => {
    const tileMapElement = getElement({ elementId: tileMapEntityId });

    tileMapElement.style.width = `${tileMap._width * TILE_PIXEL_SIZE}px`;
    tileMapElement.style.height = `${tileMap._height * TILE_PIXEL_SIZE}px`;
    tileMapElement.style.top = `${TILE_PIXEL_SIZE}px`;
    tileMapElement.style.left = `${TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ tileMapEntityId, tile }: {
    tile: Tile,
    tileMapEntityId: string
}) => {
    const tileMapElement = getElement({ elementId: tileMapEntityId });

    const tileElement = createElement({
        elementClass: 'tile',
        elementId: `${tileMapEntityId}-tile-${tile.position._x}-${tile.position._y}`,
        elementParent: tileMapElement,
        entityId: tileMapEntityId,
    });

    tileElement.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileElement.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileElement.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
};
//#endregion
