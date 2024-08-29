import { canPlay, checkActivityId, endActivity, startActivity, winActivity } from './activity';

import { ActivityBugData } from '@/engine/components/resource';
import { clearCycle, setCycle } from '@/engine/cycle';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { getState, setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region SERVICES
export const startActivityBug = ({ activityId }: { activityId: string }) => {
    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: startActivityBug.name });

    if (!(canPlay({ activity: activityResource._activityType, entityId: playerEntityId }))) {
        event({
            data: { audioName: 'activity_fail' },
            entityId: playerEntityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }

    startActivity({ activityId });

    const activityBugData = activityResource.activityData as ActivityBugData;
    activityBugData._hp = activityBugData._maxHp;
    activityBugData._nbErrors = 0;
    activityBugData._symbol = undefined;
    activityBugData._symbolFound = undefined;

    setState('isActivityBugRunning', true);
    setCycle('activityBugTickInterval', activityBugData._symbolInterval);

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_START,
    });
    event({
        data: { audioName: 'activity_bug_start' },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
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

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_UPDATE,
    });
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

        event({
            data: { audioName: 'activity_bug_symbol_found' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });
    }
    else if (symbol !== activityBugData._symbol) {
        activityBugData._nbErrors += 1;
        activityBugData._symbolFound = false;

        setState('isActivityBugCooldown', true);

        event({
            data: { audioName: 'activity_bug_symbol_error' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });
    }

    if (activityBugData._hp <= 0) {
        endActivityBug({ activityId });
        winActivity({ activityId });

        event({
            data: { audioName: 'activity_bug_win' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }
    else if (activityBugData._nbErrors >= activityBugData._maxNbErrors) {
        endActivityBug({ activityId });
        endActivity({ activityId });
        return;
    }

    event({
        data: activityBugData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_UPDATE,
    });
};

export const endActivityBug = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityBugRunning', false);
    setState('isActivityBugCooldown', false);
    clearCycle('activityBugTickInterval');

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_BUG_END,
    });
};
//#endregion
