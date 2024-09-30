import { removeItemFromInventory } from './inventory';
import { findItemRule, itemIsEnergy, itemIsPlace } from './inventory.data';

import { Inventory, Item, Tool } from '@/engine/components/inventory';
import { ResourceTypes } from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { createEntityResourcePlace, createEntityResourceItem } from '@/engine/services/entity';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { gainEnergy } from '@/engine/systems/energy';
import { event } from '@/render/events';

//#region CONSTANTS
export const INVENTORY_SLOTS_PER_ROW = 5;

export const INVENTORY_SLOT_OPTIONS = [
    'Jeter 1',
    'Jeter Tout',
];
export const INVENTORY_SLOT_OPTIONS_ENERGY = [
    'Utiliser',
    ...INVENTORY_SLOT_OPTIONS,
];
export const INVENTORY_SLOT_OPTIONS_PLACE = [
    'Placer',
    ...INVENTORY_SLOT_OPTIONS,
];
//#endregion

//#region CHECKS
export const invalidItemName = (itemName: string) => !(itemName) || itemName === '';
export const invalidItemAmount = (itemAmount: number) => itemAmount <= 0;
export const invalidItemSprite = (itemSprite: string) => !(itemSprite) || itemSprite === '';
export const slotAvailable = (inventory: Inventory) => inventory.slots.length < inventory._maxSlots;
export const toolSlotUnavailable = (inventory: Inventory) => inventory.tools.length >= inventory._maxTools;
//#endregion

//#region UTILS
export const findInventorySlotsWithItem = ({ inventory, itemName }: {
    inventory: Inventory,
    itemName: string,
}) => inventory.slots?.filter((slot) => slot.item.info._name === itemName);

export const findInventoryTool = ({ inventory, toolName }: {
    inventory: Inventory,
    toolName: string,
}) => inventory.tools?.find((tool) => tool.tool.item.info._name === toolName);

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
    activity: ResourceTypes
    item: Item,
}) => {
    const tool: Tool = {
        _activity: activity,
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

    event({ type: EventTypes.INVENTORY_TOOL_UPDATE });

    return { success: true };
};

export const openPlayerInventory = ({ playerEntityId, managerEntityId }: {
    managerEntityId?: string | null
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: openPlayerInventory.name });

    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openPlayerInventory.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedInventorySlot = 0;
    manager._selectedInventorySlotOption = 0;

    setState('isPlayerInventoryOpen', true);

    event({ type: EventTypes.INVENTORY_DISPLAY });
    event({ type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY });
    event({ type: EventTypes.INVENTORY_SELECT_SLOT });
    event({ data: { audioName: 'inventory_open' }, type: EventTypes.AUDIO_PLAY });
};

export const selectPlayerInventorySlot = ({ input, playerEntityId, managerEntityId }: {
    input: 'up' | 'down' | 'left' | 'right',
    managerEntityId?: string | null,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: selectPlayerInventorySlot.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: selectPlayerInventorySlot.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (input === 'up') {
        if (manager._selectedInventorySlot >= INVENTORY_SLOTS_PER_ROW) {
            manager._selectedInventorySlot -= INVENTORY_SLOTS_PER_ROW;
        }
    }
    else if (input === 'down') {
        if (manager._selectedInventorySlot + INVENTORY_SLOTS_PER_ROW <= inventory._maxSlots - 1) {
            manager._selectedInventorySlot += INVENTORY_SLOTS_PER_ROW;
        }
    }
    else if (input === 'left') {
        if (manager._selectedInventorySlot % INVENTORY_SLOTS_PER_ROW !== 0) {
            manager._selectedInventorySlot -= 1;
        }
    }
    else if (input === 'right') {
        if (
            (manager._selectedInventorySlot + 1) % INVENTORY_SLOTS_PER_ROW !== 0
            && manager._selectedInventorySlot < inventory._maxSlots - 1
        ) {
            manager._selectedInventorySlot += 1;
        }
    }

    manager._selectedInventorySlot = Math.max(0, Math.min(manager._selectedInventorySlot, inventory._maxSlots - 1));

    event({ type: EventTypes.INVENTORY_SELECT_SLOT });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
};

export const confirmPlayerInventorySlot = ({ managerEntityId, playerEntityId }: {
    managerEntityId?: string | null,
    playerEntityId?: string | null
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmPlayerInventorySlot.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });
    manager._selectedInventorySlotOption = 0;

    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmPlayerInventorySlot.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });
    const selectedSlot = inventory.slots[manager._selectedInventorySlot];
    if (!(selectedSlot?.item)) return;

    setState('isPlayerInventorySlotSelected', true);

    event({ type: EventTypes.INVENTORY_OPTION_DISPLAY });
    event({ data: { audioName: 'inventory_open' }, type: EventTypes.AUDIO_PLAY });
};

