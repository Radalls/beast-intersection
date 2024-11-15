import { startCycle } from '@/engine/services/cycle';
import { createEntityManager, createEntityPlayer, createEntityTileMap } from '@/engine/services/entity';
import { EventTypes } from '@/engine/services/event';
import { initState, setState } from '@/engine/services/state';
import { initQuest, SaveData } from '@/engine/systems/manager';
import { event } from '@/render/events';

const playerInit = {
    initMap: 'map_plains',
    initPositionX: 58,
    initPositionY: 31,
};

export const main = () => {
    launch();
};

export const run = ({ saveData }: { saveData?: SaveData }) => {
    setState('isGameLoading', true);
    event({ type: EventTypes.MAIN_LOADING_ON });

    if (saveData?.manager) {
        createEntityManager({ savedManager: saveData.manager });
    }
    else {
        createEntityManager({});
    }

    createEntityTileMap({
        tileMapName: (saveData?.tileMapName)
            ? saveData.tileMapName
            : playerInit.initMap,
    });

    createEntityPlayer({
        positionX: (saveData?.playerPosition)
            ? undefined
            : playerInit.initPositionX,
        positionY: (saveData?.playerPosition)
            ? undefined
            : playerInit.initPositionY,
        savedEnergy: saveData?.playerEnergy,
        savedInventory: saveData?.playerInventory,
        savedPosition: saveData?.playerPosition,
        spritePath: 'player_player1_down',
    });

    startCycle();
    initState({});
    initQuest({});

    setState('isGameRunning', true);
    setState('isGameLoading', false);
    event({ type: EventTypes.MAIN_LOADING_OFF });
};

export const launch = () => {
    setState('isGameLaunching', true);

    createEntityManager({});
    initState({});
};
