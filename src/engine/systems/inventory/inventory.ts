import { findItemRule } from './inventory.data';
import {
    addInventorySlot,
    addToolToInventory,
    createTool,
    findInventorySlotsWithItem,
    removeInventorySlots,
} from './inventory.utils';

import { Inventory, Item } from '@/engine/components/inventory';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region CHECKS
const invalidItemName = (itemName: string) => !(itemName) || itemName === '';
const invalidItemAmount = (itemAmount: number) => itemAmount <= 0;
const invalidItemSprite = (itemSprite: string) => !(itemSprite) || itemSprite === '';
const slotAvailable = (inventory: Inventory) => inventory.slots.length < inventory._maxSlots;

//#endregion

//#region SYSTEMS
/**
 * Adds an item to an inventory.
 * @param entityId needs to have an inventory
 * @param item     needs to have an amount and a name
 * @returns whether the item was added to the inventory
 */
export const addItemToInventory = ({ entityId, item, itemAmount }: {
    entityId?: string | null,
    item: Item,
    itemAmount: number,
}): {
    amountRemaining?: number,
    success: boolean
} => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: addItemToInventory.name });

    if (invalidItemName(item.info._name) || invalidItemAmount(itemAmount) || invalidItemSprite(item.sprite._image)) {
        error({ message: `Item ${item.info._name} is invalid`, where: addItemToInventory.name });
    }

    const inventory = getComponent({ componentId: 'Inventory', entityId });

    const itemRule = findItemRule(item.info._name)
        ?? error({ message: `Item ${item.info._name} does not exist`, where: addItemToInventory.name });

    if (itemRule.tool) {
        return addToolToInventory({ entityId, tool: createTool({ activity: itemRule.tool, item }) });
    }

    const slotsWithItem = findInventorySlotsWithItem({ inventory, itemName: item.info._name });
    if (slotsWithItem.length > 0) {
        for (const slot of slotsWithItem) {
            if (slot._amount < slot._maxAmount) {
                if (slot._amount + itemAmount <= slot._maxAmount) {
                    slot._amount += itemAmount;

                    event({
                        data: inventory,
                        entityId,
                        type: EventTypes.INVENTORY_UPDATE,
                    });

                    return { success: true };
                }

                const itemAmountRemaining = slot._amount + itemAmount - slot._maxAmount;
                slot._amount = slot._maxAmount;

                return addItemToInventory({
                    entityId,
                    item,
                    itemAmount: itemAmountRemaining,
                });
            }
        }
    }

    if (slotAvailable(inventory)) {
        if (itemAmount <= itemRule.maxAmount) {
            addInventorySlot({
                inventory,
                item,
                itemAmount,
                itemMaxAmount: itemRule.maxAmount,
            });

            event({
                data: inventory,
                entityId,
                type: EventTypes.INVENTORY_UPDATE,
            });

            return { success: true };
        }

        const itemAmountRemaining = itemAmount - itemRule.maxAmount;
        addInventorySlot({
            inventory,
            item,
            itemAmount: itemRule.maxAmount,
            itemMaxAmount: itemRule.maxAmount,
        });

        return addItemToInventory({
            entityId,
            item,
            itemAmount: itemAmountRemaining,
        });
    }

    event({
        data: inventory,
        entityId,
        type: EventTypes.INVENTORY_UPDATE,
    });

    return { amountRemaining: itemAmount, success: false };
};

/**
 * Removes an item from an inventory.
 * @param entity     needs to have an inventory
 * @param itemName   name of the item to remove
 * @param itemAmount amount of the item to remove
 * @returns whether the item was removed from the inventory
 */
export const removeItemFromInventory = ({ entityId, itemName, itemAmount }: {
    entityId?: string | null,
    itemAmount: number,
    itemName: string
}): boolean => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: removeItemFromInventory.name });

    if (invalidItemName(itemName) || invalidItemAmount(itemAmount)) {
        error({ message: `Item ${itemName} is invalid`, where: removeItemFromInventory.name });
    }

    const inventory = getComponent({ componentId: 'Inventory', entityId });
    const slotsWithItem = findInventorySlotsWithItem({ inventory, itemName });
    if (slotsWithItem.length === 0) {
        return false;
    }

    const itemAmountInInventory = slotsWithItem.reduce((acc, slot) => acc + slot._amount, 0);
    if (itemAmountInInventory < itemAmount) {
        return false;
    }

    const slotsToRemove: number[] = [];
    for (const slot of slotsWithItem) {
        if (itemAmount === 0) {
            break;
        }
        if (slot._amount <= itemAmount) {
            itemAmount -= slot._amount;
            slotsToRemove.push(inventory.slots.indexOf(slot));
        } else {
            slot._amount -= itemAmount;
            itemAmount = 0;
        }
    }

    if (itemAmount !== 0) {
        return false;
    }

    removeInventorySlots({ inventory, slotsToRemove });

    event({
        data: inventory,
        entityId,
        type: EventTypes.INVENTORY_UPDATE,
    });

    return true;
};

export const activateInventoryTool = ({ entityId }: {
    entityId?: string | null,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: activateInventoryTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId });

    if (!(inventory.tools.length)) {
        event({
            data: { audioName: 'inventory_tool_empty' },
            entityId,
            type: EventTypes.AUDIO_PLAY,
        });

        error({
            message: 'No tools in inventory',
            where: activateInventoryTool.name,
        });
    }

    const activeTool = inventory.tools.find((tool) => tool._active);
    if (activeTool) {
        const inactiveTool = (inventory.tools.indexOf(activeTool) !== inventory.tools.length - 1)
            ? inventory.tools.find((tool) => tool._active === false)
            : null;

        if (inactiveTool) {
            inactiveTool._active = true;
            activeTool._active = false;

            event({
                data: { audioName: 'inventory_tool_active' },
                entityId,
                type: EventTypes.AUDIO_PLAY,
            });
        }
        else {
            activeTool._active = false;

            event({
                data: { audioName: 'inventory_tool_empty' },
                entityId,
                type: EventTypes.AUDIO_PLAY,
            });
        }
    }
    else {
        inventory.tools[0]._active = true;

        event({
            data: { audioName: 'inventory_tool_active' },
            entityId,
            type: EventTypes.AUDIO_PLAY,
        });
    }

    event({
        data: inventory,
        entityId,
        type: EventTypes.INVENTORY_TOOL_ACTIVATE,
    });
};

export const checkInventory = ({ entityId, items }: {
    entityId?: string | null,
    items: { amount: number, name: string }[],
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: activateInventoryTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId });

    for (const item of items) {
        const slotsWithItem = findInventorySlotsWithItem({ inventory, itemName: item.name });
        if (slotsWithItem.length === 0) {
            return false;
        }
        else {
            const itemAmountInInventory = slotsWithItem.reduce((acc, slot) => acc + slot._amount, 0);
            if (itemAmountInInventory < item.amount) {
                return false;
            }
        }
    }

    return true;
};
//#endregion
