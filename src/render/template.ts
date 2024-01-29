import { Sprite } from "../engine/components/sprite";
import { app } from "./main";
import { Position } from '../engine/components/position';

export const createEntity = (entityId: string) => {
    const entity = document.createElement("div");
    entity.setAttribute("id", entityId);
    entity.setAttribute("class", entityId);

    app.appendChild(entity);
};

export const getEntity = (entityId: string) => {
    const entity = document.getElementById(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} not found.`);
    }

    return entity;
}

export const updatePosition = (entityId: string, position: Omit<Position, '_'>) => {
    const entity = getEntity(entityId);
    entity.style.left = `${position._x * 64}px`;
    entity.style.top = `${position._y * 64}px`;
};

export const updateSprite = (entityId: string, sprite: Omit<Sprite, '_'>) => {
    const entity = getEntity(entityId);
    entity.style.height = `${sprite._height}px`;
    entity.style.backgroundImage = `url(${sprite._image})`;
    entity.style.width = `${sprite._width}px`;
};