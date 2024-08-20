import { checkActivityId, endActivity, startActivity, winActivity } from './activity';

import { ActivityBugData } from '@/engine/components/resource';
import { clearCycle, setCycle } from '@/engine/cycle';
import { getComponent } from '@/engine/entities';
import { EventInputMoveKeys, EventTypes } from '@/engine/event';
import { getState, setState } from '@/engine/state';
import { event } from '@/render/events';

//#region SERVICES
export const startActivityBug = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityBugData = activityResource.activityData as ActivityBugData;
    activityBugData._hp = activityBugData._maxHp;
    activityBugData._nbErrors = 0;
    activityBugData._symbol = undefined;
    activityBugData._symbolFound = undefined;

    setState('isActivityBugRunning', true);
    setCycle('activityBugTickInterval', activityBugData._symbolInterval);

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_START,
    });
};

export const tickActivityBug = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityBugData = activityResource.activityData as ActivityBugData;
    activityBugData._symbol = EventInputMoveKeys[Object.keys(EventInputMoveKeys)[
        Math.floor(Math.random() * Object.keys(EventInputMoveKeys).length)
    ] as keyof typeof EventInputMoveKeys];
    activityBugData._symbolFound = undefined;

    if (getState('isActivityBugCooldown')) {
        setState('isActivityBugCooldown', false);
    }

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_UPDATE,
    });
};

export const playActivityBug = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityBugData = activityResource.activityData as ActivityBugData;
    if (symbol === activityBugData._symbol && activityBugData._hp > 0) {
        activityBugData._hp -= 1;
        activityBugData._symbolFound = true;
        setState('isActivityBugCooldown', true);
    }
    else if (symbol !== activityBugData._symbol) {
        activityBugData._nbErrors += 1;
        activityBugData._symbolFound = false;
        setState('isActivityBugCooldown', true);
    }

    if (activityBugData._hp <= 0) {
        endActivityBug({ activityId });
        winActivity({ activityId });
        return;
    }
    else if (activityBugData._nbErrors >= activityBugData._maxNbErrors) {
        endActivityBug({ activityId });
        endActivity({ activityId });
        return;
    }

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_UPDATE,
    });
};

export const endActivityBug = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityBugRunning', false);
    setState('isActivityBugCooldown', false);
    clearCycle('activityBugTickInterval');

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_END,
    });
};
//#endregion
