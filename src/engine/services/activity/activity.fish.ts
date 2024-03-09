import { event } from "../../../render/events/event";
import { ActivityFishData } from "../../components/resource";
import { clearCycle, setCycle } from "../../cycle";
import { EventInputKeys, EventTypes } from "../../event";
import { setState } from "../../state";
import { getComponent } from "../entity";
import { checkActivityId, endActivity, startActivity, winActivity } from "./activity"

//#region SERVICES
export const startActivityFish = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp = activityFishData._fishMaxHp;
    activityFishData._rodTension = 0;
    activityFishData._isFrenzy = false;

    setState('isActivityFishRunning', true);
    setState('isActivityFishFrenzy', false);
    setCycle('activityFishTickIntervalFrenzyOff', activityFishData._frenzyInterval);
    setCycle('activityFishTickIntervalFrenzyOn', activityFishData._frenzyDuration);

    event({
        type: EventTypes.ACTIVITY_FISH_START,
        entityId: activityId,
        data: activityFishData,
    });
}

export const tickActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp += Math.floor(activityFishData._rodDamage / 2);
    activityFishData._rodTension -= activityFishData._fishDamage * 2;

    event({
        type: EventTypes.ACTIVITY_FISH_UPDATE,
        entityId: activityId,
        data: activityFishData,
    });
};

export const tickActivityFishFrenzy = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._isFrenzy = !(activityFishData._isFrenzy);

    setState('isActivityFishFrenzy', activityFishData._isFrenzy);

    event({
        type: EventTypes.ACTIVITY_FISH_UPDATE,
        entityId: activityId,
        data: activityFishData,
    });
};

export const playActivityFish = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    activityId = checkActivityId({ activityId });

    if (symbol !== EventInputKeys.ACT) return;

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
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
        type: EventTypes.ACTIVITY_FISH_UPDATE,
        entityId: activityId,
        data: activityFishData,
    });
}

export const endActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityFishRunning', false);
    setState('isActivityFishFrenzy', false);
    clearCycle('activityFishTickIntervalFrenzyOn');
    clearCycle('activityFishTickIntervalFrenzyOff');

    event({
        type: EventTypes.ACTIVITY_FISH_END,
        entityId: activityId,
    });
}
//#endregion
