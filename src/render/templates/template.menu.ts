import { createElement } from './template';
import { getElement, searchElementsByClassName, searchElementById } from './template.utils';

import { Manager } from '@/engine/components/manager';
import { SETTINGS, SETTINGS_KEYS_PATHS } from '@/engine/services/settings';

//#region HELPERS
const getSettingId = ({ settingName }: { settingName: string }) => {
    return settingName.charAt(0).toUpperCase() + settingName.slice(1);
};

const getSettingName = ({ settingId }: { settingId: string }) => {
    return settingId.charAt(0).toLowerCase() + settingId.slice(1);
};
//#endregion

//#region TEMPLATES
//#region LOADING MENU
export const createLoadingMenu = () => {
    const loading = createElement({
        elementClass: 'loading',
        elementId: 'LoadingMenu',
        entityId: '',
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'loader',
        elementId: 'LoadingLoader',
        elementParent: loading,
        entityId: '',
    });
};

export const displayLoadingMenu = ({ display }: { display: boolean }) => {
    const entityLoading = getElement({ elementId: 'LoadingMenu' });

    if (display) {
        entityLoading.style.display = 'flex';
    }
    else {
        // setTimeout(() => {
        //     entityLoading.style.display = 'none';
        // }, 100);

        entityLoading.style.display = 'none';
    }
};
//#endregion

