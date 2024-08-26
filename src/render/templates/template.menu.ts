import { createEntity } from './template';
import { getEntity, searchEntitiesByClassName, searchEntityById, getSettingId, getSettingName } from './template.utils';

import { Manager } from '@/engine/components/manager';
import { SETTINGS, SETTINGS_KEYS_PATHS } from '@/engine/services/settings';

//#region TEMPLATES
//#region LOADING MENU
export const createLoadingMenu = () => {
    const entityLoading = createEntity({
        entityId: 'LoadingMenu',
        htmlClass: 'loading',
    });

    createEntity({
        entityId: 'LoadingLoader',
        htmlAbsolute: false,
        htmlClass: 'loader',
        htmlParent: entityLoading,
    });
};

export const displayLoadingMenu = ({ display }: { display: boolean }) => {
    const entityLoading = getEntity({ entityId: 'LoadingMenu' });

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
    const entitySetting = createEntity({
        entityId: 'settings-menu',
        htmlClass: 'settings',
    });

    const entitySettingEdit = createEntity({
        entityId: 'settings-menu-edit',
        htmlClass: 'settings-edit',
    });
    entitySettingEdit.innerText = 'ENTER NEW KEY';

    /* General */
    const entitySettingGeneralSettings = createEntity({
        entityId: 'settings-menu-general',
        htmlAbsolute: false,
        htmlClass: 'setting-header',
        htmlParent: entitySetting,
    });
    entitySettingGeneralSettings.innerText = 'GENERAL';

    /* Audio */
    const entitySettingAudioSettingContainer = createEntity({
        entityId: 'settings-menu-audio-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingAudioSettingLabel = createEntity({
        entityId: 'settings-menu-audio-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingAudioSettingContainer,
    });
    entitySettingAudioSettingLabel.innerText = 'AUDIO: ';

    const entitySettingAudioSetting = createEntity({
        entityId: 'settings-menu-audio-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingAudioSettingContainer,
    });

    const entitySettingAudioSettingIcon = createEntity({
        entityId: 'settings-menu-audio-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingAudioSetting,
    });
    entitySettingAudioSettingIcon.innerText = '🎵';

    createEntity({
        entityId: 'settings-menu-audio-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingAudioSetting,
    });

    /* Keybinds */
    const entitySettingKeyMoveSettings = createEntity({
        entityId: 'settings-menu-keybinds',
        htmlAbsolute: false,
        htmlClass: 'setting-header',
        htmlParent: entitySetting,
    });
    entitySettingKeyMoveSettings.innerText = 'KEYBINDS';

    /* Move UP */
    const entitySettingKeyMoveUpSettingContainer = createEntity({
        entityId: 'settings-menu-key-move-up-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyMoveUpSettingLabel = createEntity({
        entityId: 'settings-menu-key-move-up-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyMoveUpSettingContainer,
    });
    entitySettingKeyMoveUpSettingLabel.innerText = 'UP: ';

    const entitySettingKeyMoveUpSetting = createEntity({
        entityId: 'settings-menu-key-move-up-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyMoveUpSettingContainer,
    });

    const entitySettingKeyMoveUpSettingIcon = createEntity({
        entityId: 'settings-menu-key-move-up-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyMoveUpSetting,
    });
    entitySettingKeyMoveUpSettingIcon.innerText = '⬆';

    createEntity({
        entityId: 'settings-menu-key-move-up-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyMoveUpSetting,
    });

    /* Move DOWN */
    const entitySettingKeyMoveDownSettingContainer = createEntity({
        entityId: 'settings-menu-key-move-down-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyMoveDownSettingLabel = createEntity({
        entityId: 'settings-menu-key-move-down-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyMoveDownSettingContainer,
    });
    entitySettingKeyMoveDownSettingLabel.innerText = 'DOWN: ';

    const entitySettingKeyMoveDownSetting = createEntity({
        entityId: 'settings-menu-key-move-down-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyMoveDownSettingContainer,
    });

    const entitySettingKeyMoveDownSettingIcon = createEntity({
        entityId: 'settings-menu-key-move-down-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyMoveDownSetting,
    });
    entitySettingKeyMoveDownSettingIcon.innerText = '⬇';

    createEntity({
        entityId: 'settings-menu-key-move-down-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyMoveDownSetting,
    });

    /* Move LEFT */
    const entitySettingKeyMoveLeftSettingContainer = createEntity({
        entityId: 'settings-menu-key-move-left-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyMoveLeftSettingLabel = createEntity({
        entityId: 'settings-menu-key-move-left-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyMoveLeftSettingContainer,
    });
    entitySettingKeyMoveLeftSettingLabel.innerText = 'LEFT: ';

    const entitySettingKeyMoveLeftSetting = createEntity({
        entityId: 'settings-menu-key-move-left-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyMoveLeftSettingContainer,
    });

    const entitySettingKeyMoveLeftSettingIcon = createEntity({
        entityId: 'settings-menu-key-move-left-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyMoveLeftSetting,
    });
    entitySettingKeyMoveLeftSettingIcon.innerText = '⬅';

    createEntity({
        entityId: 'settings-menu-key-move-left-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyMoveLeftSetting,
    });

    /* Move RIGHT */
    const entitySettingKeyMoveRightSettingContainer = createEntity({
        entityId: 'settings-menu-key-move-right-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyMoveRightSettingLabel = createEntity({
        entityId: 'settings-menu-key-move-right-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyMoveRightSettingContainer,
    });
    entitySettingKeyMoveRightSettingLabel.innerText = 'RIGHT: ';

    const entitySettingKeyMoveRightSetting = createEntity({
        entityId: 'settings-menu-key-move-right-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyMoveRightSettingContainer,
    });

    const entitySettingKeyMoveRightSettingIcon = createEntity({
        entityId: 'settings-menu-key-move-right-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyMoveRightSetting,
    });
    entitySettingKeyMoveRightSettingIcon.innerText = '➡';

    createEntity({
        entityId: 'settings-menu-key-move-right-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyMoveRightSetting,
    });

    /* Action ACT */
    const entitySettingKeyActionActSettingContainer = createEntity({
        entityId: 'settings-menu-key-action-act-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyActionActSettingLabel = createEntity({
        entityId: 'settings-menu-key-action-act-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyActionActSettingContainer,
    });
    entitySettingKeyActionActSettingLabel.innerText = 'ACT: ';

    const entitySettingKeyActionActSetting = createEntity({
        entityId: 'settings-menu-key-action-act-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyActionActSettingContainer,
    });

    const entitySettingKeyActionActSettingIcon = createEntity({
        entityId: 'settings-menu-key-action-act-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyActionActSetting,
    });
    entitySettingKeyActionActSettingIcon.innerText = '🖐';

    createEntity({
        entityId: 'settings-menu-key-action-act-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyActionActSetting,
    });

    /* Action INVENTORY */
    const entitySettingKeyActionInventorySettingContainer = createEntity({
        entityId: 'settings-menu-key-action-inventory-container',
        htmlAbsolute: false,
        htmlClass: 'setting-container',
        htmlParent: entitySetting,
    });

    const entitySettingKeyActionInventorySettingLabel = createEntity({
        entityId: 'settings-menu-key-action-inventory-label',
        htmlAbsolute: false,
        htmlClass: 'setting-label',
        htmlParent: entitySettingKeyActionInventorySettingContainer,
    });
    entitySettingKeyActionInventorySettingLabel.innerText = 'INVENTORY: ';

    const entitySettingKeyActionInventorySetting = createEntity({
        entityId: 'settings-menu-key-action-inventory-setting',
        htmlAbsolute: false,
        htmlClass: 'setting',
        htmlParent: entitySettingKeyActionInventorySettingContainer,
    });

    const entitySettingKeyActionInventorySettingIcon = createEntity({
        entityId: 'settings-menu-key-action-inventory-setting-icon',
        htmlAbsolute: false,
        htmlClass: 'setting-icon',
        htmlParent: entitySettingKeyActionInventorySetting,
    });
    entitySettingKeyActionInventorySettingIcon.innerText = '🎒';

    createEntity({
        entityId: 'settings-menu-key-action-inventory-setting-value',
        htmlAbsolute: false,
        htmlClass: 'setting-value',
        htmlParent: entitySettingKeyActionInventorySetting,
    });
};

