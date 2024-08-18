import { setState } from './state';
import { getCycle, runCycle } from './cycle';
import { createEntityTileMap } from './services/entity';

export const main = async () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);

    await createEntityTileMap({ tileMapPath: 'map1' });
};