export const getPlayerInventorySelectedSlotItem = ({ managerEntityId, playerEntityId }: {
    managerEntityId?: string | null,
    playerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmPlayerInventorySlot.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmPlayerInventorySlot.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    const selectedSlot = inventory.slots[manager._selectedInventorySlot];
    if (!(selectedSlot?.item)) throw error({
        message: `Inventory slot ${manager._selectedInventorySlot} is empty`,
        where: getPlayerInventorySelectedSlotItem.name,
    });

    return selectedSlot.item;
};

export const selectPlayerInventorySlotOption = ({ offset, managerEntityId, playerEntityId }: {
    managerEntityId?: string | null,
    offset: 1 | -1,
    playerEntityId?: string | null
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: selectPlayerInventorySlotOption.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: selectPlayerInventorySlotOption.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });
    const selectedItem = inventory.slots[manager._selectedInventorySlot].item;

    let inventoryOptions = INVENTORY_SLOT_OPTIONS;
    if (itemIsEnergy({ itemName: selectedItem.info._name })) inventoryOptions = INVENTORY_SLOT_OPTIONS_ENERGY;
    else if (itemIsPlace({ itemName: selectedItem.info._name })) inventoryOptions = INVENTORY_SLOT_OPTIONS_PLACE;

    if (offset === -1) {
        if (manager._selectedInventorySlotOption === 0) {
            manager._selectedInventorySlotOption = inventoryOptions.length - 1;
        }
        else {
            manager._selectedInventorySlotOption = Math.max(0, manager._selectedInventorySlotOption - 1);
        }
    }
    else if (offset === 1) {
        if (manager._selectedInventorySlotOption === inventoryOptions.length - 1) {
            manager._selectedInventorySlotOption = 0;
        }
        else {
            manager._selectedInventorySlotOption = Math.min(
                inventoryOptions.length - 1,
                manager._selectedInventorySlotOption + 1,
            );
        }
    }

    event({ type: EventTypes.INVENTORY_OPTION_UPDATE });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
};

