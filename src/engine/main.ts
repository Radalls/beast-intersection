import { generateTiles } from './systems/tilemap/tilemap';
import { createEntity } from "./entities/entity.manager";
import { addInventory, addPosition, addSprite, addTileMap } from "./systems/component/component";

export const main = () => {
    const tilemapEntityId = createEntity('TileMap');
    addTileMap({ entityId: tilemapEntityId });
    generateTiles(tilemapEntityId);

    const playerEntityId = createEntity('Player');
    addPosition({ entityId: playerEntityId });
    addSprite({ entityId: playerEntityId, height: 2, image: 'player.png' });
    addInventory({ entityId: playerEntityId, maxSlots: 20 });
};
