import { getComponent } from "../../entities/entity.manager";
import { findTileByPosition } from "../tilemap/tilemap";

//#region HELPERS
const sortTriggersByPriority = ({ triggerEntityIds }: {
    triggerEntityIds: string[],
}) => {
    return triggerEntityIds.sort((a, b) => {
        const aTrigger = getComponent({ entityId: a, componentId: 'Trigger' });
        const bTrigger = getComponent({ entityId: b, componentId: 'Trigger' });
        return bTrigger._priority - aTrigger._priority;
    });
}

const findPriorityTriggerEntityId = ({ triggerEntityIds }: {
    triggerEntityIds: string[],
}) => {
    return triggerEntityIds[0];
}
//#endregion

//#region ACTIONS
export const setTrigger = ({ tilemapEntityId, entityId }: {
    tilemapEntityId: string,
    entityId: string,
}) => {
    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });
    const entityPosition = getComponent({ entityId, componentId: 'Position' });
    const entityTrigger = getComponent({ entityId, componentId: 'Trigger' });

    for (const point of entityTrigger.points) {
        const pointTile = findTileByPosition({
            tiles: tilemap.tiles,
            x: entityPosition._x + point._offsetX,
            y: entityPosition._y + point._offsetY,
        });

        if (pointTile) {
            pointTile._triggerEntityIds.push(entityId);
            if (pointTile._triggerEntityIds.length > 1) {
                pointTile._triggerEntityIds = sortTriggersByPriority({ triggerEntityIds: pointTile._triggerEntityIds });
            }
        }
    }
}

export const checkTrigger = ({ tilemapEntityId, entityId }: {
    tilemapEntityId: string,
    entityId: string,
}) => {
    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });
    const entityPosition = getComponent({ entityId, componentId: 'Position' });

    const entityTile = findTileByPosition({
        tiles: tilemap.tiles,
        x: entityPosition._x,
        y: entityPosition._y,
    });
    if (!(entityTile)) {
        throw {
            message: `Tile ${entityId} not found`,
            where: checkTrigger.name,
        }
    }

    if (entityTile._triggerEntityIds.length === 0) {
        return null;
    }

    return findPriorityTriggerEntityId({ triggerEntityIds: entityTile._triggerEntityIds });
}
//#endregion ACTIONS