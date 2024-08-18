import { getCycle, runCycle } from './cycle';
import { createEntityTileMap } from './services/entity';
import { setState } from './state';

export const main = async () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);

    await createEntityTileMap({ tileMapPath: 'map1' });
};
