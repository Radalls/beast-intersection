import { Quest } from '@/engine/systems/manager';

export type Manager = {
    _: 'Manager',
    _selectedLaunchOption: number,
    _selectedQuest: number,
    _selectedSetting: number,
    quests: Quest[],
    questsDone: Quest[],
    settings: ManagerSettings,
};

type ManagerSettings = {
    _audio: boolean,
    keys: ManagerSettingsKeys,
};

type ManagerSettingsKeys = {
    action: ManagerSettingsActionKeys,
    move: ManagerSettingsMoveKeys,
};

type ManagerSettingsActionKeys = {
    _act: string,
    _back: string,
    _inventory: string,
    _quit: string,
    _save: string,
    _tool: string,
};

type ManagerSettingsMoveKeys = {
    _down: string,
    _left: string,
    _right: string,
    _up: string,
};
