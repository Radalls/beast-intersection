import { Sprite } from "../engine/components/sprite";
import { TILE_PIXEL_SIZE, app } from "./main";
import { Position } from '../engine/components/position';
import { Tile, TileMap } from "../engine/components/tilemap";
import { getComponent } from "../engine/entities/entity.manager";

const spritePath = new URL('../assets/sprites', import.meta.url).pathname;

const getSpritePath = (spriteName: string) => {
    const spriteFolderPath = spriteName.replace(/^(.*?)(\/[^\/]+)?(\.[^\.\/]+)?$/, '$1').split('_')[0];
    return `${spritePath}/${spriteFolderPath}/${spriteName}`;
}

const getEntity = ({ entityId }: {
    entityId: string,
}) => {
    const entity = document.getElementById(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} not found.`);
    }

    return entity;
}

export const createEntity = ({ entityId, htmlId, htmlClass, htmlParent }: {
    entityId: string,
    htmlId?: string,
    htmlClass?: string,
    htmlParent?: HTMLElement,
}) => {
    const entity = document.createElement("div");

    entity.setAttribute("id", htmlId ?? entityId);
    entity.setAttribute("class", htmlClass ?? entityId);

    entity.style.position = "absolute";

    const parent = htmlParent ?? app;
    parent.appendChild(entity);

    return entity;
};

export const updatePosition = ({ entityId, position }: {
    entityId: string,
    position: Omit<Position, '_'>,
}) => {
    const entity = getEntity({ entityId });
    const entitySprite = getComponent({ entityId: entityId, componentId: 'Sprite' });

    entity.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE - ((entitySprite._height - 1) * TILE_PIXEL_SIZE)}px`;
    entity.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
};

export const updateSprite = ({ entityId, sprite }: {
    entityId: string,
    sprite: Omit<Sprite, '_'>,
}) => {
    const entity = getEntity({ entityId });

    entity.style.backgroundImage = `url(${getSpritePath(sprite._image)})`;

    entity.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    entity.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMap = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Omit<TileMap, '_' | 'tiles'>,
}) => {
    const tilemapEntity = getEntity({ entityId });

    tilemapEntity.style.top = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.left = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ entityId, tile }: {
    entityId: string,
    tile: {
        positionX: Tile['position']['_x'],
        positionY: Tile['position']['_y'],
        sprite: Tile['sprite']['_image'],
    },
}) => {
    const tilemapEntity = getEntity({ entityId });

    const tileEntity = createEntity({
        entityId,
        htmlId: `${entityId}-${tile.positionX}-${tile.positionY}`,
        htmlClass: "tile",
        htmlParent: tilemapEntity,
    });

    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite)})`;
    tileEntity.style.top = `${tile.positionY * TILE_PIXEL_SIZE}px`;
    tileEntity.style.left = `${tile.positionX * TILE_PIXEL_SIZE}px`;
    tileEntity.style.width = `${TILE_PIXEL_SIZE}px`;
    tileEntity.style.height = `${TILE_PIXEL_SIZE}px`;
};