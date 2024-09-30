import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/services/event';
import { event } from '@/render/events';

//#region SYSTEMS
export const setEntityLoad = ({ entityId, value }: {
    entityId: string,
    value: boolean,
}) => {
    const state = getComponent({ componentId: 'State', entityId });

    state._load = value;

    event({ entityId, type: EventTypes.ENTITY_DISPLAY });
};

export const setEntityCooldown = ({ entityId, value }: {
    entityId: string,
    value: boolean,
}) => {
    const state = getComponent({ componentId: 'State', entityId });

    state._cooldown = value;

    event({ entityId, type: EventTypes.ENTITY_DISPLAY });
};

export const setEntityActive = ({ entityId, value, gif = false }: {
    entityId: string,
    gif?: boolean,
    value: boolean,
}) => {
    const state = getComponent({ componentId: 'State', entityId });
    state._active = value;

    const sprite = getComponent({ componentId: 'Sprite', entityId });
    sprite._image = (state._active)
        ? `${sprite._image}_active`
        : sprite._image.split('_active')[0];
    sprite._gif = gif ?? false;

    event({ entityId, type: EventTypes.ENTITY_SPRITE_UPDATE });
};
//#endregion
