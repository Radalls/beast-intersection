import { getElement, getSpritePath, searchElementsById } from './template.utils';

import { getComponent, getRawEntityId, isPlayer } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { app } from '@/render/main';

//#region CONSTANTS
export const TILE_PIXEL_SIZE = 64;

type ElementData =
    | {
        elementAbsolute?: boolean;
        elementClass?: string;
        elementId?: string;
        elementParent?: HTMLElement;
        entityId: string;
    }
    | {
        elementAbsolute?: boolean;
        elementClass?: string;
        elementId: string;
        elementParent?: HTMLElement;
        entityId?: string;
    };
//#endregion

//#region TEMPLATES
export const createElement = ({
    entityId,
    elementId,
    elementClass,
    elementParent,
    elementAbsolute = true,
}: ElementData) => {
    if (!(entityId) && !(elementId)) {
        throw error({
            message: 'Either entityId or elementId must be provided',
            where: createElement.name,
        });
    }

    const element = document.createElement('div');

    const id = elementId ?? entityId!;
    element.setAttribute('id', id);
    element.setAttribute('class', elementClass ?? getRawEntityId({ entityId: id }).toLowerCase());

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

    if (isPlayer({ entityId: elementId })) {
        searchElementsById({ partialElementId: 'Player' }).map((el) => el.remove());
    }

    element.remove();
};

export const updatePosition = ({ elementId }: { elementId: string }) => {
    const position = getComponent({ componentId: 'Position', entityId: elementId });

    const element = getElement({ elementId });

    element.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
    element.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE
        - (((parseInt(element.style.height) / TILE_PIXEL_SIZE) - 1) * TILE_PIXEL_SIZE)}px`;

    element.style.zIndex = `${position._y}`;
};

export const createSprite = ({ elementId }: { elementId: string }) => {
    const sprite = getComponent({ componentId: 'Sprite', entityId: elementId });

    const element = getElement({ elementId });

    element.style.backgroundImage = `url(${getSpritePath({ spriteName: sprite._image })})`;
    element.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    element.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};
//#endregion
