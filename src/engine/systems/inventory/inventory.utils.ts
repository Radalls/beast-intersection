import { Inventory, Item, Tool } from '@/engine/components/inventory';
import { ActivityTypes } from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region CHECKS
const toolSlotUnavailable = (inventory: Inventory) => inventory.tools.length >= inventory._maxTools;
//#endregion

//#region UTILS
export const findInventorySlotsWithItem = ({ inventory, itemName }: {
    inventory: Inventory,
    itemName: string,
}) => inventory.slots?.filter((slot) => slot.item.info._name === itemName);

export const addInventorySlot = ({ inventory, item, itemAmount, itemMaxAmount }: {
    inventory: Inventory,
    item: Item,
    itemAmount: number,
    itemMaxAmount: number,
}) => inventory.slots.push({
    _amount: itemAmount,
    _maxAmount: itemMaxAmount,
    item,
});

export const removeInventorySlots = ({ inventory, slotsToRemove }: {
    inventory: Inventory,
    slotsToRemove: number[],
}) => inventory.slots = inventory.slots.filter((_, index) => !(slotsToRemove.includes(index)));

export const createTool = ({ item, activity }: {
    activity: string
    item: Item,
}) => {
    const tool: Tool = {
        _activity: ActivityTypes[activity as keyof typeof ActivityTypes],
        item,
    };

    return tool;
};

export const addToolToInventory = ({ entityId, tool }: {
    entityId: string,
    tool: Tool
}) => {
    const inventory = getComponent({ componentId: 'Inventory', entityId });

    if (toolSlotUnavailable(inventory)) {
        error({
            message: 'Inventory Tools are full',
            where: addToolToInventory.name,
        });

        return { success: false };
    }

    if (playerHasSameActivityTool({ activity: tool._activity, playerEntityId: entityId })) {
        error({
            message: `Tool with activity ${tool._activity} already exists in inventory`,
            where: addToolToInventory.name,
        });

        return { success: false };
    }

    inventory.tools.push({
        _active: false,
        tool,
    });

    event({
        data: inventory,
        entityId,
        type: EventTypes.INVENTORY_TOOL_UPDATE,
    });

    return { success: true };
};

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
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY,
    });
    event({
        data: { audioName: 'inventory_open' },
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
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY,
    });
    event({
        data: { audioName: 'inventory_close' },
        entityId: playerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const playerActiveTool = ({ playerEntityId }: {
    playerEntityId?: string | null
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerActiveTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    return inventory.tools.find((tool) => tool._active);
};

export const playerHasSameActivityTool = ({ playerEntityId, activity }: {
    activity: string,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerHasSameActivityTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    activity = ActivityTypes[activity as keyof typeof ActivityTypes];

    return inventory.tools.some((tool) => tool.tool._activity === activity);
};

export const playerHasActivityToolActive = ({ playerEntityId, activity }: {
    activity: string,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerHasActivityToolActive.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    activity = ActivityTypes[activity as keyof typeof ActivityTypes];

    return inventory.tools.some((tool) => tool._active && tool.tool._activity === activity);
};
//#endregion
