import { ActivityTypes } from "../../components/resource";
import { checkComponent, destroyEntity, getComponent } from "../../services/entity";
import { getStore } from "../../store";
import { startActivityBug } from "../../services/activity/activity.bug";
import { addItemToInventory } from "../inventory/inventory";
import { destroyTrigger } from "../trigger/trigger";

export const useResource = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    entityId = entityId || getStore('playerId');
    if (!(entityId)) {
        throw {
            message: `Entity does not exist`,
            where: useResource.name,
        }
    }

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
};

export const getResourceItem = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    entityId = entityId || getStore('playerId');
    if (!(entityId)) {
        throw {
            message: `Entity does not exist`,
            where: useResource.name,
        }
    }

    const resource = getComponent({ entityId: resourceEntityId, componentId: 'Resource' });

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });

    return resource.item;
}

export const destroyResource = ({ resourceEntityId }: {
    resourceEntityId: string,
}) => {
    const resourceTrigger = checkComponent({ entityId: resourceEntityId, componentId: 'Trigger' });
    if (resourceTrigger) {
        destroyTrigger({ entityId: resourceEntityId });
    }

    destroyEntity({ entityId: resourceEntityId });
}
