import { createEntity, addComponent, getComponent } from "./entities/entity.manager";
import { createGameEntity } from "./entity";

export const engine = () => {
    const playerEntity = createEntity();
    createGameEntity(playerEntity, 'Player');

    addComponent({
        entityId: playerEntity,
        component: {
            _: 'Inventory',
            _maxSlots: 10,
            slots: [],
        },
    });

    addComponent({
        entityId: playerEntity,
        component: {
            _: 'Position',
            _x: 0,
            _y: 0,
        },
    });

    const inventory = getComponent({ entityId: playerEntity, componentId: 'Inventory' });
    console.log(inventory);
};
