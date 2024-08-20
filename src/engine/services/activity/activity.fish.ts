import { checkActivityId, endActivity, startActivity, winActivity } from './activity';

import { ActivityFishData } from '@/engine/components/resource';
import { clearCycle, setCycle } from '@/engine/cycle';
import { getComponent } from '@/engine/entities/entity.manager';
import { EventInputActionKeys, EventTypes } from '@/engine/event';
import { setState } from '@/engine/state';
import { event } from '@/render/events';

//#region SERVICES
export const startActivityFish = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp = activityFishData._fishMaxHp;
    activityFishData._rodTension = 0;
    activityFishData._isFrenzy = false;

    setState('isActivityFishRunning', true);
    setState('isActivityFishFrenzy', false);
    setCycle('activityFishTickIntervalFrenzyOff', activityFishData._frenzyInterval);
    setCycle('activityFishTickIntervalFrenzyOn', activityFishData._frenzyDuration);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_START,
    });
};

export const tickActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp += Math.floor(activityFishData._rodDamage / 2);
    activityFishData._fishHp = Math.min(activityFishData._fishHp, activityFishData._fishMaxHp);
    activityFishData._rodTension -= activityFishData._fishDamage * 2;
    activityFishData._rodTension = Math.max(activityFishData._rodTension, 0);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });
};

export const tickActivityFishFrenzy = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._isFrenzy = !(activityFishData._isFrenzy);

    setState('isActivityFishFrenzy', activityFishData._isFrenzy);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });
};

export const playActivityFish = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    activityId = checkActivityId({ activityId });

    if (symbol !== EventInputActionKeys.ACT) return;

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    if (activityFishData._isFrenzy) {
        activityFishData._rodTension += activityFishData._fishDamage * 3;
        activityFishData._fishHp -= Math.floor(activityFishData._rodDamage / 2);
    }
    else {
        activityFishData._rodTension += activityFishData._fishDamage;
        activityFishData._fishHp -= activityFishData._rodDamage;
    }

    if (activityFishData._fishHp <= 0) {
        endActivityFish({ activityId });
        winActivity({ activityId });
        return;
    }
    else if (activityFishData._rodTension > activityFishData._rodMaxTension) {
        endActivityFish({ activityId });
        endActivity({ activityId });
        return;
    }

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });
};

export const endActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityFishRunning', false);
    setState('isActivityFishFrenzy', false);
    clearCycle('activityFishTickIntervalFrenzyOn');
    clearCycle('activityFishTickIntervalFrenzyOff');

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_END,
    });
};
//#endregion
