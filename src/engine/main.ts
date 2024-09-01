import { getCycle, runCheck, runCycle } from './cycle';
import { createEntityManager, createEntityPlayer, createEntityTileMap } from './services/entity';
import { setState } from './state';

export const main = () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);
    setInterval(() => {
        runCheck();
    }, getCycle('checkTime') * 1000);

    createEntityManager();

    createEntityTileMap({ tileMapName: 'map_0-0' });

    createEntityPlayer({
        positionX: 3,
        positionY: 3,
        spritePath: 'player',
    });
};