export const confirmPlayerInventorySlotOption = ({ managerEntityId, playerEntityId }: {
    managerEntityId?: string | null,
    playerEntityId?: string | null
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmPlayerInventorySlotOption.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmPlayerInventorySlotOption.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });
    const selectedSlot = inventory.slots[manager._selectedInventorySlot];
    const selectedItem = inventory.slots[manager._selectedInventorySlot].item;

    let inventoryOptions = INVENTORY_SLOT_OPTIONS;
    if (itemIsEnergy({ itemName: selectedItem.info._name })) inventoryOptions = INVENTORY_SLOT_OPTIONS_ENERGY;
    else if (itemIsPlace({ itemName: selectedItem.info._name })) inventoryOptions = INVENTORY_SLOT_OPTIONS_PLACE;

    if (inventoryOptions[manager._selectedInventorySlotOption] === INVENTORY_SLOT_OPTIONS_ENERGY[0]) {
        if (!(itemIsEnergy({ itemName: selectedItem.info._name }))) throw error({
            message: `Item ${selectedItem.info._name} is not an energy item`,
            where: confirmPlayerInventorySlotOption.name,
        });

        const itemRule = findItemRule({ itemName: selectedItem.info._name });

        gainEnergy({ amount: itemRule.energy ?? 1 });

        removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: 1,
            itemName: selectedItem.info._name,
        });
    }
    else if (inventoryOptions[manager._selectedInventorySlotOption] === INVENTORY_SLOT_OPTIONS_PLACE[0]) {
        if (!(itemIsPlace({ itemName: selectedItem.info._name }))) throw error({
            message: `Item ${selectedItem.info._name} is not a place item`,
            where: confirmPlayerInventorySlotOption.name,
        });

        const itemRule = findItemRule({ itemName: selectedItem.info._name });
        const playerPosition = getComponent({ componentId: 'Position', entityId: playerEntityId });

        if (itemRule.resource === ResourceTypes.ITEM) {
            createEntityResourceItem({
                entityName: itemRule.name,
                positionX: playerPosition._x,
                positionY: playerPosition._y,
                resourceItems: [{ name: itemRule.name, rate: 1 }],
                stateCooldown: false,
            });
        }
        else if (itemRule.resource === ResourceTypes.PLACE) {
            createEntityResourcePlace({
                entityName: itemRule.name,
                itemName: itemRule.name,
                positionX: playerPosition._x,
                positionY: playerPosition._y,
                spritePath: `resource_${itemRule.name.toLowerCase()}`,
                stateActive: itemRule.active,
            });
        }

        removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: 1,
            itemName: selectedItem.info._name,
        });
    }
    else if (
        inventoryOptions[manager._selectedInventorySlotOption]
        === INVENTORY_SLOT_OPTIONS[INVENTORY_SLOT_OPTIONS.length - 2]
    ) {
        removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: 1,
            itemName: selectedItem.info._name,
        });
    }
    else if (
        inventoryOptions[manager._selectedInventorySlotOption]
        === INVENTORY_SLOT_OPTIONS[INVENTORY_SLOT_OPTIONS.length - 1]
    ) {
        removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: selectedSlot._amount,
            itemName: selectedItem.info._name,
        });
    }

    setState('isPlayerInventorySlotSelected', false);

    event({ type: EventTypes.INVENTORY_OPTION_DISPLAY });
    event({ type: EventTypes.INVENTORY_UPDATE });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
};

export const closePlayerInventory = ({ playerEntityId }: { playerEntityId?: string | null }) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: closePlayerInventory.name });

    setState('isPlayerInventoryOpen', false);

    event({ type: EventTypes.INVENTORY_DISPLAY });
    event({ type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY });
    event({ data: { audioName: 'inventory_close' }, type: EventTypes.AUDIO_PLAY });
};

export const closePlayerInventorySlotOption = () => {
    setState('isPlayerInventorySlotSelected', false);

    event({ type: EventTypes.INVENTORY_OPTION_DISPLAY });
    event({ data: { audioName: 'inventory_close' }, type: EventTypes.AUDIO_PLAY });
};

export const playerActiveTool = ({ playerEntityId }: { playerEntityId?: string | null }) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerActiveTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    return inventory.tools.find((tool) => tool._active);
};

export const playerHasSameActivityTool = ({ playerEntityId, activity }: {
    activity: ResourceTypes,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerHasSameActivityTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    return inventory.tools.some((tool) => tool.tool._activity === activity);
};

export const playerHasActivityToolActive = ({ playerEntityId, activity }: {
    activity: ResourceTypes,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerHasActivityToolActive.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    return inventory.tools.some((tool) => tool._active && tool.tool._activity === activity);
};

export const playerInventoryFull = ({ playerEntityId, item }: {
    item: Item,
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerHasActivityToolActive.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    if (slotAvailable(inventory)) return false;
    else {
        const itemSlots = findInventorySlotsWithItem({ inventory, itemName: item.info._name });
        if (!(itemSlots.some(slot => slot._amount < slot._maxAmount))) return true;
        else return false;
    }
};

export const playerInventoryToolFull = ({ playerEntityId }: { playerEntityId?: string | null }) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: playerInventoryToolFull.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    return inventory.tools.length >= inventory._maxTools;
};

export const emptyPlayerInventory = ({ playerEntityId }: {
    playerEntityId?: string | null,
}) => {
    if (!(playerEntityId)) playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: emptyPlayerInventory.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    inventory.slots = [];

    event({ type: EventTypes.INVENTORY_UPDATE });
    event({ data: { audioName: 'inventory_empty' }, type: EventTypes.AUDIO_PLAY });
};
//#endregion
