import { getComponent } from "../../services/entity";
import { error } from "../../services/error";
import { getStore } from "../../store";
import { findTileByPosition } from "../tilemap/tilemap";

//#region HELPERS
const sortTriggersByPriority = ({ triggerEntityIds }: { triggerEntityIds: string[] }) =>
    triggerEntityIds.sort((a, b) => {
        const aTrigger = getComponent({ entityId: a, componentId: 'Trigger' });
        const bTrigger = getComponent({ entityId: b, componentId: 'Trigger' });
        return bTrigger._priority - aTrigger._priority;
    });

const findPriorityTriggerEntityId = ({ triggerEntityIds }: { triggerEntityIds: string[] }) => triggerEntityIds[0];
//#endregion

//#region ACTIONS
export const setTrigger = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ entityId, componentId: 'Position' });
    const entityTrigger = getComponent({ entityId, componentId: 'Trigger' });

    for (const point of entityTrigger.points) {
        const pointTile = findTileByPosition({
            x: entityPosition._x + point._offsetX,
            y: entityPosition._y + point._offsetY,
        });

        if (pointTile) {
            pointTile._entityTriggerIds.push(entityId);
            if (pointTile._entityTriggerIds.length > 1) {
                pointTile._entityTriggerIds = sortTriggersByPriority({ triggerEntityIds: pointTile._entityTriggerIds });
            }
        }
    }
}

export const checkTrigger = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: checkTrigger.name });

    const entityPosition = getComponent({ entityId, componentId: 'Position' });

    const entityTile = findTileByPosition({
        x: entityPosition._x,
        y: entityPosition._y,
    }) ?? error({ message: `Tile (${entityPosition._x}-${entityPosition._y}) does not exist`, where: checkTrigger.name });

    if (entityTile._entityTriggerIds.length === 0) {
        return null;
    }

    return findPriorityTriggerEntityId({ triggerEntityIds: entityTile._entityTriggerIds });
}

export const destroyTrigger = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ entityId, componentId: 'Position' });
    const entityTrigger = getComponent({ entityId, componentId: 'Trigger' });

    for (const point of entityTrigger.points) {
        const pointTile = findTileByPosition({
            x: entityPosition._x + point._offsetX,
            y: entityPosition._y + point._offsetY,
        });

        if (pointTile) {
            pointTile._entityTriggerIds = pointTile._entityTriggerIds.filter((id) => id !== entityId);
        }
    }
};
//#endregion ACTIONS