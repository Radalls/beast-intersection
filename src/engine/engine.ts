import { createEntity, addComponent, getComponent } from "./entities/entity.manager";
import { addItemToInventory } from "./systems/inventory";

export const engine = () => {
    const playerEntity = createEntity();

    addComponent(
        playerEntity,
        {
            _: 'Info',
            _description: 'Player',
            _name: 'Player',
        },
    );

    addComponent(
        playerEntity,
        {
            _: 'Inventory',
            _nbSlots: 3,
            slots: [],
        },
    );

    console.log('before')
    console.dir(getComponent(playerEntity, 'Inventory'), { depth: null });

    try {
        addItemToInventory(
            playerEntity,
            {
                _: 'Item',
                _amount: 1,
                _amountPerSlot: 5,
                info: {
                    _: 'Info',
                    _name: 'Leaf',
                },
            },
        );
    } catch (e) {
        console.error(e);
    }

    console.log('after')
    console.dir(getComponent(playerEntity, 'Inventory'), { depth: null });
};
