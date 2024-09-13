import {
    activateInventoryTool,
    createInventory,
    displayInventory,
    displayInventoryToolActive,
    updateInventory,
    updateInventoryTools,
} from '@/render/templates';

//#region EVENTS
export const onInventoryCreate = ({ entityId }: { entityId: string }) => createInventory({ entityId });

export const onInventoryDisplay = ({ entityId }: { entityId: string }) => displayInventory({ entityId });

export const onInventoryUpdate = ({ entityId }: { entityId: string }) => updateInventory({ entityId });

export const onInventoryToolActivate = ({ entityId }: { entityId: string }) => activateInventoryTool({ entityId });

export const onInventoryToolActiveDisplay
    = ({ entityId }: { entityId: string }) => displayInventoryToolActive({ entityId });

export const onInventoryToolsUpdate = ({ entityId }: { entityId: string }) => updateInventoryTools({ entityId });
//#endregion
