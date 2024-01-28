import { createEntity } from "./entities/entity.manager";
import { addInventory, addPosition, addSprite } from "./systems/component/component";

export const engine = () => {
    const playerEntityId = createEntity('Player');
    addPosition({ entityId: playerEntityId });
    addSprite({ entityId: playerEntityId, image: 'player.png' });
    addInventory({ entityId: playerEntityId, maxSlots: 20 });
};
