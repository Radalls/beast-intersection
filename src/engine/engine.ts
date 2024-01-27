import { createGameEntity } from "./entity";
import { addInventory, addPosition, addSprite } from "./systems/component/component";

export const engine = () => {
    const playerEntity = createGameEntity('Player');
    addPosition({ entityId: playerEntity });
    addSprite({ entityId: playerEntity, image: 'player.png' });
    addInventory({ entityId: playerEntity, maxSlots: 20 });
};
