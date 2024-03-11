import { event } from "../../../render/events/event";
import { setCycle } from "../../cycle";
import { EventTypes } from "../../event";
import { setState } from "../../state";
import { getStore, clearStore, setStore } from "../../store";
import { destroyResource, getResourceItem } from "../../systems/resource/resource";
import { getComponent } from "../../entities/entity.manager";
import { error } from "../error";

//#region HELPERS
export const checkActivityId = ({ activityId }: { activityId: string | null | undefined }) => {
    if (!(activityId)) activityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: checkActivityId.name });

    return activityId;
}
//#endregion

//#region SERVICES
export const startActivity = ({ activityId }: { activityId: string }) => {
    setCycle('activityWinTickInterval', 1);
    setState('isActivityRunning', true);
    setStore('activityId', activityId);

    event({
        type: EventTypes.ACTIVITY_START,
        entityId: activityId,
    });
}

export const winActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    getResourceItem({ resourceEntityId: activityId });

    setState('isActivityWin', true);

    event({
        type: EventTypes.ACTIVITY_WIN,
        entityId: activityId,
        data: activityResource,
    });
}

export const endActivity = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityRunning', false);
    setState('isActivityWin', false);
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
//#endregion
