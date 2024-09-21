import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Position } from '@/engine/components/position';
import { ActivityTypes } from '@/engine/components/resource';
import { createEntity, getComponent, PLAYER_ENTITY_NAME } from '@/engine/entities';
import { run } from '@/engine/main';
import {
    addCollider,
    addDialog,
    addEnergy,
    addInventory,
    addPosition,
    addResourceFish,
    addSprite,
    addState,
    addTrigger,
} from '@/engine/services/component';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getState, setState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { loadDialogData, startDialog } from '@/engine/systems/dialog';
import { createSave, downloadSave, getProjectVersion, quitToLaunch, SaveData } from '@/engine/systems/manager';
import { endActivity, endActivityFish, useResource } from '@/engine/systems/resource';
import { setTile } from '@/engine/systems/tilemap';
import { event } from '@/render/events';

//#region CONSTANTS
export const secretName = '✌︎❒︎⬧︎➔︎☠︎♓︎❖︎☜︎❒︎⬧︎◻︎♓︎❒︎◻︎';

const secretDate = [2, 1, 0, 9];
let secretDateIndex = 0;

// eslint-disable-next-line max-len
const secretPath = ['left', 'down', 'left', 'up', 'right', 'up', 'up', 'right', 'down', 'right', 'up', 'right', 'up', 'left', 'left', 'left', 'down', 'right', 'down', 'left', 'up', 'left', 'down', 'right', 'down', 'right', 'down', 'right', 'down', 'left', 'down', 'right', 'right', 'right', 'right', 'right'];
let invertSecretPath = false;
let secretPathIndex = 0;

// eslint-disable-next-line max-len, quotes, @typescript-eslint/no-unused-vars
const normalDialog = `{ "id": 15, "value": "C'est normal, t'es vieux (*drops mic*)", "next": 19, "options": [] },`;
// eslint-disable-next-line max-len, quotes, @typescript-eslint/no-unused-vars
const secretDialog = `{ "id": 15, "value": "C'est normal, t'es vieux (*drops mic*)", "next": 1, "options": [], "nextDialog": "secret" },`;
//#endregion

//#region CHECKS
export const checkSecretSave = ({ saveName }: { saveName: string }) => saveName.includes(secretName);

export const isSecretUnlocked = () => getState('isGameSecretUnlocked');
export const isSecretPathUnlocked = () => getState('isGameSecretPathUnlocked');
export const isSecretSaveUnlocked = () => getState('isGameSecretSaveUnlocked');
export const isSecretRun = () => getState('isGameSecretSaveRunning');
export const isSecretWin = () => getState('isGameSecretSaveWin');
//#endregion

//#region HELPERS
const invertSecretPathInput = ({ secretPathInput }: { secretPathInput: string }) => {
    if (secretPathInput === 'left') {
        return 'right';
    }
    else if (secretPathInput === 'right') {
        return 'left';
    }
    else {
        return secretPathInput;
    }
};
//#endregion

