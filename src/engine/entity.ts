import { emit } from "../render/render";
import { createEntity } from "./entities/entity.manager";
import { EventTypes } from "./event";

const gameEntities: Record<string, number> = {};

export const createGameEntity = (entityName: string): number => {
    const entityId = createEntity();
    gameEntities[entityName] = entityId;

    emit({
        type: EventTypes.ENTITY_CREATE,
        entityName,
    });

    return entityId;
}

export const getGameEntityByName = (entityName: string): number => {
    const entityId = gameEntities[entityName];
    if (!(entityId)) {
        throw new Error(`Game Entity ${entityName} does not exist`);
    }

    return entityId;
}

export const getGameEntityById = (entityId: number): string => {
    const entityName = Object.keys(gameEntities).find((entityName) => gameEntities[entityName] === entityId);
    if (!(entityName)) {
        throw new Error(`Game Entity ${entityId} does not exist`);
    }

    return entityName;
}
