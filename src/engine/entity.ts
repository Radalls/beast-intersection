import { getEntity } from "./entities/entity.manager";

const gameEntities: Record<string, number> = {};

export const createGameEntity = (entityId: number, entityName: string) => {
    const entity = getEntity(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} does not exist`);
    }

    gameEntities[entityName] = entityId;
}

export const getGameEntity = (entityName: string): number => {
    const entityId = gameEntities[entityName];
    if (!(entityId)) {
        throw new Error(`Game Entity ${entityName} does not exist`);
    }

    return entityId;
}
