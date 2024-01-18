import { Inventory } from "../components/inventory";
import { Item } from "../components/item";
import { getComponent } from "../entities/entity.manager";

const itemNoAmount = (item: Item): boolean => item._amount <= 0;
const itemNoName = (item: Item): boolean => !(item.info?._name);

const findItemByName = (inventory: Inventory, itemName: Item['info']['_name']): Item | undefined =>
    inventory.items.find(item => item.info?._name === itemName);

/**
 * Adds an item to an inventory.
 * @param entity needs to have an inventory
 * @param item   needs to have an amount and a name
 * @returns whether the item was added to the inventory
 */
export const addItemToInventory = (entity: number, item: Item): boolean => {
    if (itemNoAmount(item) || itemNoName(item)) {
        throw new Error(`Item ${item} is invalid`);
    }

    const inventory = getComponent(entity, 'Inventory');
    const itemInInventory = findItemByName(inventory, item.info?._name);

    if (itemInInventory) {
        if (itemInInventory._amount + item._amount <= itemInInventory._maxAmount) {
            itemInInventory._amount += item._amount;
        } else {
            const amountRemaining = itemInInventory._amount + item._amount - itemInInventory._maxAmount;
            itemInInventory._amount = itemInInventory._maxAmount;

            addItemToInventory(
                entity,
                { ...item, _amount: amountRemaining }
            );
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
export const removeItemFromInventory = (entity: number, itemName: string, itemAmount: number): boolean => {
    const inventory = getComponent(entity, 'Inventory');
    const slotWithItem = findItemByName(inventory, itemName);

    if (slotWithItem && slotWithItem._amount >= itemAmount) {
        slotWithItem._amount -= itemAmount;
        return true;
    }

    return false;
}
