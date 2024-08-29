import { getElement, getSpritePath } from './template.utils';

import { Position } from '@/engine/components/position';
import { Sprite } from '@/engine/components/sprite';
import { app } from '@/render/main';

//#region CONSTANTS
export const TILE_PIXEL_SIZE = 64;
//#endregion

//#region TEMPLATES
export const createElement = ({ entityId, elementId, elementClass, elementParent, elementAbsolute = true }: {
    elementAbsolute?: boolean,
    elementClass?: string,
    elementId?: string,
    elementParent?: HTMLElement
    entityId: string,
}) => {
    const element = document.createElement('div');

    element.setAttribute('id', elementId ?? entityId);
    element.setAttribute('class', elementClass ?? entityId.toLowerCase());

    element.style.position = elementAbsolute ? 'absolute' : 'relative';

    const parent = elementParent ?? app;
    parent.appendChild(element);

    return element;
};

export const destroyElement = ({ elementId }: { elementId: string }) => {
    const element = getElement({ elementId });

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    element.remove();
};

export const updatePosition = ({ elementId, position }: {
    elementId: string,
    position: Position,
}) => {
    const element = getElement({ elementId });

    element.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
    element.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE
        - (((parseInt(element.style.height) / TILE_PIXEL_SIZE) - 1) * TILE_PIXEL_SIZE)}px`;
    element.style.zIndex = `${position._y}`;
};

export const createSprite = ({ elementId, sprite }: {
    elementId: string,
    sprite: Sprite,
}) => {
    const element = getElement({ elementId });

    element.style.backgroundImage = `url(${getSpritePath(sprite._image)})`;
    element.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    element.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};
//#endregion
