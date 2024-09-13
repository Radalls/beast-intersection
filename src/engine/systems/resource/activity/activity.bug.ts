import { canPlay, checkActivityId, loseActivity, startActivity, winActivity } from './activity';

import { ActivityBugData } from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { clearCycle, setCycle } from '@/engine/services/cycle';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getState, setState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { playerInventoryFull } from '@/engine/systems/inventory';
import { event } from '@/render/events';

//#region SERVICES
export const startActivityBug = ({ activityId }: { activityId: string }) => {
    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });

    if (!(activityResource.item)) {
        throw error({ message: `Resource ${activityId} does not have an item`, where: startActivityBug.name });
    }

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: startActivityBug.name });

    if (!(canPlay({ activity: activityResource._activityType, entityId: playerEntityId }))) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Wrong tool - Not enough energy' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Player can't play activity ${activityResource._activityType}`,
            where: startActivityBug.name,
        });
    }
    if (playerInventoryFull({ item: activityResource.item })) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Inventory full' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Player will not be able to get ${activityResource.item?.info._name}`,
            where: startActivityBug.name,
        });
    }

    startActivity({ activityId });

    const activityBugData = activityResource.activityData as ActivityBugData;
    activityBugData._hp = activityBugData._maxHp;
    activityBugData._nbErrors = 0;
    activityBugData._symbol = undefined;
    activityBugData._symbolFound = undefined;

    setState('isActivityBugRunning', true);
    setCycle('activityBugTickInterval', activityBugData._symbolInterval);

    event({ type: EventTypes.ACTIVITY_BUG_START });
    event({ data: { audioName: 'activity_bug_start' }, type: EventTypes.AUDIO_PLAY });
};

export const tickActivityBug = ({ activityId }: { activityId?: string | null }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: tickActivityBug.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityBugData = activityResource.activityData as ActivityBugData;

    activityBugData._symbol = manager.settings.keys.move[Object.keys(manager.settings.keys.move)[
        Math.floor(Math.random() * Object.keys(manager.settings.keys.move).length)
    ] as keyof typeof manager.settings.keys.move];

    activityBugData._symbolFound = undefined;

    if (getState('isActivityBugCooldown')) {
        setState('isActivityBugCooldown', false);
    }

    event({ type: EventTypes.ACTIVITY_BUG_UPDATE });
    event({ data: { audioName: 'activity_bug_select' }, type: EventTypes.AUDIO_PLAY });
};

export const playActivityBug = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityBugData = activityResource.activityData as ActivityBugData;
    if (symbol === activityBugData._symbol && activityBugData._hp > 0) {
        activityBugData._hp -= 1;
        activityBugData._symbolFound = true;

        setState('isActivityBugCooldown', true);

        event({ data: { audioName: 'main_success' }, type: EventTypes.AUDIO_PLAY });
    }
    else if (symbol !== activityBugData._symbol) {
        activityBugData._nbErrors += 1;
        activityBugData._symbolFound = false;

        setState('isActivityBugCooldown', true);

        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
    }

    if (activityBugData._hp <= 0) {
        endActivityBug();
        winActivity({ activityId });

        event({ data: { audioName: 'activity_bug_win' }, type: EventTypes.AUDIO_PLAY });

        return;
    }
    else if (activityBugData._nbErrors >= activityBugData._maxNbErrors) {
        endActivityBug();
        loseActivity();

        return;
    }

    event({ type: EventTypes.ACTIVITY_BUG_UPDATE });
};

export const loseActivityBug = () => {
    endActivityBug();
    loseActivity();
};

export const endActivityBug = () => {
    setState('isActivityBugRunning', false);
    setState('isActivityBugCooldown', false);
    clearCycle('activityBugTickInterval');

    event({ type: EventTypes.ACTIVITY_BUG_END });
};

export const onActivityBugInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onActivityBugInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const activityBugEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityBugInput.name });

    if (inputKey === manager.settings.keys.action._back) {
        loseActivityBug();
    }
    else {
        playActivityBug({ activityId: activityBugEntityId, symbol: inputKey });
    }
};
//#endregion
