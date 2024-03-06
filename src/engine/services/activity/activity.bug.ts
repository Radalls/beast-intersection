import { event } from "../../../render/event";
import { ActivityBugData } from "../../components/resource";
import { setCycle } from "../../cycle";
import { getComponent } from "../entity";
import { EventInputKeys, EventTypes } from "../../event";
import { setState } from "../../state";
import { clearStore, getStore, setStore } from "../../store";
import { destroyResource, getResourceItem } from "../../systems/resource/resource";

export const startActivityBug = ({ activityId }: { activityId: string }) => {
    const activityBugData = getComponent({ entityId: activityId, componentId: 'Resource' }).activityData as ActivityBugData;

    activityBugData._hp = activityBugData._maxHp;
    activityBugData._nbErrors = 0;

    event({
        type: EventTypes.ACTIVITY_BUG_START,
        entityId: activityId,
        data: activityBugData,
    });

    setState('isActivityRunning', true);
    setState('isActivityBugRunning', true);
    setCycle('activityBugTickInterval', activityBugData._symbolInterval);
    setStore('activityId', activityId);
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

    event({
        type: EventTypes.ACTIVITY_BUG_UPDATE,
        entityId: activityId,
        data: activityBugData,
    });

    if (activityBugData._hp <= 0) {
        getResourceItem({ resourceEntityId: activityId });
        endActivityBug({ activityId });
    }
    else if (activityBugData._nbErrors >= activityBugData._maxNbErrors) {
        endActivityBug({ activityId });
    }
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

    event({
        type: EventTypes.ACTIVITY_BUG_END,
        entityId: activityId,
    });

    setState('isActivityRunning', false);
    setState('isActivityBugRunning', false);
    setState('isActivityBugCooldown', false);
    setCycle('activityBugTickInterval', 0);
    setCycle('elapsedActivityTime', 0);
    clearStore('activityId');

    if (activityResource._isTemporary) {
        destroyResource({ resourceEntityId: activityId });
    }
}
