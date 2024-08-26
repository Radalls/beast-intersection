export type Manager = {
    _: 'Manager',
    _selectedSetting: number,
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
};

type ManagerSettingsMoveKeys = {
    _down: string,
    _left: string,
    _right: string,
    _up: string,
};

export type AudioData = {
    audioName: string,
    loop?: boolean,
    volume?: number,
};
