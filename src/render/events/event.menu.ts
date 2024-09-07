import { Manager } from '@/engine/components/manager';
import {
    displayLaunchMenu,
    displayLoadingMenu,
    displaySettingsMenu,
    displaySettingsMenuEdit,
    updateLaunchMenu,
    updateSettingsMenu,
} from '@/render/templates';

//#region EVENTS
//#region LOADING MENU
export const onLoadingDisplay = ({ display }: { display: boolean }) => displayLoadingMenu({ display });
//#endregion

//#region LAUNCH MENU
export const onLaunchMenuDisplay = () => displayLaunchMenu();

export const onLaunchMenuUpdate = ({ manager }: { manager: Manager }) => updateLaunchMenu({ manager });
//#endregion

//#region SETTINGS MENU
export const onSettingsMenuDisplay = () => displaySettingsMenu();

export const onSettingsMenuUpdate = ({ manager }: { manager: Manager }) => updateSettingsMenu({ manager });

export const onSettingsMenuDisplayEdit = () => displaySettingsMenuEdit();
//#endregion
//#endregion
