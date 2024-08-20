import { setCycle } from '@/engine/cycle';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState } from '@/engine/state';
import { clearStore, getStore, setStore } from '@/engine/store';
import { destroyResource, getResourceItem } from '@/engine/systems/resource';
import { event } from '@/render/events';

//#region HELPERS
export const checkActivityId = ({ activityId }: { activityId: string | null | undefined }) => {
    if (!(activityId)) activityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: checkActivityId.name });

    return activityId;
};
//#endregion

//#region SERVICES
export const startActivity = ({ activityId }: { activityId: string }) => {
    setCycle('activityWinTickInterval', 1);
    setState('isActivityRunning', true);
    setStore('activityId', activityId);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_START,
    });
};

export const winActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    getResourceItem({ resourceEntityId: activityId });

    setState('isActivityWin', true);

    event({
        data: activityResource,
        entityId: activityId,
        type: EventTypes.ACTIVITY_WIN,
    });
};

export const endActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityRunning', false);
    setState('isActivityWin', false);
    clearStore('activityId');

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_END,
    });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    if (activityResource._isTemporary) {
        destroyResource({ resourceEntityId: activityId });
    }
};
//#endregion