//#region SERVICES
//#region INPUTS
export const checkSecretDateInput = ({ inputKey }: { inputKey: string }) => {
    if (!(getState('isGameSecretUnlocked'))) return;
    if (getState('isGameSecretPathUnlocked')) return;
    if (typeof +inputKey !== 'number') return;

    const secretDateInput = Number.parseInt(inputKey);

    if (secretDate[secretDateIndex] === secretDateInput) {
        secretDateIndex++;

        event({ data: { audioName: 'secret_correct' }, type: EventTypes.AUDIO_PLAY });
    }
    else {
        secretDateIndex = 0;
    }

    if (secretDateIndex === secretDate.length) {
        setState('isGameSecretPathUnlocked', true);

        event({ type: EventTypes.SECRET_START });
        event({ type: EventTypes.SECRET_PATH_DISPLAY });
        event({ data: { audioName: 'secret_start' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { audioName: 'secret_menu', loop: true }, type: EventTypes.AUDIO_PLAY });
        event({ data: { audioName: 'bgm_menu' }, type: EventTypes.AUDIO_STOP });
    }
};

export const checkSecretPathInput = ({ inputKey }: { inputKey: string }) => {
    if (!(getState('isGameSecretPathUnlocked'))) return;

    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: checkSecretPathInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    let secretPathInput = '';
    if (inputKey === manager.settings.keys.move._up) {
        secretPathInput = 'up';
    }
    else if (inputKey === manager.settings.keys.move._down) {
        secretPathInput = 'down';
    }
    else if (inputKey === manager.settings.keys.move._left) {
        secretPathInput = 'left';
    }
    else if (inputKey === manager.settings.keys.move._right) {
        secretPathInput = 'right';
    }

    if (secretPathInput === '') return;
    if (secretPathIndex === 0) {
        invertSecretPath = (secretPathInput === 'right');
    }

    if (invertSecretPath) {
        if (invertSecretPathInput({ secretPathInput: secretPath[secretPathIndex] }) === secretPathInput) {
            secretPathIndex++;

            event({ data: { audioName: 'secret_correct' }, type: EventTypes.AUDIO_PLAY });
        }
        else {
            secretPathIndex = 0;
        }
    }
    else {
        if (secretPath[secretPathIndex] === secretPathInput) {
            secretPathIndex++;

            event({ data: { audioName: 'secret_correct' }, type: EventTypes.AUDIO_PLAY });
        }
        else {
            secretPathIndex = 0;
        }
    }

    if (secretPathIndex === secretPath.length) {
        setState('isGameSecretSaveUnlocked', true);

        createSave();

        event({ data: { audioName: 'secret_start' }, type: EventTypes.AUDIO_PLAY });
    }
};
//#endregion

//#region MANAGER
export const createSecretSave = () => {
    if (!(isSecretSaveUnlocked())) return;

    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createSave.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEnergy: Energy = {
        _: 'Energy',
        _current: 10,
        _max: 10,
    };

    const playerInventory: Inventory = {
        _: 'Inventory',
        _maxSlots: 1,
        _maxTools: 1,
        slots: [],
        tools: [{
            _active: true,
            tool: {
                _activity: ActivityTypes.FISH,
                item: {
                    info: {
                        _name: 'FishRodSecret',
                    },
                    sprite: {
                        _image: 'secret_fishrod',
                    },
                },
            },
        }],
    };

    const playerPosition: Position = {
        _: 'Position',
        _x: 3,
        _y: 4,
    };

    const tileMapName = 'map_secret0';

    const saveData: SaveData = {
        manager,
        playerEnergy,
        playerInventory,
        playerPosition,
        tileMapName,
        version: getProjectVersion(),
    };

    downloadSave({ saveData, saveName: secretName });
};

export const launchStartSecret = () => {
    if (!(isSecretUnlocked())) return;

    event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
};

export const runSecretSave = ({ saveData }: {
    entityId: string,
    saveData: SaveData,
}) => {
    if (!(isSecretSaveUnlocked())) return;

    setState('isGameSecretSaveRunning', true);

    event({ type: EventTypes.MAIN_RUN });

    run({ saveData });

    event({ type: EventTypes.MENU_LAUNCH_DISPLAY });
    event({ type: EventTypes.SECRET_PATH_DISPLAY });
    event({ data: { audioName: 'secret_menu' }, type: EventTypes.AUDIO_STOP });
    event({ data: { audioName: 'secret_map', loop: true }, type: EventTypes.AUDIO_PLAY });
};

export const launchQuitSecret = () => {
    if (!(isSecretUnlocked())) return;

    event({ data: { audioName: 'bgm_map1' }, type: EventTypes.AUDIO_STOP });
    event({ data: { audioName: 'bgm_menu' }, type: EventTypes.AUDIO_STOP });
};

export const lockSettingsSecret = () => {
    if (!(isSecretUnlocked())) return;

    event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
};

export const displaySecretPath = () => {
    if (!(isSecretPathUnlocked())) return;

    event({ type: EventTypes.SECRET_PATH_DISPLAY });
};
//#endregion

//#region ENTITY
export const createEntityPlayerSecret = ({
    spriteHeight = 2,
    spriteWidth = 1,
    positionX = 0,
    positionY = 0,
    inventoryMaxSlots = 20,
    savedPosition,
    savedInventory,
    savedEnergy,
}: {
    energyMax?: number
    inventoryMaxSlots?: number,
    positionX?: number,
    positionY?: number,
    savedEnergy?: Energy,
    savedInventory?: Inventory,
    savedPosition?: Position,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
}) => {
    if (!(isSecretRun())) return;

    const entityId = createEntity({ entityName: PLAYER_ENTITY_NAME });

    addSprite({ entityId, height: spriteHeight, image: 'secret_player', width: spriteWidth });
    addPosition({ entityId, savedPosition, x: positionX, y: positionY });
    addInventory({ entityId, maxSlots: inventoryMaxSlots, savedInventory });
    addEnergy({ current: 100, entityId, max: 100, savedEnergy });

    setTile({ entityId });
};

export const createEntityResourceItemSecret = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    positionX,
    positionY,
    triggerPriority = 0,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
    triggerPriority?: number,
}) => {
    if (!(isSecretRun())) return;

    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: 'secret_oof', width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addTrigger({ entityId, priority: triggerPriority });

    setTile({ entityId });
};

