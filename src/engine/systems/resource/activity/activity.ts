import { getComponent } from '@/engine/entities';
import { setCycle } from '@/engine/services/cycle';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { getStore, setStore } from '@/engine/services/store';
import { checkEnergy, useEnergy } from '@/engine/systems/energy';
import { playerHasActivityToolActive } from '@/engine/systems/inventory';
import { destroyResource, getResourceItem } from '@/engine/systems/resource';
import { event } from '@/render/events';

//#region CHECKS
export const canPlay = ({ activity, entityId, strict = true }: {
    activity?: string,
    entityId: string,
    strict?: boolean,
}) => {
    return (activity && strict)
        ? playerHasActivityToolActive({ activity, playerEntityId: entityId }) && useEnergy({ amount: 1, entityId })
        : (!(activity) && strict)
            ? useEnergy({ amount: 1, entityId })
            : checkEnergy({ amount: 1, entityId });
};
//#endregion

//#region HELPERS
export const checkActivityId = ({ activityId }: { activityId: string | null | undefined }) => {
    if (!(activityId)) activityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: checkActivityId.name });

    return activityId;
};
//#endregion

//#region SERVICES
export const startActivity = ({ activityId }: { activityId: string }) => {
    setCycle('activityWinTickInterval', 2);
    setState('isActivityRunning', true);
    setStore('activityId', activityId);

    event({ type: EventTypes.ACTIVITY_START });
};

export const winActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const gotItem = getResourceItem({ resourceEntityId: activityId });
    if (!(gotItem)) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        return;
    }

    setState('isActivityWin', true);

    event({ type: EventTypes.ACTIVITY_WIN });
};

export const loseActivity = () => {
    setState('isActivityLose', true);

    event({ type: EventTypes.ACTIVITY_LOSE });
    event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
};

export const endActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityRunning', false);
    setState('isActivityWin', false);
    setState('isActivityLose', false);

    event({ type: EventTypes.ACTIVITY_END });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    if (activityResource._isTemporary) {
        destroyResource({ resourceEntityId: activityId });
    }
};
//#endregion
