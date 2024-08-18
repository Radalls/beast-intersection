import { ActivityTypes } from '../../components/resource';
import { checkComponent, destroyEntity, getComponent } from '../../entities/entity.manager';
import { startActivityBug } from '../../services/activity/activity.bug';
import { startActivityCraft } from '../../services/activity/activity.craft';
import { startActivityFish } from '../../services/activity/activity.fish';
import { error } from '../../services/error';
import { getStore } from '../../store';
import { destroyCollider } from '../collider/collider';
import { addItemToInventory } from '../inventory/inventory';
import { destroyTrigger } from '../trigger/trigger';

//#region SYSTEMS
export const useResource = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playedId is undefined', where: useResource.name });

    const resource = getComponent({ componentId: 'Resource', entityId: resourceEntityId });

    if (resource._activityType === ActivityTypes.ITEM) {
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
    else if (resource._activityType === ActivityTypes.CRAFT && resource.activityData) {
        startActivityCraft({ activityId: resourceEntityId });
    }
};

export const getResourceItem = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playedId is undefined', where: getResourceItem.name });

    const resource = getComponent({ componentId: 'Resource', entityId: resourceEntityId });

    if (!(resource.item)) {
        throw error({ message: `Resource ${resourceEntityId} does not have an item`, where: getResourceItem.name });
    }

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });
};

export const destroyResource = ({ resourceEntityId }: {
    resourceEntityId: string,
}) => {
    const resourceTrigger = checkComponent({ componentId: 'Trigger', entityId: resourceEntityId });
    if (resourceTrigger) {
        destroyTrigger({ entityId: resourceEntityId });
    }

    const resourceCollider = checkComponent({ componentId: 'Collider', entityId: resourceEntityId });
    if (resourceCollider) {
        destroyCollider({ entityId: resourceEntityId });
    }

    destroyEntity({ entityId: resourceEntityId });
};
//#endregion
