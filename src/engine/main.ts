import { startCycle } from './cycle';
import { createEntityManager, createEntityPlayer, createEntityTileMap } from './services/entity';
import { initQuest } from './services/quest';
import { setState } from './state';
import { SaveData } from './systems/manager/manager.data';

export const main = () => {
    launch();
};

export const run = ({ saveData }: { saveData?: SaveData }) => {
    setState('isGameRunning', true);

    if (saveData?.manager) {
        createEntityManager({ savedManager: saveData.manager });
    }
    else {
        createEntityManager({});
    }

    createEntityTileMap({
        tileMapName: (saveData?.tileMapName)
            ? saveData.tileMapName
            : 'map_0-0',
    });

    createEntityPlayer({
        positionX: 3,
        positionY: 3,
        savedEnergy: saveData?.playerEnergy,
        savedInventory: saveData?.playerInventory,
        savedPosition: saveData?.playerPosition,
        spritePath: 'player',
    });

    startCycle();
    initQuest();
};

export const launch = () => {
    setState('isGameLaunching', true);

    createEntityManager({});
};
