import { findItemRule } from './inventory.data';

import { Inventory, Item } from '@/engine/components/inventory';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { event } from '@/render/events';

//#region CHECKS
const invalidItemName = (itemName: string) => !(itemName) || itemName === '';
const invalidItemAmount = (itemAmount: number) => itemAmount <= 0;
const invalidItemSprite = (itemSprite: string) => !(itemSprite) || itemSprite === '';
const slotAvailable = (inventory: Inventory) => inventory.slots.length < inventory._maxSlots;
//#endregion

//#region HELPERS
const findSlotsWithItem = ({ inventory, itemName }: {
    inventory: Inventory,
    itemName: string,
}) => inventory.slots?.filter((slot) => slot.item.info._name === itemName);

const addSlot = ({ inventory, item, itemAmount, itemMaxAmount }: {
    inventory: Inventory,
    item: Item,
    itemAmount: number,
    itemMaxAmount: number,
}) => inventory.slots.push({
    _amount: itemAmount,
    _maxAmount: itemMaxAmount,
    item,
});

const removeSlots = ({ inventory, slotsToRemove }: {
    inventory: Inventory,
    slotsToRemove: number[],
}) => inventory.slots = inventory.slots.filter((_, index) => !(slotsToRemove.includes(index)));
//#endregion

//#region ACTIONS
/**
 * Adds an item to an inventory.
 * @param entityId needs to have an inventory
 * @param item     needs to have an amount and a name
 * @returns whether the item was added to the inventory
 */
export const addItemToInventory = ({ entityId, item, itemAmount }: {
    entityId: string,
    item: Item,
    itemAmount: number,
}): {
    amountRemaining?: number,
    success: boolean
} => {
    if (invalidItemName(item.info._name) || invalidItemAmount(itemAmount) || invalidItemSprite(item.sprite._image)) {
        error({ message: `Item ${item.info._name} is invalid`, where: addItemToInventory.name });
    }

    const itemRule = findItemRule(item.info._name)
        ?? error({ message: `Item ${item.info._name} does not exist`, where: addItemToInventory.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId });
    const slotsWithItem = findSlotsWithItem({ inventory, itemName: item.info._name });
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
            addSlot({
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
        addSlot({
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
    entityId: string,
    itemAmount: number,
    itemName: string
}): boolean => {
    if (invalidItemName(itemName) || invalidItemAmount(itemAmount)) {
        error({ message: `Item ${itemName} is invalid`, where: addItemToInventory.name });
    }

    const inventory = getComponent({ componentId: 'Inventory', entityId });
    const slotsWithItem = findSlotsWithItem({ inventory, itemName });
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

    removeSlots({ inventory, slotsToRemove });

    event({
        data: inventory,
        entityId,
        type: EventTypes.INVENTORY_UPDATE,
    });

    return true;
};
//#endregion
