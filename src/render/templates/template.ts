import { Sprite } from "../../engine/components/sprite";
import { app } from "../main";
import { Position } from '../../engine/components/position';
import { error } from "../../engine/services/error";

//#region CONSTANTS
export const spritePath = new URL('../../assets/sprites', import.meta.url).pathname;

export const TILE_PIXEL_SIZE = 64;
//#endregion

//#region HELPERS
export const getSpritePath = (spriteName: string) => {
    const spriteFolderPath = spriteName.replace(/^(.*?)(\/[^\/]+)?(\.[^\.\/]+)?$/, '$1').split('_')[0];
    return `${spritePath}/${spriteFolderPath}/${spriteName}`;
}

export const getEntity = ({ entityId }: { entityId: string }) => {
    const entity = document.getElementById(entityId)
        ?? error({ message: `HTML Entity ${entityId} does not exist`, where: getEntity.name });

    return entity;
}

export const checkEntity = ({ entityId }: { entityId: string }) => {
    return document.getElementById(entityId) !== null;
}
//#endregion

//#region TEMPLATES
export const createEntity = ({ entityId, htmlId, htmlClass, htmlParent, htmlAbsolute = true }: {
    entityId: string,
    htmlId?: string,
    htmlClass?: string,
    htmlParent?: HTMLElement,
    htmlAbsolute?: boolean,
}) => {
    const entity = document.createElement('div');

    entity.setAttribute('id', htmlId ?? entityId);
    entity.setAttribute('class', htmlClass ?? entityId.toLowerCase());

    entity.style.position = htmlAbsolute ? 'absolute' : 'relative';

    const parent = htmlParent ?? app;
    parent.appendChild(entity);

    return entity;
};

export const destroyEntity = ({ entityId }: { entityId: string }) => {
    const entity = getEntity({ entityId });

    entity.remove();
};

export const updatePosition = ({ entityId, position }: {
    entityId: string,
    position: Position,
}) => {
    const entity = getEntity({ entityId });

    entity.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
    entity.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE - (((parseInt(entity.style.height) / TILE_PIXEL_SIZE) - 1) * TILE_PIXEL_SIZE)}px`;
    entity.style.zIndex = `${position._y}`;
};

export const createSprite = ({ entityId, sprite }: {
    entityId: string,
    sprite: Sprite,
}) => {
    const entity = getEntity({ entityId });

    entity.style.backgroundImage = `url(${getSpritePath(sprite._image)})`;
    entity.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    entity.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};
//#endregion
