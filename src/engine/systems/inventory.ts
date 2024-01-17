import { Item } from "../components/item";
import { getComponent } from "../entities/entity.manager";

const itemNoAmount = (item: Item): boolean => item._amount <= 0;
const itemNoName = (item: Item): boolean => !(item.info?._name);

export const addItemToInventory = (entity: number, item: Item): void => {
    if (itemNoAmount(item) || itemNoName(item)) {
        return;
    }

    const inventory = getComponent(entity, 'Inventory');
    if (inventory) {
        const slotWithItem = inventory.slots.find(slotItem => slotItem && slotItem.info?._name === item.info?._name);
        if (slotWithItem) {
            if (slotWithItem._amount + item._amount <= slotWithItem._amountPerSlot) {
                slotWithItem._amount += item._amount;
            } else {
                const amountRemaining = slotWithItem._amount + item._amount - slotWithItem._amountPerSlot;
                slotWithItem._amount = slotWithItem._amountPerSlot;

                addItemToInventory(
                    entity,
                    { ...item, _amount: amountRemaining }
                );
            }
        } else {
            if (inventory.slots.length < inventory._nbSlots) {
                inventory.slots?.push(item);
            } else {
                throw new Error('Inventory full');
            }
        }
    }
}
