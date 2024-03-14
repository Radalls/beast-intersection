import { checkEntityId } from './entities/entity.manager';

const store = {
    playerId: '',
    tilemapId: '',
    activityId: '',
    dialogId: '',
};

export const setStore = (key: keyof typeof store, value: string) => store[key] = value;
export const getStore = (key: keyof typeof store) => store[key] && checkEntityId(store[key]);
export const clearStore = (key: keyof typeof store) => store[key] = '';
