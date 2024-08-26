import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region UTILS
export const openPlayerInventory = ({ playerEntityId }: {
    playerEntityId?: string | null
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: openPlayerInventory.name });

    setState('isPlayerInventoryOpen', true);

    event({
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_DISPLAY,
    });
    event({
        data: { audioName: 'menu_inventory_open' },
        entityId: playerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const closePlayerInventory = ({ playerEntityId }: {
    playerEntityId?: string | null
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: closePlayerInventory.name });

    setState('isPlayerInventoryOpen', false);

    event({
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_DISPLAY,
    });
    event({
        data: { audioName: 'menu_inventory_close' },
        entityId: playerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};
//#endregion