export const displaySettingsMenu = () => {
    const entitySettingsMenu = getEntity({ entityId: 'settings-menu' });

    entitySettingsMenu.style.display = (entitySettingsMenu.style.display === 'flex') ? 'none' : 'flex';
};

export const updateSettingsMenu = ({ manager }: {
    manager: Manager,
}) => {
    const settingsContainerEntities = searchEntitiesByClassName({ className: 'setting-container' });
    for (const container of settingsContainerEntities) {
        container.style.borderLeft = '5px solid rgb(180, 180, 180)';
    }

    const settingsValueEntities = searchEntitiesByClassName({ className: 'setting-value' });
    for (const value of settingsValueEntities) {
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

            value.innerText = settingPath;
        }
    }

    const selectedSetting = getSettingId({ settingName: SETTINGS[manager._selectedSetting] });
    const selectedSettingContainerEntity = searchEntityById({ partialEntityId: selectedSetting });
    selectedSettingContainerEntity.style.borderLeft = '5px solid rgb(255, 0, 0)';
};

export const displaySettingsMenuEdit = () => {
    const entitySettingsMenuEdit = getEntity({ entityId: 'settings-menu-edit' });

    entitySettingsMenuEdit.style.display = (entitySettingsMenuEdit.style.display === 'flex') ? 'none' : 'flex';
};
//#endregion
//#endregion
