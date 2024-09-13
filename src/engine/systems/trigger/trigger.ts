import { checkComponent, getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';
import { startDialog } from '@/engine/systems/dialog';
import { useResource } from '@/engine/systems/resource';
import { findTileByPosition } from '@/engine/systems/tilemap/tilemap.utils';

//#region HELPERS
const sortTriggersByPriority = ({ triggerEntityIds }: { triggerEntityIds: string[] }) =>
    triggerEntityIds.sort((a, b) => {
        const aTrigger = getComponent({ componentId: 'Trigger', entityId: a });
        const bTrigger = getComponent({ componentId: 'Trigger', entityId: b });
        return bTrigger._priority - aTrigger._priority;
    });

const findPriorityTriggerEntityId = ({ triggerEntityIds }: { triggerEntityIds: string[] }) => triggerEntityIds[0];
//#endregion

//#region SYSTEMS
export const setTrigger = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ componentId: 'Position', entityId });
    const entityTrigger = getComponent({ componentId: 'Trigger', entityId });

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
};

export const checkTrigger = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: checkTrigger.name });

    const entityPosition = getComponent({ componentId: 'Position', entityId });

    const entityTile = findTileByPosition({
        x: entityPosition._x,
        y: entityPosition._y,
    }) ?? error({
        message: `Tile (${entityPosition._x}-${entityPosition._y}) does not exist`,
        where: checkTrigger.name,
    });

    if (entityTile._entityTriggerIds.length === 0) {
        return null;
    }

    return findPriorityTriggerEntityId({ triggerEntityIds: entityTile._entityTriggerIds });
};

export const destroyTrigger = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ componentId: 'Position', entityId });
    const entityTrigger = getComponent({ componentId: 'Trigger', entityId });

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

export const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined ', where: onTrigger.name });

    const resource = checkComponent({ componentId: 'Resource', entityId: triggeredEntityId });
    if (resource) {
        useResource({ resourceEntityId: triggeredEntityId });
        return;
    }

    const dialog = checkComponent({ componentId: 'Dialog', entityId: triggeredEntityId });
    if (dialog) {
        startDialog({ entityId: triggeredEntityId });
        return;
    }
};
//#endregion
