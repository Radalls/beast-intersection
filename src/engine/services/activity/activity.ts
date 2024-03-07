import { event } from "../../../render/event";
import { clearCycle, setCycle } from "../../cycle";
import { EventTypes } from "../../event";
import { setState } from "../../state";
import { getStore, clearStore, setStore } from "../../store";
import { destroyResource, getResourceItem } from "../../systems/resource/resource";
import { getComponent } from "../entity";

export const startActivity = ({ activityId }: { activityId: string }) => {
    setCycle('elapsedActivityTime', 0);
    setCycle('activityInterval', 3);
    setState('isActivityRunning', true);
    setStore('activityId', activityId);
}

export const winActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = activityId || getStore('activityId');
    if (!(activityId)) {
        throw {
            message: `Resource activity does not exist`,
            where: winActivity.name,
        }
    }

    const item = getResourceItem({ resourceEntityId: activityId });

    setState('isActivityWin', true);

    event({
        type: EventTypes.ACTIVITY_WIN,
        entityId: activityId,
        data: item,
    });
}

export const endActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = activityId || getStore('activityId');
    if (!(activityId)) {
        throw {
            message: `Resource activity does not exist`,
            where: endActivity.name,
        }
    }

    setState('isActivityRunning', false);
    clearCycle('elapsedActivityTime');
    clearStore('activityId');

    event({
        type: EventTypes.ACTIVITY_END,
        entityId: activityId,
    });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    if (activityResource._isTemporary) {
        destroyResource({ resourceEntityId: activityId });
    }
}