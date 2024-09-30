import { createElement } from './template';
import { getElement } from './template.utils';

import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';

//#region CONSTANTS
const ENERGY_SLOT_HEIGHT = 8;
const ENERGY_SLOT_WIDHT = 16;
//#endregion

//#region TEMPLATES
export const createEnergy = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: createEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId: playerEntityId });

    const energyElement = createElement({
        elementClass: 'energy',
        elementId: `${playerEntityId}-energy`,
        entityId: playerEntityId,
    });

    const energyHeight = (ENERGY_SLOT_HEIGHT * energy._max) + (ENERGY_SLOT_HEIGHT * 2);
    energyElement.style.height = `${energyHeight}px`;
    const energyWidth = ENERGY_SLOT_WIDHT * 1.5;
    energyElement.style.width = `${energyWidth}px`;

    for (let i = 0; i < energy._max; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'energy-slot',
            elementId: `${playerEntityId}-energy-slot-${i}`,
            elementParent: energyElement,
            entityId: playerEntityId,
        });
    }
};

export const displayEnergy = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: displayEnergy.name });

    const energy = getElement({ elementId: `${playerEntityId}-energy` });

    energy.style.display = (energy.style.display === 'flex') ? 'none' : 'flex';
};

export const updateEnergy = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updateEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId: playerEntityId });

    clearEnergy();

    const energyElement = getElement({ elementId: `${playerEntityId}-energy` });

    for (let i = energyElement.children.length - 1; i >= energy._max - energy._current; i--) {
        const energySlotElement = getElement({ elementId: `${playerEntityId}-energy-slot-${i}` });
        energySlotElement.style.backgroundColor = 'rgb(231, 210, 75)';
    }
};

const clearEnergy = () => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: clearEnergy.name });

    const energyElement = getElement({ elementId: `${playerEntityId}-energy` });

    for (let i = 0; i < energyElement.children.length; i++) {
        const energySlotElement = getElement({ elementId: `${playerEntityId}-energy-slot-${i}` });
        energySlotElement.style.backgroundColor = 'rgb(70, 70, 70)';
    }
};
//#endregion
