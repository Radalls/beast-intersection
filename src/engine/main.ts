import { generateTiles, setTile } from './systems/tilemap/tilemap';
import { createEntity } from "./entities/entity.manager";
import { addInventory, addPosition, addResource, addSprite, addTileMap, addTrigger } from "./systems/component/component";

export const main = () => {
    const tilemapEntityId = createEntity('TileMap');
    addTileMap({ entityId: tilemapEntityId });
    generateTiles(tilemapEntityId);

    const playerEntityId = createEntity('Player');
    addSprite({ entityId: playerEntityId, height: 2, image: 'player.png' });
    addPosition({ entityId: playerEntityId });
    addInventory({ entityId: playerEntityId, maxSlots: 20 });
    setTile({ tilemapEntityId, entityId: playerEntityId });

    const stickEntityId = createEntity('ResourceStick');
    addSprite({ entityId: stickEntityId, image: 'resource_stick.png' });
    addPosition({ entityId: stickEntityId, x: 3, y: 3 });
    addResource({
        entityId: stickEntityId,
        isTemporary: true,
        itemName: 'Stick',
    });
    addTrigger({ entityId: stickEntityId });
    setTile({ tilemapEntityId, entityId: stickEntityId });
};
