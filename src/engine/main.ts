import { generateTiles, setTile } from './systems/tilemap/tilemap';
import { PLAYER_ENTITY_ID, TILEMAP_ENTITY_ID, createEntity } from "./services/entity";
import { addInventory, addPosition, addResource, addSprite, addTileMap, addTrigger } from "./services/component";
import { ActivityTypes } from './components/resource';
import { setState } from './state';
import { getCycle, runCycle } from './cycle';

export const main = () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);

    const tilemapEntityId = createEntity(TILEMAP_ENTITY_ID);
    addTileMap({ entityId: tilemapEntityId });
    generateTiles({});

    const playerEntityId = createEntity(PLAYER_ENTITY_ID);
    addSprite({ entityId: playerEntityId, height: 2, image: 'player.png' });
    addPosition({ entityId: playerEntityId });
    addInventory({ entityId: playerEntityId, maxSlots: 20 });
    setTile({ entityId: playerEntityId });

    const stickEntityId = createEntity('ResourceStick');
    addSprite({ entityId: stickEntityId, image: 'resource_stick.png' });
    addPosition({ entityId: stickEntityId, x: 3, y: 3 });
    addResource({
        entityId: stickEntityId,
        isTemporary: true,
        itemName: 'Stick',
    });
    addTrigger({ entityId: stickEntityId });
    setTile({ entityId: stickEntityId });

    const butterflyEntityId = createEntity('ResourceButterfly');
    addSprite({ entityId: butterflyEntityId, image: 'resource_butterfly.png' });
    addPosition({ entityId: butterflyEntityId, x: 4, y: 6 });
    addResource({
        entityId: butterflyEntityId,
        activityType: ActivityTypes.BUG,
        isTemporary: true,
        activityData: {
            _hp: 3,
            _maxHp: 3,
            _maxNbErrors: 3,
            _nbErrors: 0,
            _symbolInterval: 3,
        },
        itemName: 'Butterfly',
    });
    addTrigger({ entityId: butterflyEntityId });
    setTile({ entityId: butterflyEntityId });
};
