import { createElement, TILE_PIXEL_SIZE } from './template';
import { getElement, getSpritePath } from './template.utils';

import { Tile } from '@/engine/components/tilemap';
import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
export const createTileMap = () => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: createTileMap.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId });

    const tileMapElement = getElement({ elementId: tileMapEntityId });

    tileMapElement.style.width = `${tileMap._width * TILE_PIXEL_SIZE}px`;
    tileMapElement.style.height = `${tileMap._height * TILE_PIXEL_SIZE}px`;
    tileMapElement.style.top = `${TILE_PIXEL_SIZE}px`;
    tileMapElement.style.left = `${TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ tile }: { tile: Tile }) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: createTileMapTile.name });

    const tileMapElement = getElement({ elementId: tileMapEntityId });

    const tileElement = createElement({
        elementClass: 'tile',
        elementId: `${tileMapEntityId}-tile-${tile.position._x}-${tile.position._y}`,
        elementParent: tileMapElement,
        entityId: tileMapEntityId,
    });

    tileElement.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileElement.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileElement.style.backgroundImage = `url(${getSpritePath({ spriteName: tile.sprite._image })})`;
};
//#endregion
