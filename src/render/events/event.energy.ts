import { createEnergy, displayEnergy, updateEnergy } from '@/render/templates';

//#region EVENTS
export const onEnergyCreate = ({ entityId }: { entityId: string }) => createEnergy({ entityId });

export const onEnergyDisplay = ({ entityId }: { entityId: string }) => displayEnergy({ entityId });

export const onEnergyUpdate = ({ entityId }: { entityId: string }) => updateEnergy({ entityId });
//#endregion
