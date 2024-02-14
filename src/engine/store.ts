import { checkEntityId } from './entities/entity.manager';

export const store = {
    playerId: undefined as string | undefined,
    tilemapId: undefined as string | undefined,
};

export const setPlayer = (entityId: string) => store.playerId = entityId;
export const getPlayer = () => store.playerId && checkEntityId(store.playerId);

export const setTileMap = (entityId: string) => store.tilemapId = entityId;
export const getTileMap = () => store.tilemapId && checkEntityId(store.tilemapId);
