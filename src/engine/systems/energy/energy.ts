import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getStore } from '@/engine/services/store';
import { event } from '@/render/events';

//#region SYSTEMS
export const checkEnergy = ({ amount, entityId }: {
    amount: number,
    entityId?: string | null,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: checkEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId });

    return energy._current >= amount;
};

export const useEnergy = ({ amount, entityId }: {
    amount: number,
    entityId?: string | null,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: useEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId });

    if (energy._current >= amount) {
        energy._current -= amount;

        event({ entityId, type: EventTypes.ENERGY_UPDATE });

        return true;
    }
    else {
        return false;
    }
};

export const gainEnergy = ({ amount, entityId }: {
    amount: number,
    entityId?: string | null,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: gainEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId });

    if (energy._current < energy._max) {
        energy._current = Math.min(energy._current + amount, energy._max);

        event({ entityId, type: EventTypes.ENERGY_UPDATE });

        return true;
    }
    else {
        error({ message: `Entity ${entityId} has max energy`, where: useEnergy.name });

        return false;
    }
};

export const fillEnergy = ({ entityId }: { entityId?: string | null }) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: fillEnergy.name });

    const energy = getComponent({ componentId: 'Energy', entityId });

    energy._current = energy._max;

    event({ entityId, type: EventTypes.ENERGY_UPDATE });
};
//#endregion
