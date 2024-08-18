import { event } from "../../render/events/event";
import { Component } from "../components/@component";
import { EventTypes } from "../event";
import { setStore } from "../store";
import { Entity } from "./entity";
import { error } from "../services/error";
import { v4 as uuidv4 } from 'uuid';

export const entities: Record<string, Entity> = {};

//#region CONSTANTS
export const TILEMAP_ENTITY_NAME = 'TileMap';
export const PLAYER_ENTITY_NAME = 'Player';
//#endregion

//#region HELPERS
export const getEntity = (entityId: string) => entities[entityId] ? entities[entityId] : null;
export const checkEntityId = (entityId: string) => entities[entityId] ? entityId : null;

export const generateEntityId = (entityId: string) => `${entityId}-${uuidv4()}`

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
export const createEntity = ({ entityName }: { entityName: string }) => {
    const entityId = generateEntityId(entityName);

    const existingEntity = getEntity(entityId);
    if (existingEntity) error({ message: `Entity ${entityId} already exists`, where: createEntity.name });

    entities[entityId] = {} as Entity;

    if (entityName === PLAYER_ENTITY_NAME) {
        setStore('playerId', entityId);
    }
    if (entityName === TILEMAP_ENTITY_NAME) {
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

    // @ts-expect-error - Component[T] is not assignable to type 'undefined'
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
