import { ActivityTypes } from '@/engine/components/resource';
import { getComponent, checkComponent, destroyEntity } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { startActivityBug, startActivityCraft, startActivityFish } from '@/engine/services/activity';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';
import { destroyCollider } from '@/engine/systems/collider';
import { addItemToInventory } from '@/engine/systems/inventory';
import { destroyTrigger } from '@/engine/systems/trigger';
import { event } from '@/render/events';

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

        event({
            data: { audioName: 'activity_pickup' },
            entityId,
            type: EventTypes.AUDIO_PLAY,
        });

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
