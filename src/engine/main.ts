import { startCycle } from '@/engine/services/cycle';
import { createEntityManager, createEntityPlayer, createEntityTileMap } from '@/engine/services/entity';
import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { initQuest, SaveData } from '@/engine/systems/manager';
import { event } from '@/render/events';

export const main = () => {
    launch();
};

export const run = ({ saveData }: { saveData?: SaveData }) => {
    setState('isGameLoading', true);
    event({ type: EventTypes.MAIN_LOADING_ON });

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
        positionX: (saveData?.playerPosition)
            ? undefined
            : 3,
        positionY: (saveData?.playerPosition)
            ? undefined
            : 3,
        savedEnergy: saveData?.playerEnergy,
        savedInventory: saveData?.playerInventory,
        savedPosition: saveData?.playerPosition,
        spritePath: 'player_player1',
    });

    startCycle();
    initQuest({});

    setState('isGameLoading', false);
    event({ type: EventTypes.MAIN_LOADING_OFF });
};

export const launch = () => {
    setState('isGameLaunching', true);

    createEntityManager({});
};
