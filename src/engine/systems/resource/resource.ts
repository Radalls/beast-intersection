import { destroyEntity, getComponent } from "../../entities/entity.manager";
import { addItemToInventory } from "../inventory/inventory";

export const useResource = ({ entityId, triggeredEntityId }: {
    entityId: string,
    triggeredEntityId: string,
}) => {
    const resource = getComponent({ entityId: triggeredEntityId, componentId: 'Resource' });

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });

    if (resource._isTemporary) {
        destroyEntity({ entityId: triggeredEntityId });
    }
};
