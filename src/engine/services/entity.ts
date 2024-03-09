import { event } from "../../render/events/event";
import { Component } from "../components/@component";
import { EventTypes } from "../event";
import { setStore } from "../store";
import { Entity } from "../entities/entity";
import { error } from "./error";

export const entities: Record<string, Entity> = {};

//#region CONSTANTS
export const TILEMAP_ENTITY_ID = 'TileMap';
export const PLAYER_ENTITY_ID = 'Player';
//#endregion

//#region HELPERS
export const getEntity = (entityId: string) => entities[entityId] ? entities[entityId] : null;
export const checkEntityId = (entityId: string) => entities[entityId] ? entityId : null;

export const checkComponent = <T extends keyof Component>({ entityId, componentId }: {
    entityId: string,
    componentId: T,
}) => {
    const entity = getEntity(entityId)
        ?? error({ message: `Entity ${entityId} does not exist`, where: checkComponent.name });

    return entity[componentId] ? componentId : null;
}
//#endregion

//#region SERVICES
export const createEntity = (entityId: string) => {
    const existingEntity = getEntity(entityId);
    if (existingEntity) error({ message: `Entity ${entityId} already exists`, where: createEntity.name });

    entities[entityId] = {} as Entity;

    if (entityId === PLAYER_ENTITY_ID) {
        setStore('playerId', entityId);
    }
    if (entityId === TILEMAP_ENTITY_ID) {
        setStore('tilemapId', entityId);
    }

    event({
        type: EventTypes.ENTITY_CREATE,
        entityId,
    });

    return entityId;
}

export const addComponent = <T extends keyof Component>({ entityId, component }: {
    entityId: string,
    component: Component[T],
}) => {
    const entity = getEntity(entityId)
        ?? error({ message: `Entity ${entityId} does not exist`, where: addComponent.name });

    // @ts-ignore - Component[T] is not assignable to type 'undefined'
    entity[component._] = component;
};

export const getComponent = <T extends keyof Component>({ entityId, componentId }: {
    entityId: string,
    componentId: T,
}): Component[T] => {
    const entity = getEntity(entityId)
        ?? error({ message: `Entity ${entityId} does not exist`, where: getComponent.name });

    const component = entity[componentId]
        ?? error({ message: `Component ${componentId} does not exist on entity ${entityId}`, where: getComponent.name });

    return component;
};

export const destroyEntity = ({ entityId }: {
    entityId: string,
}) => {
    delete entities[entityId];

    event({
        type: EventTypes.ENTITY_DESTROY,
        entityId,
    });
}
//#endregion
