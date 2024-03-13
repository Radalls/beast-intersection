import { ActivityTypes } from "../../components/resource";
import { checkComponent, destroyEntity, getComponent } from "../../entities/entity.manager";
import { getStore } from "../../store";
import { startActivityBug } from "../../services/activity/activity.bug";
import { addItemToInventory } from "../inventory/inventory";
import { destroyTrigger } from "../trigger/trigger";
import { destroyCollider } from "../collider/collider";
import { startActivityFish } from "../../services/activity/activity.fish";
import { error } from "../../services/error";

//#region SYSTEMS
export const useResource = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playedId is undefined', where: useResource.name });

    const resource = getComponent({ entityId: resourceEntityId, componentId: 'Resource' });

    if (resource._activityType === ActivityTypes.PICKUP) {
        getResourceItem({ resourceEntityId });

        if (resource._isTemporary) {
            destroyResource({ resourceEntityId });
        }
    }
    else if (resource._activityType === ActivityTypes.BUG && resource.activityData) {
        startActivityBug({ activityId: resourceEntityId });
    }
    else if (resource._activityType === ActivityTypes.FISH && resource.activityData) {
        startActivityFish({ activityId: resourceEntityId });
    }
};

export const getResourceItem = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playedId is undefined', where: getResourceItem.name });

    const resource = getComponent({ entityId: resourceEntityId, componentId: 'Resource' });

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });
}

export const destroyResource = ({ resourceEntityId }: {
    resourceEntityId: string,
}) => {
    const resourceTrigger = checkComponent({ entityId: resourceEntityId, componentId: 'Trigger' });
    if (resourceTrigger) {
        destroyTrigger({ entityId: resourceEntityId });
    }

    const resourceCollider = checkComponent({ entityId: resourceEntityId, componentId: 'Collider' });
    if (resourceCollider) {
        destroyCollider({ entityId: resourceEntityId });
    }

    destroyEntity({ entityId: resourceEntityId });
}
//#endregion