//#region SETTINGS MENU
export const createSettingsMenu = () => {
    const settings = createElement({
        elementClass: 'settings',
        elementId: 'SettingsMenu',
        entityId: '',
    });

    const edit = createElement({
        elementClass: 'settings-edit',
        elementId: 'SettingsMenuEdit',
        entityId: '',
    });
    edit.innerText = 'ENTER NEW KEY';

    /* General */
    const generalSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementId: 'SettingsMenuGeneral',
        elementParent: settings,
        entityId: '',
    });
    generalSettings.innerText = 'GENERAL';

    /* Audio */
    const audioContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuAudioContainer',
        elementParent: settings,
        entityId: '',
    });

    const audioLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuAudioLabel',
        elementParent: audioContainer,
        entityId: '',
    });
    audioLabel.innerText = 'AUDIO: ';

    const audioSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuAudioSetting',
        elementParent: audioContainer,
        entityId: '',
    });

    const audioSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuAudioSettingIcon',
        elementParent: audioSetting,
        entityId: '',
    });
    audioSettingIcon.innerText = '🎵';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuAudioSettingValue',
        elementParent: audioSetting,
        entityId: '',
    });

    /* Keybinds */
    const keybindsSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementId: 'SettingsMenuKeybinds',
        elementParent: settings,
        entityId: '',
    });
    keybindsSettings.innerText = 'KEYBINDS';

    /* Move UP */
    const moveUpContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveUpContainer',
        elementParent: settings,
        entityId: '',
    });

    const moveUpLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveUpLabel',
        elementParent: moveUpContainer,
        entityId: '',
    });
    moveUpLabel.innerText = 'UP: ';

    const moveUpSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveUpSetting',
        elementParent: moveUpContainer,
        entityId: '',
    });

    const moveUpSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveUpSettingIcon',
        elementParent: moveUpSetting,
        entityId: '',
    });
    moveUpSettingIcon.innerText = '⬆';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveUpSettingValue',
        elementParent: moveUpSetting,
        entityId: '',
    });

    /* Move DOWN */
    const moveDownContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveDownContainer',
        elementParent: settings,
        entityId: '',
    });

    const moveDownLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveDownLabel',
        elementParent: moveDownContainer,
        entityId: '',
    });
    moveDownLabel.innerText = 'DOWN: ';

    const moveDownSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveDownSetting',
        elementParent: moveDownContainer,
        entityId: '',
    });

    const moveDownSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveDownSettingIcon',
        elementParent: moveDownSetting,
        entityId: '',
    });
    moveDownSettingIcon.innerText = '⬇';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveDownSettingValue',
        elementParent: moveDownSetting,
        entityId: '',
    });

    /* Move LEFT */
    const moveLeftContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveLeftContainer',
        elementParent: settings,
        entityId: '',
    });

    const moveLeftLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveLeftLabel',
        elementParent: moveLeftContainer,
        entityId: '',
    });
    moveLeftLabel.innerText = 'LEFT: ';

    const moveLeftSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveLeftSetting',
        elementParent: moveLeftContainer,
        entityId: '',
    });

    const moveLeftSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveLeftSettingIcon',
        elementParent: moveLeftSetting,
        entityId: '',
    });
    moveLeftSettingIcon.innerText = '⬅';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveLeftSettingValue',
        elementParent: moveLeftSetting,
        entityId: '',
    });

    /* Move RIGHT */
    const moveRightContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyMoveRightContainer',
        elementParent: settings,
        entityId: '',
    });

    const moveRightLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyMoveRightLabel',
        elementParent: moveRightContainer,
        entityId: '',
    });
    moveRightLabel.innerText = 'RIGHT: ';

    const moveRightSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyMoveRightSetting',
        elementParent: moveRightContainer,
        entityId: '',
    });

    const moveRightSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyMoveRightSettingIcon',
        elementParent: moveRightSetting,
        entityId: '',
    });
    moveRightSettingIcon.innerText = '➡';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyMoveRightSettingValue',
        elementParent: moveRightSetting,
        entityId: '',
    });

    /* Action ACT */
    const actContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionActContainer',
        elementParent: settings,
        entityId: '',
    });

    const actLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionActLabel',
        elementParent: actContainer,
        entityId: '',
    });
    actLabel.innerText = 'ACT: ';

    const actSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionActSetting',
        elementParent: actContainer,
        entityId: '',
    });

    const actSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionActSettingIcon',
        elementParent: actSetting,
        entityId: '',
    });
    actSettingIcon.innerText = '🖐';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionActSettingValue',
        elementParent: actSetting,
        entityId: '',
    });

    /* Action INVENTORY */
    const inventoryContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionInventoryContainer',
        elementParent: settings,
        entityId: '',
    });

    const inventoryLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionInventoryLabel',
        elementParent: inventoryContainer,
        entityId: '',
    });
    inventoryLabel.innerText = 'INVENTORY: ';

    const inventorySetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionInventorySetting',
        elementParent: inventoryContainer,
        entityId: '',
    });

    const inventorySettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionInventorySettingIcon',
        elementParent: inventorySetting,
        entityId: '',
    });
    inventorySettingIcon.innerText = '🎒';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionInventorySettingValue',
        elementParent: inventorySetting,
        entityId: '',
    });

    /* Action TOOL */
    const toolContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementId: 'SettingsMenuKeyActionToolContainer',
        elementParent: settings,
        entityId: '',
    });

    const toolLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementId: 'SettingsMenuKeyActionToolLabel',
        elementParent: toolContainer,
        entityId: '',
    });
    toolLabel.innerText = 'TOOL: ';

    const toolSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementId: 'SettingsMenuKeyActionToolSetting',
        elementParent: toolContainer,
        entityId: '',
    });

    const toolSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementId: 'SettingsMenuKeyActionToolSettingIcon',
        elementParent: toolSetting,
        entityId: '',
    });
    toolSettingIcon.innerText = '🎣';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementId: 'SettingsMenuKeyActionToolSettingValue',
        elementParent: toolSetting,
        entityId: '',
    });
};

export const displaySettingsMenu = () => {
    const settings = getElement({ elementId: 'SettingsMenu' });

    settings.style.display = (settings.style.display === 'flex') ? 'none' : 'flex';
};

export const updateSettingsMenu = ({ manager }: {
    manager: Manager,
}) => {
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

            value.innerText = settingPath.toUpperCase();
        }
    }

    const selectedSettingId = getSettingId({ settingName: SETTINGS[manager._selectedSetting] });
    const selectedSetting = searchElementById({ partialElementId: selectedSettingId });
    selectedSetting.style.borderLeft = '5px solid rgb(255, 0, 0)';
};

export const displaySettingsMenuEdit = () => {
    const settingsEdit = getElement({ elementId: 'SettingsMenuEdit' });

    settingsEdit.style.display = (settingsEdit.style.display === 'flex') ? 'none' : 'flex';
};
//#endregion
//#endregion
