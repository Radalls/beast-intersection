import { v4 as uuidv4 } from 'uuid';

import { Component } from '../components/@component';
import { error } from '../services/error';

import { entities } from './entity.manager';

//#region UTILS
export const getEntity = (entityId: string) => entities[entityId] ? entities[entityId] : null;
export const checkEntityId = (entityId: string) => entities[entityId] ? entityId : null;

export const generateEntityId = (entityId: string) => `${entityId}-${uuidv4()}`;

export const checkComponent = <T extends keyof Component>({ entityId, componentId }: {
    componentId: T,
    entityId: string
}) => {
    const entity = getEntity(entityId)
        ?? error({ message: `Entity ${entityId} does not exist`, where: checkComponent.name });

    return entity[componentId] ? componentId : null;
};
//#endregion
