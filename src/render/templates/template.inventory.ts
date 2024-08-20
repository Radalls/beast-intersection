import { checkEntity, createEntity, destroyEntity, getEntity, getSpritePath } from './template';

import { Inventory } from '@/engine/components/inventory';

//#region CONSTANTS
const INVENTORY_SLOT_SIZE = 64;
const INVENTORY_SLOTS_PER_ROW = 7;
//#endregion

//#region TEMPLATES
export const createInventory = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, '_maxSlots'>,
}) => {
    const entityInventory = createEntity({
        entityId,
        htmlClass: 'inventory',
        htmlId: `${entityId}-inventory`,
    });

    const inventoryWidth = INVENTORY_SLOTS_PER_ROW * INVENTORY_SLOT_SIZE + (INVENTORY_SLOTS_PER_ROW - 1) * 2;
    entityInventory.style.width = `${inventoryWidth}px`;
    const inventoryHeight = (Math.ceil(inventory._maxSlots / INVENTORY_SLOTS_PER_ROW)) * INVENTORY_SLOT_SIZE;
    entityInventory.style.height = `${inventoryHeight}px`;

    for (let i = 0; i < inventory._maxSlots; i++) {
        createEntity({
            entityId,
            htmlAbsolute: false,
            htmlClass: 'inventory-slot',
            htmlId: `${entityId}-inventory-slot-${i}`,
            htmlParent: entityInventory,
        });
    }
};

export const displayInventory = ({ entityId }: { entityId: string }) => {
    const entityInventory = getEntity({ entityId: `${entityId}-inventory` });

    entityInventory.style.display = (entityInventory.style.display === 'flex') ? 'none' : 'flex';
};

export const updateInventory = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, 'slots'>,
}) => {
    clearInventory({ entityId });

    for (const slot of inventory.slots) {
        const entityInventorySlot = getEntity({
            entityId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}`,
        });
        entityInventorySlot.style.backgroundImage = `url(${getSpritePath(slot.item.sprite._image)})`;

        const entityInventorySlotAmount = checkEntity({
            entityId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
        })
            ? getEntity({ entityId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount` })
            : createEntity({
                entityId,
                htmlClass: 'inventory-slot-amount',
                htmlId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
                htmlParent: entityInventorySlot,
            });

        entityInventorySlotAmount.textContent = `x${slot._amount.toString()}`;
    }
};

const clearInventory = ({ entityId }: { entityId: string }) => {
    const entityInventory = getEntity({ entityId: `${entityId}-inventory` });

    for (let i = 0; i < entityInventory.children.length; i++) {
        const inventorySlotEntity = getEntity({ entityId: `${entityId}-inventory-slot-${i}` });
        inventorySlotEntity.style.backgroundImage = '';

        if (checkEntity({ entityId: `${entityId}-inventory-slot-${i}-amount` })) {
            destroyEntity({ entityId: `${entityId}-inventory-slot-${i}-amount` });
        }
    }
};
//#endregion
