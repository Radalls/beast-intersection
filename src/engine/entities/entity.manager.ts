import { emit } from "../../render/render";
import { Component } from "../components/component";
import { EventTypes } from "../event";
import { Entity } from "./entity";

export const entities: Record<string, Entity> = {};

export const createEntity = (entityId: string): string => {
    const existingEntity = getEntity(entityId);
    if (existingEntity) {
        throw new Error(`Entity ${entityId} already exists`);
    }

    entities[entityId] = {} as Entity;

    emit({
        type: EventTypes.ENTITY_CREATE,
        entityId,
    });

    return entityId;
}

export const getEntity = (entityId: string): Entity | null => entities[entityId];

export const checkEntityId = (entityId: string): string | null => entities[entityId] ? entityId : null;

export const addComponent = <T extends keyof Component>({ entityId, component }: {
    entityId: string,
    component: Component[T],
}): void => {
    const entity = getEntity(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} does not exist`);
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
        throw new Error(`Entity ${entityId} does not exist`);
    }

    const component = entity[componentId];
    if (!(component)) {
        throw new Error(`Entity ${entityId} does not have component ${componentId}`);
    }

    return component;
};
