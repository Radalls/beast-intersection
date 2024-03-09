import { generateTiles, setTile } from './systems/tilemap/tilemap';
import { PLAYER_ENTITY_ID, TILEMAP_ENTITY_ID, createEntity } from "./services/entity";
import { addCollider, addInventory, addPosition, addResourceBug, addResourceFish, addResourcePickUp, addSprite, addTileMap, addTrigger } from "./services/component";
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

    const stickEntityId = createEntity('ResourceWood1');
    addSprite({ entityId: stickEntityId, image: 'resource_wood1.png' });
    addPosition({ entityId: stickEntityId, x: 3, y: 3 });
    addResourcePickUp({
        entityId: stickEntityId,
        isTemporary: true,
        itemName: 'Wood1',
    });
    addTrigger({ entityId: stickEntityId });
    setTile({ entityId: stickEntityId });

    const butterflyEntityId = createEntity('ResourceBug1');
    addSprite({ entityId: butterflyEntityId, image: 'resource_bug1.png' });
    addPosition({ entityId: butterflyEntityId, x: 4, y: 6 });
    addResourceBug({
        entityId: butterflyEntityId,
        isTemporary: true,
        maxHp: 3,
        maxNbErrors: 3,
        symbolInterval: 2,
        itemName: 'Bug1',
    });
    addTrigger({ entityId: butterflyEntityId });
    setTile({ entityId: butterflyEntityId });

    const fishEntityId = createEntity('ResourceFish1');
    addSprite({ entityId: fishEntityId, image: 'resource_fish1.png' });
    addPosition({ entityId: fishEntityId, x: 8, y: 2 });
    addResourceFish({
        entityId: fishEntityId,
        isTemporary: true,
        fishDamage: 3,
        fishMaxHp: 100,
        frenzyDuration: 3,
        frenzyInterval: 9,
        rodDamage: 2,
        rodMaxTension: 100,
        itemName: 'Fish1',
    });
    addCollider({ entityId: fishEntityId });
    addTrigger({
        entityId: fishEntityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });
    setTile({ entityId: fishEntityId });
};
