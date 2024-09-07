import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Manager } from '@/engine/components/manager';
import { Position } from '@/engine/components/position';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region TYPES
export type SaveData = {
    manager: Manager,
    playerEnergy: Energy,
    playerInventory: Inventory,
    playerPosition: Position,
    tileMapName: string,
};
//#endregion

//#region DATA
export const createSave = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createSave.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: createSave.name });

    const playerPosition = getComponent({ componentId: 'Position', entityId: playerEntityId });
    const playerInventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });
    const playerEnergy = getComponent({ componentId: 'Energy', entityId: playerEntityId });

    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: createSave.name });

    const tileMapName = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })._name
        ?? error({ message: 'TileMap name is undefined', where: createSave.name });

    const saveData: SaveData = {
        manager,
        playerEnergy,
        playerInventory,
        playerPosition,
        tileMapName,
    };

    downloadSave({ saveData });

    event({
        data: { audioName: 'menu_settings_save' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const loadSave = (): Promise<SaveData> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!(file)) {
                throw error({
                    message: 'File is undefined',
                    where: loadSave.name,
                });
            }

            try {
                const fileContents = await file.text();
                const saveData: SaveData = JSON.parse(fileContents);
                resolve(saveData);
            } catch (error) {
                console.error('Failed to read or parse the file:', error);
                reject(error);
            }
        };

        input.click();
    });
};

const downloadSave = ({ saveData }: { saveData: SaveData }) => {
    const jsonData = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `save_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
//#endregion
