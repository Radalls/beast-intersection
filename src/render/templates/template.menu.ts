import { createElement } from './template';
import {
    getElement,
    searchElementsByClassName,
    searchElementsById,
} from './template.utils';

import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';
import { getProjectVersion, SETTINGS, SETTINGS_KEYS_PATHS } from '@/engine/systems/manager';

//#region HELPERS
const getSettingId = ({ settingName }: { settingName: string }) => {
    return settingName.charAt(0).toUpperCase() + settingName.slice(1);
};

const getSettingName = ({ settingId }: { settingId: string }) => {
    return settingId.charAt(0).toLowerCase() + settingId.slice(1);
};
//#endregion

//#region TEMPLATES
//#region LAUNCH MENU
export const createLaunchMenu = () => {
    const launch = createElement({
        elementClass: 'launch',
        elementId: 'LaunchMenu',
    });

    const launchTitle = createElement({
        elementAbsolute: false,
        elementClass: 'launch-title',
        elementId: 'LaunchMenuTitle',
        elementParent: launch,
    });
    launchTitle.innerText = 'BEAST INTERSECTION';

    /* Options */
    const launchStart = createElement({
        elementAbsolute: false,
        elementClass: 'launch-option',
        elementId: 'LaunchMenuStart',
        elementParent: launch,
    });
    launchStart.innerText = 'START';

    const launchLoad = createElement({
        elementAbsolute: false,
        elementClass: 'launch-option',
        elementId: 'LaunchMenuLoad',
        elementParent: launch,
    });
    launchLoad.innerText = 'LOAD';

    const launchSettings = createElement({
        elementAbsolute: false,
        elementClass: 'launch-option',
        elementId: 'LaunchMenuSettings',
        elementParent: launch,
    });
    launchSettings.innerText = 'SETTINGS';

    /* Version */
    const launchVersion = createElement({
        elementClass: 'launch-version',
        elementId: 'LaunchMenuVersion',
    });
    launchVersion.innerText = `v${getProjectVersion()}`;
};

export const displayLaunchMenu = () => {
    const launch = getElement({ elementId: 'LaunchMenu' });
    launch.style.display = (launch.style.display === 'flex') ? 'none' : 'flex';

    const launchVersion = getElement({ elementId: 'LaunchMenuVersion' });
    launchVersion.style.display = (launchVersion.style.display === 'flex') ? 'none' : 'flex';
};

export const updateLaunchMenu = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: updateLaunchMenu.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const launchOptions = searchElementsByClassName({ className: 'launch-option' });
    for (const launchOption of launchOptions) {
        launchOption.style.border = '5px solid rgb(180, 180, 180)';
    }

    launchOptions[manager._selectedLaunchOption].style.border = '5px solid rgb(255, 0, 0)';
};
//#endregion

