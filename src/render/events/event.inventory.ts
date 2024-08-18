import { Inventory } from '../../engine/components/inventory';
import { createInventory, displayInventory, updateInventory } from '../templates/template.inventory';

//#region EVENTS
export const onEntityInventoryCreate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => createInventory({ entityId, inventory });

export const onEntityInventoryDisplay = ({ entityId }: { entityId: string }) => displayInventory({ entityId });

export const onEntityInventoryUpdate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Inventory,
}) => updateInventory({ entityId, inventory });
//#endregion
