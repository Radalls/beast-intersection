import { event } from "../../../render/event";
import { ActivityBugData } from "../../components/resource";
import { clearCycle, setCycle } from "../../cycle";
import { getComponent } from "../entity";
import { EventInputKeys, EventTypes } from "../../event";
import { setState } from "../../state";
import { getStore } from "../../store";
import { endActivity, startActivity, winActivity } from "./activity";

export const startActivityBug = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityBugData = getComponent({ entityId: activityId, componentId: 'Resource' }).activityData as ActivityBugData;
    activityBugData._hp = activityBugData._maxHp;
    activityBugData._nbErrors = 0;

    setState('isActivityBugRunning', true);
    setCycle('activityBugTickInterval', activityBugData._symbolInterval);

    event({
        type: EventTypes.ACTIVITY_BUG_START,
        entityId: activityId,
        data: activityBugData,
    });
};

export const tickActivityBug = ({ activityId }: { activityId?: string | null }) => {
    activityId = activityId || getStore('activityId');
    if (!(activityId)) {
        throw {
            message: `Resource activity does not exist`,
            where: tickActivityBug.name,
        }
    }

    const activityBugData = getComponent({ entityId: activityId, componentId: 'Resource' }).activityData as ActivityBugData;
    activityBugData._symbol = EventInputKeys[Object.keys(EventInputKeys)[
        Math.floor(Math.random() * Object.keys(EventInputKeys).length)
    ] as keyof typeof EventInputKeys];
    activityBugData._symbolFound = undefined;

    event({
        type: EventTypes.ACTIVITY_BUG_UPDATE,
        entityId: activityId,
        data: activityBugData,
    });
}

export const playActivityBug = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    activityId = activityId || getStore('activityId');
    if (!(activityId)) {
        throw {
            message: `Resource activity does not exist`,
            where: playActivityBug.name,
        }
    }

    const activityBugData = getComponent({ entityId: activityId, componentId: 'Resource' }).activityData as ActivityBugData;
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
        type: EventTypes.ACTIVITY_BUG_UPDATE,
        entityId: activityId,
        data: activityBugData,
    });
}

export const endActivityBug = ({ activityId }: { activityId?: string | null }) => {
    activityId = activityId || getStore('activityId');
    if (!(activityId)) {
        throw {
            message: `Resource activity does not exist`,
            where: endActivityBug.name,
        }
    }

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityBugData = activityResource.activityData as ActivityBugData;
    activityBugData._symbol = undefined;
    activityBugData._symbolFound = undefined;

    setState('isActivityBugRunning', false);
    setState('isActivityBugCooldown', false);
    clearCycle('activityBugTickInterval');

    event({
        type: EventTypes.ACTIVITY_BUG_END,
        entityId: activityId,
    });
}

