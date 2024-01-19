import { Inventory } from "../../components/inventory";
import { Item } from "../../components/item";
import { getComponent } from "../../entities/entity.manager";
import { findItemRule } from "./inventory.data";

const invalidItemName = (itemName: string): boolean => !(itemName) || itemName === '';
const invalidItemAmount = (itemAmount: number): boolean => itemAmount <= 0;
const slotAvailable = (inventory: Inventory): boolean => inventory.slots.length < inventory._maxSlots;

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

/**
 * Adds an item to an inventory.
 * @param entityId needs to have an inventory
 * @param item     needs to have an amount and a name
 * @returns whether the item was added to the inventory
 */
export const addItemToInventory = ({ entityId, item, itemAmount }: {
    entityId: number,
    item: Item,
    itemAmount: number,
}): {
    success: boolean,
    amountRemaining?: number
} => {
    if (invalidItemName(item.info._name) || invalidItemAmount(itemAmount)) {
        throw new Error(`Item ${item} is invalid`);
    }

    const itemRule = findItemRule(item.info._name);
    if (!itemRule) {
        throw new Error(`Item ${item} no data found`);
    }

    const inventory = getComponent({ entityId, componentId: 'Inventory' });
    const slotsWithItem = findSlotsWithItem({ inventory, itemName: item.info._name });
    if (slotsWithItem.length > 0) {
        for (const slot of slotsWithItem) {
            if (slot._amount < slot._maxAmount) {
                if (slot._amount + itemAmount <= slot._maxAmount) {
                    slot._amount += itemAmount;
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

    return { success: false, amountRemaining: itemAmount };
}

/**
 * Removes an item from an inventory.
 * @param entity     needs to have an inventory
 * @param itemName   name of the item to remove
 * @param itemAmount amount of the item to remove
 * @returns whether the item was removed from the inventory
 */
export const removeItemFromInventory = ({ entityId, itemName, itemAmount }: {
    entityId: number,
    itemName: string,
    itemAmount: number,
}): boolean => {
    if (invalidItemName(itemName) || invalidItemAmount(itemAmount)) {
        throw new Error(`Item ${itemName} is invalid`);
    }

    const inventory = getComponent({ entityId, componentId: 'Inventory' });
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
    return true;
}
