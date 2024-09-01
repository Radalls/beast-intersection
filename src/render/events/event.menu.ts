import { Manager } from '@/engine/components/manager';
import {
    displayLoadingMenu,
    displaySettingsMenu,
    displaySettingsMenuEdit,
    updateSettingsMenu,
} from '@/render/templates';

//#region EVENTS
export const onLoadingDisplay = ({ display }: { display: boolean }) => displayLoadingMenu({ display });

export const onSettingsMenuDisplay = () => displaySettingsMenu();

export const onSettingsMenuUpdate = ({ manager }: { manager: Manager }) => updateSettingsMenu({ manager });

export const onSettingsMenuDisplayEdit = () => displaySettingsMenuEdit();
//#endregion
