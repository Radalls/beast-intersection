import { Inventory } from '@/engine/components/inventory';
import {
    activateInventoryTool,
    createInventory,
    displayInventory,
    displayInventoryToolActive,
    updateInventory,
    updateInventoryTools,
} from '@/render/templates';

//#region EVENTS
export const onInventoryCreate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => createInventory({ entityId, inventory });

export const onInventoryDisplay = ({ entityId }: { entityId: string }) => displayInventory({ entityId });

export const onInventoryUpdate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => updateInventory({ entityId, inventory });

export const onInventoryToolActivate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => activateInventoryTool({ entityId, inventory });

export const onInventoryToolActiveDisplay
    = ({ entityId }: { entityId: string }) => displayInventoryToolActive({ entityId });

export const onInventoryToolsUpdate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => updateInventoryTools({ entityId, inventory });
//#endregion
