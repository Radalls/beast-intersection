import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { event } from '@/render/events';

//#region SYSTEMS
export const setEntityActive = ({ entityId, value }: { entityId: string, value: boolean }) => {
    const state = getComponent({ componentId: 'State', entityId });

    state._active = value;

    event({
        data: state,
        entityId,
        type: EventTypes.ENTITY_DISPLAY,
    });
};

export const setEntityTalking = ({ entityId, value }: { entityId: string, value: boolean }) => {
    const state = getComponent({ componentId: 'State', entityId });

    state._talk = value;
};
//#endregion
