import { checkComponent, destroyEntity, getComponent } from "../../entities/entity.manager";
import { getPlayer } from "../../store";
import { addItemToInventory } from "../inventory/inventory";
import { destroyTrigger } from "../trigger/trigger";

export const useResource = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    entityId = entityId || getPlayer();
    if (!(entityId)) {
        throw {
            message: `Entity does not exist`,
            where: useResource.name,
        }
    }

    const resource = getComponent({ entityId: triggeredEntityId, componentId: 'Resource' });

    addItemToInventory({
        entityId,
        item: resource.item,
        itemAmount: 1,
    });

    if (resource._isTemporary) {
        const resourceTrigger = checkComponent({ entityId: triggeredEntityId, componentId: 'Trigger' });
        if (resourceTrigger) {
            destroyTrigger({ entityId: triggeredEntityId });
        }
        destroyEntity({ entityId: triggeredEntityId });
    }
};