//#region SETTINGS MENU
export const createSettingsMenu = () => {
    const settings = createElement({
        elementClass: 'settings',
        elementId: 'SettingsMenu',
    });

    const edit = createElement({
        elementClass: 'settings-edit',
        elementId: 'SettingsMenuEdit',
    });
    edit.innerText = 'ENTER A NEW KEY';

    /* System */
    const systemSettings = createElement({
        elementClass: 'settings-system',
        elementId: 'SettingsMenuSystem',
    });

    /* Back */
    const backSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuBackSetting',
        elementParent: systemSettings,
    });

    const backSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuBackSettingIcon',
        elementParent: backSetting,
    });
    backSettingIcon.innerText = '❌';

    const backSettingValue = createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuBackSettingValue',
        elementParent: backSetting,
    });
    backSettingValue.innerText = 'ESC';

    /* Quit */
    const quitSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuQuitSetting',
        elementParent: systemSettings,
    });

    const quitSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuQuitSettingIcon',
        elementParent: quitSetting,
    });
    quitSettingIcon.innerText = '🏠';

    const quitSettingValue = createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuQuitSettingValue',
        elementParent: quitSetting,
    });
    quitSettingValue.innerText = 'SHIFT';

    /* Save */
    const saveSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuSaveSetting',
        elementParent: systemSettings,
    });

    const saveSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuSaveSettingIcon',
        elementParent: saveSetting,
    });
    saveSettingIcon.innerText = '💾';

    const saveSettingValue = createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuSaveSettingValue',
        elementParent: saveSetting,
    });
    saveSettingValue.innerText = 'CTRL';

    /* General */
    const generalSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementId: 'SettingsMenuGeneral',
        elementParent: settings,
    });
    generalSettings.innerText = 'GENERAL';

    /* Audio */
    const audioContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuAudioContainer',
        elementParent: settings,
    });

    const audioLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuAudioLabel',
        elementParent: audioContainer,
    });
    audioLabel.innerText = 'AUDIO: ';

    const audioSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuAudioSetting',
        elementParent: audioContainer,
    });

    const audioSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuAudioSettingIcon',
        elementParent: audioSetting,
    });
    audioSettingIcon.innerText = '🎵';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuAudioSettingValue',
        elementParent: audioSetting,
    });

    /* Keybinds */
    const keybindsSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementId: 'SettingsMenuKeybinds',
        elementParent: settings,
    });
    keybindsSettings.innerText = 'KEYBINDS';

    /* Move UP */
    const moveUpContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveUpContainer',
        elementParent: settings,
    });

    const moveUpLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveUpLabel',
        elementParent: moveUpContainer,
    });
    moveUpLabel.innerText = 'UP: ';

    const moveUpSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveUpSetting',
        elementParent: moveUpContainer,
    });

    const moveUpSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveUpSettingIcon',
        elementParent: moveUpSetting,
    });
    moveUpSettingIcon.innerText = '🡅';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveUpSettingValue',
        elementParent: moveUpSetting,
    });

    /* Move DOWN */
    const moveDownContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveDownContainer',
        elementParent: settings,
    });

    const moveDownLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveDownLabel',
        elementParent: moveDownContainer,
    });
    moveDownLabel.innerText = 'DOWN: ';

    const moveDownSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveDownSetting',
        elementParent: moveDownContainer,
    });

    const moveDownSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveDownSettingIcon',
        elementParent: moveDownSetting,
    });
    moveDownSettingIcon.innerText = '🡇';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveDownSettingValue',
        elementParent: moveDownSetting,
    });

    /* Move LEFT */
    const moveLeftContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveLeftContainer',
        elementParent: settings,
    });

    const moveLeftLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveLeftLabel',
        elementParent: moveLeftContainer,
    });
    moveLeftLabel.innerText = 'LEFT: ';

    const moveLeftSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveLeftSetting',
        elementParent: moveLeftContainer,
    });

    const moveLeftSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveLeftSettingIcon',
        elementParent: moveLeftSetting,
    });
    moveLeftSettingIcon.innerText = '🡄';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveLeftSettingValue',
        elementParent: moveLeftSetting,
    });

    /* Move RIGHT */
    const moveRightContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveRightContainer',
        elementParent: settings,
    });

    const moveRightLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveRightLabel',
        elementParent: moveRightContainer,
    });
    moveRightLabel.innerText = 'RIGHT: ';

    const moveRightSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveRightSetting',
        elementParent: moveRightContainer,
    });

    const moveRightSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveRightSettingIcon',
        elementParent: moveRightSetting,
    });
    moveRightSettingIcon.innerText = '🡆';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveRightSettingValue',
        elementParent: moveRightSetting,
    });

    /* Action ACT */
    const actContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionActContainer',
        elementParent: settings,
    });

    const actLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionActLabel',
        elementParent: actContainer,
    });
    actLabel.innerText = 'ACT/SELECT: ';

    const actSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionActSetting',
        elementParent: actContainer,
    });

    const actSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionActSettingIcon',
        elementParent: actSetting,
    });
    actSettingIcon.innerText = '🖐';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionActSettingValue',
        elementParent: actSetting,
    });

    /* Action INVENTORY */
    const inventoryContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionInventoryContainer',
        elementParent: settings,
    });

    const inventoryLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionInventoryLabel',
        elementParent: inventoryContainer,
    });
    inventoryLabel.innerText = 'INVENTORY: ';

    const inventorySetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionInventorySetting',
        elementParent: inventoryContainer,
    });

    const inventorySettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionInventorySettingIcon',
        elementParent: inventorySetting,
    });
    inventorySettingIcon.innerText = '🎒';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionInventorySettingValue',
        elementParent: inventorySetting,
    });

    /* Action TOOL */
    const toolContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionToolContainer',
        elementParent: settings,
    });

    const toolLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionToolLabel',
        elementParent: toolContainer,
    });
    toolLabel.innerText = 'TOOL: ';

    const toolSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionToolSetting',
        elementParent: toolContainer,
    });

    const toolSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionToolSettingIcon',
        elementParent: toolSetting,
    });
    toolSettingIcon.innerText = '🎣';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionToolSettingValue',
        elementParent: toolSetting,
    });
};

export const displaySettingsMenu = () => {
    const settings = getElement({ elementId: 'SettingsMenu' });
    const systemSettings = getElement({ elementId: 'SettingsMenuSystem' });

    settings.style.display = (settings.style.display === 'flex') ? 'none' : 'flex';
    systemSettings.style.display = (systemSettings.style.display === 'flex') ? 'none' : 'flex';
};

export const updateSettingsMenu = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is not defined', where: updateSettingsMenu.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const containers = searchElementsByClassName({ className: 'setting-container' });
    for (const container of containers) {
        container.style.borderLeft = '5px solid rgb(180, 180, 180)';
    }

    const values = searchElementsByClassName({ className: 'setting-value' });
    for (const value of values) {
        const settingId = value.id.match(/SettingsMenu(.+)SettingValue/)?.[1];
        if (!(settingId)) continue;

        const settingName = getSettingName({ settingId });

        if (settingName === SETTINGS[0]) {
            value.innerText = (manager.settings._audio) ? '🔊' : '🔇';
        }
        else if (SETTINGS_KEYS_PATHS[settingName]) {
            let settingPath = manager.settings as any;
            for (const key of SETTINGS_KEYS_PATHS[settingName].path) {
                settingPath = settingPath[key];
            }

            value.innerText = (settingPath !== ' ')
                ? settingPath.toUpperCase()
                : 'SPACE';
        }
    }

    const selectedSettingId = getSettingId({ settingName: SETTINGS[manager._selectedSetting] });
    const [selectedSetting] = searchElementsById({ partialElementId: selectedSettingId });
    selectedSetting.style.borderLeft = '5px solid rgb(255, 0, 0)';
};

export const displaySettingsMenuEdit = () => {
    const settingsEdit = getElement({ elementId: 'SettingsMenuEdit' });

    settingsEdit.style.display = (settingsEdit.style.display === 'flex') ? 'none' : 'flex';
};
//#endregion
//#endregion