export const createEntityResourceFishSecret = ({
    entityName,
    positionX,
    positionY,
    triggerPriority = 0,
    resourceIsTemporary = false,
    resourceActivityFishDamage,
    resourceActivityFishMaxHp,
    resourceActivityFishFrenzyDuration,
    resourceActivityFishFrenzyInterval,
    resourceActivityFishRodDamage,
    resourceActivityFishRodMaxTension,
    resoureceItemName,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    resourceActivityFishDamage: number,
    resourceActivityFishFrenzyDuration: number,
    resourceActivityFishFrenzyInterval: number,
    resourceActivityFishMaxHp: number,
    resourceActivityFishRodDamage: number,
    resourceActivityFishRodMaxTension: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
    triggerPriority?: number,
}) => {
    if (!(isSecretRun())) return;

    const entityId = createEntity({ entityName });

    addState({ entityId });
    addDialog({ entityId });
    addSprite({ entityId, height: 1, image: 'secret_boss', width: 1 });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceFish({
        entityId,
        fishDamage: resourceActivityFishDamage,
        fishMaxHp: resourceActivityFishMaxHp,
        frenzyDuration: resourceActivityFishFrenzyDuration,
        frenzyInterval: resourceActivityFishFrenzyInterval,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
        rodDamage: resourceActivityFishRodDamage,
        rodMaxTension: resourceActivityFishRodMaxTension,
    });
    addCollider({ entityId });
    addTrigger({
        entityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
        priority: triggerPriority,
    });

    setTile({ entityId });
};
//#endregion

//#region DIALOG
export const startDialogSecret = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    if (entityDialog._currentId === 'secret') {
        setState('isGameSecretUnlocked', true);

        event({ data: { audioName: 'bgm_map1' }, type: EventTypes.AUDIO_STOP });
    }
};

export const endDialogSecret = ({ entityId }: { entityId: string }) => {
    if (!(isSecretUnlocked())) return;

    quitToLaunch({});

    event({ entityId, type: EventTypes.DIALOG_END });
};

export const endDialogSecretRun = ({ entityId }: { entityId: string }) => {
    if (!(isSecretRun())) return;

    useResource({ resourceEntityId: entityId });

    event({ data: { audioName: 'secret_boss', loop: true }, type: EventTypes.AUDIO_PLAY });
    event({ data: { audioName: 'secret_map' }, type: EventTypes.AUDIO_STOP });
    event({ entityId, type: EventTypes.DIALOG_END });
};
//#endregion

//#region ACTIVITY
export const startActivityFishSecret = () => {
    if (!(isSecretRun())) return;

    event({ type: EventTypes.SECRET_BOSS_DISPLAY });
};

export const winActivityFishSecret = ({ activityId }: { activityId: string }) => {
    if (!(isSecretRun())) return;

    endActivityFish();

    setState('isActivityWin', true);
    setState('isGameSecretSaveWin', true);

    loadDialogData({ dialogId: 'victory', entityId: activityId });
    startDialog({ entityId: activityId });

    event({ type: EventTypes.SECRET_BOSS_DISPLAY });
    event({ data: { audioName: 'secret_boss' }, type: EventTypes.AUDIO_STOP });
};

export const loseActivityFishSecret = ({ activityId }: { activityId: string }) => {
    if (!(isSecretRun())) return;

    endActivityFish();
    endActivity({ activityId });

    loadDialogData({ dialogId: 'rematch', entityId: activityId });
    startDialog({ entityId: activityId });

    event({ type: EventTypes.SECRET_BOSS_DISPLAY });
    event({ data: { audioName: 'secret_boss' }, type: EventTypes.AUDIO_STOP });
    event({ data: { audioName: 'secret_map', loop: true }, type: EventTypes.AUDIO_PLAY });
};
//#endregion

export const winSecret = () => {
    if (!(isSecretWin())) return;

    setState('isGameRunning', false);
    setState('isInputCooldown', true);

    event({ type: EventTypes.SECRET_WIN_DISPLAY });
    event({ data: { audioName: 'secret_victory', loop: true }, type: EventTypes.AUDIO_PLAY });
};
//#endregion
