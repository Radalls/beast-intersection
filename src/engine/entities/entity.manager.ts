import { Component } from "../components/component";
import { Entity } from "./entity";

export const entities: Record<number, Entity> = {};

export const createEntity = (): number => {
    const id = Object.keys(entities).length + 1;
    entities[id] = {} as Entity;
    return id;
}

export const getEntity = (id: number): Entity | undefined => entities[id];

export const addComponent = <T extends keyof Component>(entityId: number, component: Component[T]): void => {
    const entity = getEntity(entityId);
    if (entity) {
        // @ts-ignore - Component[T] is not assignable to type 'undefined'
        entity[component._] = component;
    }
};

export const getComponent = <T extends keyof Component>(entityId: number, component: T): Component[T] | undefined => {
    const entity = getEntity(entityId);
    return entity ? entity[component] as Component[T] : undefined;
};
