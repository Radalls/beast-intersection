import { createElement } from './template';
import { getElement } from './template.utils';

import { Energy } from '@/engine/components/energy';

//#region CONSTANTS
const ENERGY_SLOT_HEIGHT = 8;
const ENERGY_SLOT_WIDHT = 16;
//#endregion

//#region TEMPLATES
export const createEnergy = ({ energy, entityId }: {
    energy: Energy,
    entityId: string,
}) => {
    const energyElement = createElement({
        elementClass: 'energy',
        elementId: `${entityId}-energy`,
        entityId,
    });

    const energyHeight = (ENERGY_SLOT_HEIGHT * energy._max) + (ENERGY_SLOT_HEIGHT * 2);
    energyElement.style.height = `${energyHeight}px`;
    const energyWidth = ENERGY_SLOT_WIDHT * 1.5;
    energyElement.style.width = `${energyWidth}px`;

    for (let i = 0; i < energy._max; i++) {
        createElement({
            elementAbsolute: false,
            elementClass: 'energy-slot',
            elementId: `${entityId}-energy-slot-${i}`,
            elementParent: energyElement,
            entityId,
        });
    }
};

export const displayEnergy = ({ entityId }: { entityId: string }) => {
    const energy = getElement({ elementId: `${entityId}-energy` });

    energy.style.display = (energy.style.display === 'flex') ? 'none' : 'flex';
};

export const updateEnergy = ({ energy, entityId }: {
    energy: Energy,
    entityId: string,
}) => {
    clearEnergy({ entityId });

    const energyElement = getElement({ elementId: `${entityId}-energy` });

    for (let i = energyElement.children.length - 1; i >= energy._max - energy._current; i--) {
        const entityEnergySlot = getElement({ elementId: `${entityId}-energy-slot-${i}` });
        entityEnergySlot.style.opacity = '1';
    }
};

const clearEnergy = ({ entityId }: { entityId: string }) => {
    const energy = getElement({ elementId: `${entityId}-energy` });

    for (let i = 0; i < energy.children.length; i++) {
        const entityEnergySlot = getElement({ elementId: `${entityId}-energy-slot-${i}` });
        entityEnergySlot.style.opacity = '0';
    }
};
//#endregion
