import { generateTiles, setTile } from './systems/tilemap/tilemap';
import { createEntity } from "./entities/entity.manager";
import { addInventory, addPosition, addSprite, addTileMap } from "./systems/component/component";

export const main = () => {
    const tilemapEntityId = createEntity('TileMap');
    addTileMap({ entityId: tilemapEntityId });
    generateTiles(tilemapEntityId);

    const playerEntityId = createEntity('Player');
    addSprite({ entityId: playerEntityId, height: 2, image: 'player.png' });
    addPosition({ entityId: playerEntityId });
    addInventory({ entityId: playerEntityId, maxSlots: 20 });

    setTile({ tilemapEntityId, entityId: playerEntityId });
};
