import { generateTiles, setTile } from './systems/tilemap/tilemap';
import { createEntity } from "./entities/entity.manager";
import { addInventory, addPosition, addResource, addSprite, addTileMap, addTrigger } from "./systems/component/component";
import { TILEMAP_ENTITY_ID, PLAYER_ENTITY_ID } from './entities/entity';

export const main = () => {
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
};
