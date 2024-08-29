import { createElement } from './template';
import { getElement, searchElementsByClassName, searchElementById } from './template.utils';

import { Manager } from '@/engine/components/manager';
import { SETTINGS, SETTINGS_KEYS_PATHS } from '@/engine/services/settings';

//#region HELPERS
const getSettingId = ({ settingName }: { settingName: string }) => {
    return settingName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const getSettingName = ({ settingId }: { settingId: string }) => {
    return settingId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};
//#endregion

//#region TEMPLATES
//#region LOADING MENU
export const createLoadingMenu = () => {
    const loading = createElement({
        elementClass: 'loading',
        entityId: 'LoadingMenu',
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'loader',
        elementParent: loading,
        entityId: 'LoadingLoader',
    });
};

export const displayLoadingMenu = ({ display }: { display: boolean }) => {
    const entityLoading = getElement({ elementId: 'LoadingMenu' });

    if (display) {
        entityLoading.style.display = 'flex';
    }
    else {
        setTimeout(() => {
            entityLoading.style.display = 'none';
        }, 100);
    }
};
//#endregion

//#region SETTINGS MENU
export const createSettingsMenu = () => {
    const settings = createElement({
        elementClass: 'settings',
        entityId: 'settings-menu',
    });

    const edit = createElement({
        elementClass: 'settings-edit',
        entityId: 'settings-menu-edit',
    });
    edit.innerText = 'ENTER NEW KEY';

    /* General */
    const generalSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementParent: settings,
        entityId: 'settings-menu-general',
    });
    generalSettings.innerText = 'GENERAL';

    /* Audio */
    const audioContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-audio-container',
    });

    const audioLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: audioContainer,
        entityId: 'settings-menu-audio-label',
    });
    audioLabel.innerText = 'AUDIO: ';

    const audioSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: audioContainer,
        entityId: 'settings-menu-audio-setting',
    });

    const audioSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: audioSetting,
        entityId: 'settings-menu-audio-setting-icon',
    });
    audioSettingIcon.innerText = '🎵';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: audioSetting,
        entityId: 'settings-menu-audio-setting-value',
    });

    /* Keybinds */
    const keybindsSettings = createElement({
        elementAbsolute: false,
        elementClass: 'setting-header',
        elementParent: settings,
        entityId: 'settings-menu-keybinds',
    });
    keybindsSettings.innerText = 'KEYBINDS';

    /* Move UP */
    const moveUpContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-move-up-container',
    });

    const moveUpLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: moveUpContainer,
        entityId: 'settings-menu-key-move-up-label',
    });
    moveUpLabel.innerText = 'UP: ';

    const moveUpSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: moveUpContainer,
        entityId: 'settings-menu-key-move-up-setting',
    });

    const moveUpSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: moveUpSetting,
        entityId: 'settings-menu-key-move-up-setting-icon',
    });
    moveUpSettingIcon.innerText = '⬆';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: moveUpSetting,
        entityId: 'settings-menu-key-move-up-setting-value',
    });

    /* Move DOWN */
    const moveDownContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-move-down-container',
    });

    const moveDownLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: moveDownContainer,
        entityId: 'settings-menu-key-move-down-label',
    });
    moveDownLabel.innerText = 'DOWN: ';

    const moveDownSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: moveDownContainer,
        entityId: 'settings-menu-key-move-down-setting',
    });

    const moveDownSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: moveDownSetting,
        entityId: 'settings-menu-key-move-down-setting-icon',
    });
    moveDownSettingIcon.innerText = '⬇';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: moveDownSetting,
        entityId: 'settings-menu-key-move-down-setting-value',
    });

    /* Move LEFT */
    const moveLeftContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-move-left-container',
    });

    const moveLeftLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: moveLeftContainer,
        entityId: 'settings-menu-key-move-left-label',
    });
    moveLeftLabel.innerText = 'LEFT: ';

    const moveLeftSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: moveLeftContainer,
        entityId: 'settings-menu-key-move-left-setting',
    });

    const moveLeftSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: moveLeftSetting,
        entityId: 'settings-menu-key-move-left-setting-icon',
    });
    moveLeftSettingIcon.innerText = '⬅';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: moveLeftSetting,
        entityId: 'settings-menu-key-move-left-setting-value',
    });

    /* Move RIGHT */
    const moveRightContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-move-right-container',
    });

    const moveRightLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: moveRightContainer,
        entityId: 'settings-menu-key-move-right-label',
    });
    moveRightLabel.innerText = 'RIGHT: ';

    const moveRightSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: moveRightContainer,
        entityId: 'settings-menu-key-move-right-setting',
    });

    const moveRightSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: moveRightSetting,
        entityId: 'settings-menu-key-move-right-setting-icon',
    });
    moveRightSettingIcon.innerText = '➡';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: moveRightSetting,
        entityId: 'settings-menu-key-move-right-setting-value',
    });

    /* Action ACT */
    const actContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-action-act-container',
    });

    const actLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: actContainer,
        entityId: 'settings-menu-key-action-act-label',
    });
    actLabel.innerText = 'ACT: ';

    const actSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: actContainer,
        entityId: 'settings-menu-key-action-act-setting',
    });

    const actSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: actSetting,
        entityId: 'settings-menu-key-action-act-setting-icon',
    });
    actSettingIcon.innerText = '🖐';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: actSetting,
        entityId: 'settings-menu-key-action-act-setting-value',
    });

    /* Action INVENTORY */
    const inventoryContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-action-inventory-container',
    });

    const inventoryLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: inventoryContainer,
        entityId: 'settings-menu-key-action-inventory-label',
    });
    inventoryLabel.innerText = 'INVENTORY: ';

    const inventorySetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: inventoryContainer,
        entityId: 'settings-menu-key-action-inventory-setting',
    });

    const inventorySettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: inventorySetting,
        entityId: 'settings-menu-key-action-inventory-setting-icon',
    });
    inventorySettingIcon.innerText = '🎒';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: inventorySetting,
        entityId: 'settings-menu-key-action-inventory-setting-value',
    });

    /* Action TOOL */
    const toolContainer = createElement({
        elementAbsolute: false,
        elementClass: 'setting-container',
        elementParent: settings,
        entityId: 'settings-menu-key-action-tool-container',
    });

    const toolLabel = createElement({
        elementAbsolute: false,
        elementClass: 'setting-label',
        elementParent: toolContainer,
        entityId: 'settings-menu-key-action-tool-label',
    });
    toolLabel.innerText = 'TOOL: ';

    const toolSetting = createElement({
        elementAbsolute: false,
        elementClass: 'setting',
        elementParent: toolContainer,
        entityId: 'settings-menu-key-action-tool-setting',
    });

    const toolSettingIcon = createElement({
        elementAbsolute: false,
        elementClass: 'setting-icon',
        elementParent: toolSetting,
        entityId: 'settings-menu-key-action-tool-setting-icon',
    });
    toolSettingIcon.innerText = '🎣';

    createElement({
        elementAbsolute: false,
        elementClass: 'setting-value',
        elementParent: toolSetting,
        entityId: 'settings-menu-key-action-tool-setting-value',
    });
};

export const displaySettingsMenu = () => {
    const settings = getElement({ elementId: 'settings-menu' });

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
        const settingId = value.id.match(/settings-menu-(.+)-setting-value/)?.[1];
        if (!(settingId)) continue;

        const settingName = getSettingName({ settingId });

        if (settingName === 'audio') {
            value.innerText = (manager.settings._audio) ? '🔊' : '🔇';
        }
        else if ((SETTINGS_KEYS_PATHS[settingName])) {
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
    const settingsEdit = getElement({ elementId: 'settings-menu-edit' });

    settingsEdit.style.display = (settingsEdit.style.display === 'flex') ? 'none' : 'flex';
};
//#endregion
//#endregion
