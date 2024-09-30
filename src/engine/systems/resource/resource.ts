import { startActivityBug, startActivityCraft, startActivityFish } from './activity';
import { getResourceItem } from './resource.utils';

import { ResourceTypes } from '@/engine/components/resource';
import { getComponent, checkComponent, destroyEntity } from '@/engine/entities';
import { setCooldown } from '@/engine/services/cycle';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getStore } from '@/engine/services/store';
import { destroyCollider } from '@/engine/systems/collider';
import { setEntityActive, setEntityCooldown } from '@/engine/systems/state';
import { destroyTrigger } from '@/engine/systems/trigger';
import { event } from '@/render/events';

//#region SYSTEMS
export const useResource = ({ entityId, resourceEntityId }: {
    entityId?: string | null,
    resourceEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playedId is undefined', where: useResource.name });

    if (checkComponent({ componentId: 'State', entityId: resourceEntityId })) {
        const state = getComponent({ componentId: 'State', entityId: resourceEntityId });

        if (state._cooldown) throw error({
            message: 'Resource is on cooldown',
            where: useResource.name,
        });
    }

    const resource = getComponent({ componentId: 'Resource', entityId: resourceEntityId });

    if (resource._type === ResourceTypes.ITEM) {
        const gotItem = getResourceItem({ resourceEntityId });
        if (!(gotItem)) {
            event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
            event({ data: { message: 'Mon sac est plein' }, type: EventTypes.MAIN_ERROR });

            throw error({
                message: 'Player inventory is full',
                where: useResource.name,
            });
        }

        if (checkComponent({ componentId: 'State', entityId: resourceEntityId })) {
            const state = getComponent({ componentId: 'State', entityId: resourceEntityId });

            if (state._cooldown !== undefined) {
                setEntityCooldown({ entityId: resourceEntityId, value: true });
                setCooldown({ entityId: resourceEntityId });
            }
            else {
                destroyResource({ resourceEntityId });
            }
        }

        event({ data: { audioName: 'activity_pickup' }, type: EventTypes.AUDIO_PLAY });
    }
    else if (resource._type === ResourceTypes.PLACE) {
        const state = getComponent({ componentId: 'State', entityId: resourceEntityId });

        setEntityActive({ entityId: resourceEntityId, gif: !(state._active), value: !(state._active) });
    }
    else {
        if (resource._type === ResourceTypes.BUG && resource.activityData) {
            startActivityBug({ activityId: resourceEntityId });
        }
        else if (resource._type === ResourceTypes.FISH && resource.activityData) {
            startActivityFish({ activityId: resourceEntityId });
        }
        else if (resource._type === ResourceTypes.CRAFT && resource.activityData) {
            startActivityCraft({ activityId: resourceEntityId });
        }
    }
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
