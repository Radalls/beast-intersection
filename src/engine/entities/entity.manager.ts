import { Component } from "../components/component";
import { Entity } from "./entity";

export const entities: Record<number, Entity> = {};

export const createEntity = (): number => {
    const id = Object.keys(entities).length + 1;
    entities[id] = {} as Entity;
    return id;
}

export const getEntity = (entityId: number): Entity | null => entities[entityId];

export const addComponent = <T extends keyof Component>({ entityId, component }: {
    entityId: number,
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
    entityId: number,
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
