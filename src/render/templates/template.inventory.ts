import { createElement, destroyElement } from './template';
import { checkElement, getElement, getSpritePath, searchElementsByClassName } from './template.utils';

import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';
import {
    getPlayerInventorySelectedSlotItem,
    INVENTORY_SLOT_OPTIONS,
    INVENTORY_SLOT_OPTIONS_ENERGY,
    INVENTORY_SLOT_OPTIONS_PLACE,
    INVENTORY_SLOTS_PER_ROW,
    itemIsEnergy,
    itemIsPlace,
    playerActiveTool,
} from '@/engine/systems/inventory';

//#region CONSTANTS
const INVENTORY_SLOT_SIZE = 64;
const INVENTORY_TOOL_SLOT_SIZE = 64;
//#endregion

//#region TEMPLATES
export const createInventory = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: createInventory.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    const inventoryElement = createElement({
        elementClass: 'inventory',
        elementId: `${playerEntityId}-inventory`,
        entityId: playerEntityId,
    });

    const inventoryWidth = INVENTORY_SLOTS_PER_ROW * INVENTORY_SLOT_SIZE + INVENTORY_SLOT_SIZE * 0.5;
    inventoryElement.style.width = `${inventoryWidth}px`;

    for (let i = 0; i < inventory._maxSlots; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'inventory-slot',
            elementId: `${playerEntityId}-inventory-slot-${i}`,
            elementParent: inventoryElement,
            entityId: playerEntityId,
        });
    }

    const entityInventoryTools = createElement({
        elementClass: 'inventory-tools',
        elementId: `${playerEntityId}-inventory-tools`,
        entityId: playerEntityId,
    });
    const inventoryToolsWidth = (INVENTORY_TOOL_SLOT_SIZE * (inventory._maxTools + 1)) + INVENTORY_TOOL_SLOT_SIZE;
    entityInventoryTools.style.width = `${inventoryToolsWidth}px`;
    const inventoryToolsHeight = INVENTORY_TOOL_SLOT_SIZE * 1.25;
    entityInventoryTools.style.height = `${inventoryToolsHeight}px`;

    for (let i = 0; i < inventory._maxTools + 1; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'inventory-tools-slot',
            elementId: `${playerEntityId}-inventory-tools-slot-${i}`,
            elementParent: entityInventoryTools,
            entityId: playerEntityId,
        });
    }

    createElement({
        elementClass: 'inventory-tool-active',
        elementId: `${playerEntityId}-inventory-tool-active`,
        entityId: playerEntityId,
    });

    createElement({
        elementClass: 'inventory-options',
        elementId: `${playerEntityId}-inventory-options`,
        entityId: playerEntityId,
    });
};

export const displayInventory = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: displayInventory.name });

    const inventory = getElement({ elementId: `${playerEntityId}-inventory` });
    inventory.style.display = (inventory.style.display === 'flex') ? 'none' : 'flex';

    const inventoryTools = getElement({ elementId: `${playerEntityId}-inventory-tools` });
    inventoryTools.style.display = (inventoryTools.style.display === 'flex') ? 'none' : 'flex';
    inventoryTools.style.bottom
        = `${parseFloat(getComputedStyle(inventory).bottom) + inventory.getBoundingClientRect().height}px`;
};

export const updateInventory = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updateInventory.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    clearInventory();

    for (const slot of inventory.slots) {
        const inventorySlot = getElement({
            elementId: `${playerEntityId}-inventory-slot-${inventory.slots.indexOf(slot)}`,
        });
        inventorySlot.style.backgroundImage = `url(${getSpritePath({ spriteName: slot.item.sprite._image })})`;

        const inventorySlotAmount = checkElement({
            elementId: `${playerEntityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
        })
            ? getElement({ elementId: `${playerEntityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount` })
            : createElement({
                elementClass: 'inventory-slot-amount',
                elementId: `${playerEntityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
                elementParent: inventorySlot,
                entityId: playerEntityId,
            });

        inventorySlotAmount.innerText = `x${slot._amount.toString()}`;
    }
};

export const displayInventoryOption = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: displayInventoryOption.name });

    const inventory = getElement({ elementId: `${playerEntityId}-inventory` });

    const inventoryOptionsElement = getElement({ elementId: `${playerEntityId}-inventory-options` });
    inventoryOptionsElement.style.display = (inventoryOptionsElement.style.display === 'flex') ? 'none' : 'flex';

    if (inventoryOptionsElement.style.display === 'flex') {
        inventoryOptionsElement.style.top = `${inventory.getBoundingClientRect().top}px`;
        inventoryOptionsElement.style.left = `${inventory.getBoundingClientRect().right}px`;

        const selectedSlotItem = getPlayerInventorySelectedSlotItem({});

        let inventoryOptions = INVENTORY_SLOT_OPTIONS;
        if (itemIsEnergy({ itemName: selectedSlotItem.info._name }))
            inventoryOptions = INVENTORY_SLOT_OPTIONS_ENERGY;
        else if (itemIsPlace({ itemName: selectedSlotItem.info._name }))
            inventoryOptions = INVENTORY_SLOT_OPTIONS_PLACE;

        for (let i = 0; i < inventoryOptions.length; i++) {
            const inventoryOptionElement = createElement({
                elementAbsolute: false,
                elementClass: 'inventory-option',
                elementId: `${playerEntityId}-inventory-option-${i}`,
                elementParent: inventoryOptionsElement,
                entityId: playerEntityId,
            });
            inventoryOptionElement.innerText = `- ${inventoryOptions[i]}`;
        }

        updateInventoryOption();
    }
    else {
        const inventoryOptionsElements = searchElementsByClassName({ className: 'inventory-option' });
        for (const el of inventoryOptionsElements) {
            destroyElement({ elementId: el.id });
        }
    }
};

