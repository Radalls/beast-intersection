import { Energy } from '@/engine/components/energy';
import { createEnergy, displayEnergy, updateEnergy } from '@/render/templates';

//#region EVENTS
export const onEnergyCreate = ({ energy, entityId }: {
    energy: Energy,
    entityId: string
}) => {
    createEnergy({ energy, entityId });
};

export const onEnergyDisplay = ({ entityId }: { entityId: string }) => {
    displayEnergy({ entityId });
};

export const onEnergyUpdate = ({ energy, entityId }: {
    energy: Energy,
    entityId: string
}) => {
    updateEnergy({ energy, entityId });
};
//#endregion
