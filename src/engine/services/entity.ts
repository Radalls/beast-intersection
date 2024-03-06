import { event } from "../../render/event";
import { Component } from "../components/component";
import { EventTypes } from "../event";
import { setStore } from "../store";
import { Entity } from "../entities/entity";

export const entities: Record<string, Entity> = {};

export const TILEMAP_ENTITY_ID = 'TileMap';
export const PLAYER_ENTITY_ID = 'Player';

export const createEntity = (entityId: string) => {
    const existingEntity = getEntity(entityId);
    if (existingEntity) {
        throw {
            message: `Entity ${entityId} already exists`,
            where: createEntity.name,
        }
    }

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

export const getEntity = (entityId: string) => entities[entityId] ? entities[entityId] : null;

export const checkEntityId = (entityId: string) => entities[entityId] ? entityId : null;

export const addComponent = <T extends keyof Component>({ entityId, component }: {
    entityId: string,
    component: Component[T],
}) => {
    const entity = getEntity(entityId);
    if (!(entity)) {
        throw {
            message: `Entity ${entityId} does not exist`,
            where: addComponent.name,
        }
    }

    // @ts-ignore - Component[T] is not assignable to type 'undefined'
    entity[component._] = component;
};

export const getComponent = <T extends keyof Component>({ entityId, componentId }: {
    entityId: string,
    componentId: T,
}): Component[T] => {
    const entity = getEntity(entityId);
    if (!(entity)) {
        throw {
            message: `Entity ${entityId} does not exist`,
            where: getComponent.name,
        }
    }

    const component = entity[componentId];
    if (!(component)) {
        throw {
            message: `Entity ${entityId} does not have a ${componentId}`,
            where: getComponent.name,
        }
    }

    return component;
};

export const checkComponent = <T extends keyof Component>({ entityId, componentId }: {
    entityId: string,
    componentId: T,
}) => {
    const entity = getEntity(entityId);
    if (!(entity)) {
        throw {
            message: `Entity ${entityId} does not exist`,
            where: checkComponent.name,
        }
    }

    return entity[componentId] ? componentId : null;
}

export const destroyEntity = ({ entityId }: {
    entityId: string,
}) => {
    delete entities[entityId];

    event({
        type: EventTypes.ENTITY_DESTROY,
        entityId,
    });
}
