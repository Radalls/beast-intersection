import { startActivityBug, startActivityCraft, startActivityFish } from './activity';

import { ActivityTypes } from '@/engine/components/resource';
import { getComponent, checkComponent, destroyEntity } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getStore } from '@/engine/services/store';
import { destroyCollider } from '@/engine/systems/collider';
import { addItemToInventory, playerInventoryFull } from '@/engine/systems/inventory';
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
        const gotItem = getResourceItem({ resourceEntityId });
        if (!(gotItem)) {
            event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
            event({ data: { message: 'Inventory is full' }, type: EventTypes.MAIN_ERROR });

            throw error({
                message: 'Player inventory is full',
                where: useResource.name,
            });
        }

        event({ data: { audioName: 'activity_pickup' }, type: EventTypes.AUDIO_PLAY });

        if (resource._isTemporary) {
            destroyResource({ resourceEntityId });
        }
    }
    else {
        if (resource._activityType === ActivityTypes.BUG && resource.activityData) {
            startActivityBug({ activityId: resourceEntityId });
        }
        else if (resource._activityType === ActivityTypes.FISH && resource.activityData) {
            startActivityFish({ activityId: resourceEntityId });
        }
        else if (resource._activityType === ActivityTypes.CRAFT && resource.activityData) {
            startActivityCraft({ activityId: resourceEntityId });
        }
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

    if (playerInventoryFull({ item: resource.item })) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });

        error({
            message: 'Player inventory is full',
            where: getResourceItem.name,
        });

        return false;
    }

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });

    return true;
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
