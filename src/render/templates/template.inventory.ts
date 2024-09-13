import { createElement } from './template';
import { getElement, getSpritePath, checkElement } from './template.utils';

import { getComponent } from '@/engine/entities';
import { playerActiveTool } from '@/engine/systems/inventory';

//#region CONSTANTS
const INVENTORY_SLOT_SIZE = 64;
const INVENTORY_SLOTS_PER_ROW = 5;
const INVENTORY_TOOL_SLOT_SIZE = 64;
//#endregion

//#region TEMPLATES
export const createInventory = ({ entityId }: { entityId: string }) => {
    const inventory = getComponent({ componentId: 'Inventory', entityId });

    const inventoryElement = createElement({
        elementClass: 'inventory',
        elementId: `${entityId}-inventory`,
        entityId,
    });

    const inventoryWidth = INVENTORY_SLOTS_PER_ROW * INVENTORY_SLOT_SIZE + (INVENTORY_SLOTS_PER_ROW - 1) * 2;
    inventoryElement.style.width = `${inventoryWidth}px`;
    const inventoryHeight = (Math.ceil(inventory._maxSlots / INVENTORY_SLOTS_PER_ROW)) * INVENTORY_SLOT_SIZE;
    inventoryElement.style.height = `${inventoryHeight}px`;

    for (let i = 0; i < inventory._maxSlots; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'inventory-slot',
            elementId: `${entityId}-inventory-slot-${i}`,
            elementParent: inventoryElement,
            entityId,
        });
    }

    const entityInventoryTools = createElement({
        elementClass: 'inventory-tools',
        elementId: `${entityId}-inventory-tools`,
        entityId,
    });
    const inventoryToolsWidth = (INVENTORY_TOOL_SLOT_SIZE * (inventory._maxTools + 1)) + INVENTORY_TOOL_SLOT_SIZE;
    entityInventoryTools.style.width = `${inventoryToolsWidth}px`;
    const inventoryToolsHeight = INVENTORY_TOOL_SLOT_SIZE * 1.25;
    entityInventoryTools.style.height = `${inventoryToolsHeight}px`;
    const inventoryToolsBottom = Number.parseFloat(getComputedStyle(inventoryElement).bottom)
        + Number.parseFloat(getComputedStyle(inventoryElement).height) + 20;
    entityInventoryTools.style.bottom = `${inventoryToolsBottom}px`;

    for (let i = 0; i < inventory._maxTools + 1; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'inventory-tools-slot',
            elementId: `${entityId}-inventory-tools-slot-${i}`,
            elementParent: entityInventoryTools,
            entityId,
        });
    }

    createElement({
        elementClass: 'inventory-tool-active',
        elementId: `${entityId}-inventory-tool-active`,
        entityId,
    });
};

export const displayInventory = ({ entityId }: { entityId: string }) => {
    const inventory = getElement({ elementId: `${entityId}-inventory` });
    inventory.style.display = (inventory.style.display === 'flex') ? 'none' : 'flex';

    const inventoryTools = getElement({ elementId: `${entityId}-inventory-tools` });
    inventoryTools.style.display = (inventoryTools.style.display === 'flex') ? 'none' : 'flex';
};

export const updateInventory = ({ entityId }: { entityId: string }) => {
    const inventory = getComponent({ componentId: 'Inventory', entityId });

    clearInventory({ entityId });

    for (const slot of inventory.slots) {
        const inventorySlot = getElement({
            elementId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}`,
        });
        inventorySlot.style.backgroundImage = `url(${getSpritePath({ spriteName: slot.item.sprite._image })})`;

        const inventorySlotAmount = checkElement({
            elementId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
        })
            ? getElement({ elementId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount` })
            : createElement({
                elementClass: 'inventory-slot-amount',
                elementId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
                elementParent: inventorySlot,
                entityId,
            });

        inventorySlotAmount.innerText = `x${slot._amount.toString()}`;
    }
};

export const updateInventoryTools = ({ entityId }: { entityId: string }) => {
    const inventory = getComponent({ componentId: 'Inventory', entityId });

    clearInventoryTools({ entityId });

    const inventoryToolsFirstSlot = getElement({ elementId: `${entityId}-inventory-tools-slot-0` });
    inventoryToolsFirstSlot.style.backgroundImage = `url(${getSpritePath({ spriteName: 'item_hand' })})`;

    for (const tool of inventory.tools) {
        const inventoryToolSlotIndex = inventory.tools.indexOf(tool) + 1;
        const inventoryToolSlot
            = getElement({ elementId: `${entityId}-inventory-tools-slot-${inventoryToolSlotIndex}` });
        inventoryToolSlot.style.backgroundImage = `url(${getSpritePath({ spriteName: tool.tool.item.sprite._image })})`;
    }
};

export const activateInventoryTool = ({ entityId }: { entityId: string }) => {
    const inventory = getComponent({ componentId: 'Inventory', entityId });

    clearInventoryToolsActive({ entityId });

    const tool = playerActiveTool({ playerEntityId: entityId });

    if (tool) {
        const inventoryToolActiveSlotIndex = inventory.tools.indexOf(tool) + 1;
        const inventoryToolActiveSlot
            = getElement({ elementId: `${entityId}-inventory-tools-slot-${inventoryToolActiveSlotIndex}` });
        inventoryToolActiveSlot.style.border = 'solid 4px red';
    }
    else {
        const inventoryToolActiveSlot = getElement({ elementId: `${entityId}-inventory-tools-slot-0` });
        inventoryToolActiveSlot.style.border = 'solid 4px red';
    }

    const inventoryToolActive = getElement({ elementId: `${entityId}-inventory-tool-active` });
    inventoryToolActive.style.backgroundImage = (tool)
        ? `url(${getSpritePath({ spriteName: tool.tool.item.sprite._image })})`
        : `url(${getSpritePath({ spriteName: 'item_hand' })})`;
};

export const displayInventoryToolActive = ({ entityId }: { entityId: string }) => {
    const inventoryToolActive = getElement({ elementId: `${entityId}-inventory-tool-active` });

    inventoryToolActive.style.display = (inventoryToolActive.style.display === 'flex') ? 'none' : 'flex';
};

const clearInventory = ({ entityId }: { entityId: string }) => {
    const inventory = getElement({ elementId: `${entityId}-inventory` });

    for (let i = 0; i < inventory.children.length; i++) {
        const inventorySlot = getElement({ elementId: `${entityId}-inventory-slot-${i}` });
        inventorySlot.style.backgroundImage = '';

        if (checkElement({ elementId: `${entityId}-inventory-slot-${i}-amount` })) {
            const inventorySlotAmount = getElement({ elementId: `${entityId}-inventory-slot-${i}-amount` });
            inventorySlotAmount.innerText = '';
        }
    }
};

const clearInventoryTools = ({ entityId }: { entityId: string }) => {
    const inventoryTools = getElement({ elementId: `${entityId}-inventory-tools` });

    for (let i = 0; i < inventoryTools.children.length; i++) {
        const inventoryToolSlot = getElement({ elementId: `${entityId}-inventory-tools-slot-${i}` });
        inventoryToolSlot.style.backgroundImage = '';
    }
};

const clearInventoryToolsActive = ({ entityId }: { entityId: string }) => {
    const inventoryTools = getElement({ elementId: `${entityId}-inventory-tools` });

    for (let i = 0; i < inventoryTools.children.length; i++) {
        const inventoryToolSlot = getElement({ elementId: `${entityId}-inventory-tools-slot-${i}` });
        inventoryToolSlot.style.border = 'solid 4px rgb(0, 0, 0)';
    }
};
//#endregion
