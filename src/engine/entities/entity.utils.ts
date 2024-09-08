import { v4 as uuidv4 } from 'uuid';

import { entities, PLAYER_ENTITY_NAME } from './entity.manager';

import { Component } from '@/engine/components/@component';
import { error } from '@/engine/services/error';

//#region UTILS
export const getEntity = ({ entityId }: { entityId: string }) => entities[entityId] ? entities[entityId] : null;

export const checkEntityId = ({ entityId }: { entityId: string }) => entities[entityId] ? entityId : null;

export const generateEntityId = ({ entityName }: { entityName: string }) => `${entityName}-${uuidv4()}`;

export const isPlayer = ({ entityId }: { entityId: string }) => entityId.includes(PLAYER_ENTITY_NAME);

export const getRawEntityId = ({ entityId }: { entityId: string }) => entityId.split('-')[0];

export const findEntityByName = ({ entityName }: { entityName: string }) => {
    const entityId = Object.keys(entities).find(entityId => entityId.includes(entityName));

    const entity = (entityId)
        ? getEntity({ entityId })
        : null;

    return { entity: entity, entityId };
};

export const checkComponent = <T extends keyof Component>({ entityId, componentId }: {
    componentId: T,
    entityId: string
}) => {
    const entity = getEntity({ entityId })
        ?? error({ message: `Entity ${entityId} does not exist`, where: checkComponent.name });

    return entity[componentId] ? componentId : null;
};
//#endregion
