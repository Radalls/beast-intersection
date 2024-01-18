import { Inventory } from "../components/inventory";
import { Item } from "../components/item";
import { getComponent } from "../entities/entity.manager";

const itemAmountError = (item: Item): boolean => item._amount <= 0 || item._maxAmount <= 0 || item._amount > item._maxAmount;
const itemNameError = (item: Item): boolean => !(item.info?._name) || item.info?._name === '';

const findItemByName = ({ inventory, itemName }: {
    inventory: Inventory,
    itemName: string,
}): Item | undefined =>
    inventory.items.find(item => item.info?._name === itemName);

/**
 * Adds an item to an inventory.
 * @param entityId needs to have an inventory
 * @param item   needs to have an amount and a name
 * @returns whether the item was added to the inventory
 */
export const addItemToInventory = ({ entityId, item }: {
    entityId: number,
    item: Item,
}): boolean => {
    if (itemAmountError(item) || itemNameError(item)) {
        throw new Error(`Item ${item} is invalid`);
    }

    const inventory = getComponent({ entityId, componentId: 'Inventory' });
    const itemInInventory = findItemByName({ inventory, itemName: item.info?._name });

    if (itemInInventory) {
        if (itemInInventory._amount + item._amount <= itemInInventory._maxAmount) {
            itemInInventory._amount += item._amount;
        } else {
            const amountRemaining = itemInInventory._amount + item._amount - itemInInventory._maxAmount;
            itemInInventory._amount = itemInInventory._maxAmount;

            addItemToInventory({
                entityId,
                item: { ...item, _amount: amountRemaining },
            });
        }
    } else {
        if (inventory.items.length < inventory._nbItems) {
            inventory.items?.push(item);
        } else {
            return false;
        }
    }

    return true;
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
    const inventory = getComponent({ entityId, componentId: 'Inventory' });
    const slotWithItem = findItemByName({ inventory, itemName });

    if (slotWithItem && slotWithItem._amount >= itemAmount) {
        slotWithItem._amount -= itemAmount;
        return true;
    }

    return false;
}
