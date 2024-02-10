import { Sprite } from "../engine/components/sprite";
import { TILE_PIXEL_SIZE, app } from "./main";
import { Position } from '../engine/components/position';
import { Tile, TileMap } from "../engine/components/tilemap";

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

export const updatePosition = ({ entityId, position, sprite }: {
    entityId: string,
    position: Pick<Position, '_x' | '_y'>,
    sprite: Pick<Sprite, '_height' | '_width'>,
}) => {
    const entity = getEntity({ entityId });

    entity.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
    entity.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE - ((sprite._height - 1) * TILE_PIXEL_SIZE)}px`;
};

export const createSprite = ({ entityId, sprite }: {
    entityId: string,
    sprite: Pick<Sprite, '_image' | '_width' | '_height'>,
}) => {
    const entity = getEntity({ entityId });

    entity.style.backgroundImage = `url(${getSpritePath(sprite._image)})`;
    entity.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    entity.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMap = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    const tilemapEntity = getEntity({ entityId });

    tilemapEntity.style.left = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.top = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ entityId, tile }: {
    entityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    const tilemapEntity = getEntity({ entityId });

    const tileEntity = createEntity({
        entityId,
        htmlId: `${entityId}-${tile.position._x}-${tile.position._y}`,
        htmlClass: "tile",
        htmlParent: tilemapEntity,
    });

    tileEntity.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileEntity.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
    tileEntity.style.width = `${TILE_PIXEL_SIZE}px`;
    tileEntity.style.height = `${TILE_PIXEL_SIZE}px`;
};
