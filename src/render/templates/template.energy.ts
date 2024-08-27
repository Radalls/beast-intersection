import { createEntity } from './template';
import { getEntity } from './template.utils';

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
    const entityEnergy = createEntity({
        entityId,
        htmlClass: 'energy',
        htmlId: `${entityId}-energy`,
    });

    const energyHeight = (ENERGY_SLOT_HEIGHT * energy._max) + (ENERGY_SLOT_HEIGHT * 2);
    entityEnergy.style.height = `${energyHeight}px`;
    const energyWidth = ENERGY_SLOT_WIDHT * 1.5;
    entityEnergy.style.width = `${energyWidth}px`;

    for (let i = 0; i < energy._max; i++) {
        createEntity({
            entityId,
            htmlAbsolute: false,
            htmlClass: 'energy-slot',
            htmlId: `${entityId}-energy-slot-${i}`,
            htmlParent: entityEnergy,
        });
    }
};

export const displayEnergy = ({ entityId }: { entityId: string }) => {
    const entityEnergy = getEntity({ entityId: `${entityId}-energy` });

    entityEnergy.style.display = (entityEnergy.style.display === 'flex') ? 'none' : 'flex';
};

export const updateEnergy = ({ energy, entityId }: {
    energy: Energy,
    entityId: string,
}) => {
    clearEnergy({ entityId });

    const entityEnergy = getEntity({ entityId: `${entityId}-energy` });

    for (let i = entityEnergy.children.length - 1; i >= energy._max - energy._current; i--) {
        const entityEnergySlot = getEntity({ entityId: `${entityId}-energy-slot-${i}` });
        entityEnergySlot.style.opacity = '1';
    }
};

const clearEnergy = ({ entityId }: { entityId: string }) => {
    const entityEnergy = getEntity({ entityId: `${entityId}-energy` });

    for (let i = 0; i < entityEnergy.children.length; i++) {
        const entityEnergySlot = getEntity({ entityId: `${entityId}-energy-slot-${i}` });
        entityEnergySlot.style.opacity = '0';
    }
};
//#endregion