export const updateInventoryOption = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerEntityId is undefined', where: updateInventory.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: displayInventoryOption.name });

    const inventoryOptionsElement = getElement({ elementId: `${playerEntityId}-inventory-options` });

    for (let i = 0; i < inventoryOptionsElement.children.length; i++) {
        const inventoryOptionElement = getElement({ elementId: `${playerEntityId}-inventory-option-${i}` });
        inventoryOptionElement.style.fontWeight = 'normal';
    }

    const selectedInventoryOption
        = getElement({ elementId: `${playerEntityId}-inventory-option-${manager._selectedInventorySlotOption}` });
    selectedInventoryOption.style.fontWeight = 'bold';
};

export const selectInventorySlot = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerEntityId is undefined', where: updateInventory.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updateInventory.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    for (let i = 0; i < inventory._maxSlots; i++) {
        const inventorySlot = getElement({ elementId: `${playerEntityId}-inventory-slot-${i}` });
        inventorySlot.style.border = 'none';
    }

    const selectedInventorySlot
        = getElement({ elementId: `${playerEntityId}-inventory-slot-${manager._selectedInventorySlot}` });
    selectedInventorySlot.style.border = 'solid 2px red';
};

export const updateInventoryTools = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updateInventoryTools.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    clearInventoryTools();

    const inventoryToolsFirstSlot = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-0` });
    inventoryToolsFirstSlot.style.backgroundImage = `url(${getSpritePath({ spriteName: 'item_hand' })})`;

    for (const tool of inventory.tools) {
        const inventoryToolSlotIndex = inventory.tools.indexOf(tool) + 1;
        const inventoryToolSlot
            = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-${inventoryToolSlotIndex}` });
        inventoryToolSlot.style.backgroundImage = `url(${getSpritePath({ spriteName: tool.tool.item.sprite._image })})`;
    }
};

export const activateInventoryTool = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: activateInventoryTool.name });

    const inventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });

    clearInventoryToolsActive();

    const tool = playerActiveTool({ playerEntityId });

    if (tool) {
        const inventoryToolActiveSlotIndex = inventory.tools.indexOf(tool) + 1;
        const inventoryToolActiveSlot
            = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-${inventoryToolActiveSlotIndex}` });
        inventoryToolActiveSlot.style.border = 'solid 4px red';
    }
    else {
        const inventoryToolActiveSlot = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-0` });
        inventoryToolActiveSlot.style.border = 'solid 4px red';
    }

    const inventoryToolActive = getElement({ elementId: `${playerEntityId}-inventory-tool-active` });
    inventoryToolActive.style.backgroundImage = (tool)
        ? `url(${getSpritePath({ spriteName: tool.tool.item.sprite._image })})`
        : `url(${getSpritePath({ spriteName: 'item_hand' })})`;
};

export const displayInventoryToolActive = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: displayInventoryToolActive.name });

    const inventoryToolActive = getElement({ elementId: `${playerEntityId}-inventory-tool-active` });

    inventoryToolActive.style.display = (inventoryToolActive.style.display === 'flex') ? 'none' : 'flex';
};

const clearInventory = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: clearInventory.name });

    const inventory = getElement({ elementId: `${playerEntityId}-inventory` });

    for (let i = 0; i < inventory.children.length; i++) {
        const inventorySlot = getElement({ elementId: `${playerEntityId}-inventory-slot-${i}` });
        inventorySlot.style.backgroundImage = '';

        if (checkElement({ elementId: `${playerEntityId}-inventory-slot-${i}-amount` })) {
            const inventorySlotAmount = getElement({ elementId: `${playerEntityId}-inventory-slot-${i}-amount` });
            inventorySlotAmount.innerText = '';
        }
    }
};

const clearInventoryTools = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: clearInventoryTools.name });

    const inventoryTools = getElement({ elementId: `${playerEntityId}-inventory-tools` });

    for (let i = 0; i < inventoryTools.children.length; i++) {
        const inventoryToolSlot = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-${i}` });
        inventoryToolSlot.style.backgroundImage = '';
    }
};

const clearInventoryToolsActive = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: clearInventoryToolsActive.name });

    const inventoryTools = getElement({ elementId: `${playerEntityId}-inventory-tools` });

    for (let i = 0; i < inventoryTools.children.length; i++) {
        const inventoryToolSlot = getElement({ elementId: `${playerEntityId}-inventory-tools-slot-${i}` });
        inventoryToolSlot.style.border = 'solid 4px rgb(0, 0, 0)';
    }
};
//#endregion
