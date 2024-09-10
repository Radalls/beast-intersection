import { canPlay, checkActivityId, endActivity, startActivity, winActivity } from './activity';

import { ActivityFishData } from '@/engine/components/resource';
import { clearCycle, setCycle } from '@/engine/cycle';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { randAudio } from '@/render/audio';
import { event } from '@/render/events';

//#region SERVICES
export const startActivityFish = ({ activityId }: { activityId: string }) => {
    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: startActivityFish.name });

    if (!(canPlay({ activity: activityResource._activityType, entityId: playerEntityId }))) {
        event({
            data: { audioName: 'main_fail' },
            entityId: playerEntityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }

    startActivity({ activityId });

    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp = activityFishData._fishMaxHp;
    activityFishData._rodTension = 0;
    activityFishData._isFrenzy = false;

    setState('isActivityFishRunning', true);
    setState('isActivityFishFrenzy', false);
    setCycle('activityFishTickInterval', 1 / 2);
    setCycle('activityFishTickIntervalFrenzyOff', activityFishData._frenzyInterval);
    setCycle('activityFishTickIntervalFrenzyOn', activityFishData._frenzyDuration);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_START,
    });
    event({
        data: { audioName: 'activity_fish_start' },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const tickActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp += Math.floor(activityFishData._rodDamage / 2);
    activityFishData._fishHp = Math.min(activityFishData._fishHp, activityFishData._fishMaxHp);
    activityFishData._rodTension -= activityFishData._fishDamage * 2;
    activityFishData._rodTension = Math.max(activityFishData._rodTension, 0);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });

    if (activityFishData._isFrenzy) {
        event({
            data: { audioName: 'activity_fish_frenzy' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });
    }
};

export const tickActivityFishFrenzy = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._isFrenzy = !(activityFishData._isFrenzy);

    setState('isActivityFishFrenzy', activityFishData._isFrenzy);

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });
};

export const playActivityFish = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: playActivityFish.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    activityId = checkActivityId({ activityId });

    if (symbol !== manager.settings.keys.action._act) return;

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    if (activityFishData._isFrenzy) {
        activityFishData._rodTension += activityFishData._fishDamage * 3;
        activityFishData._fishHp -= Math.floor(activityFishData._rodDamage / 2);
    }
    else {
        activityFishData._rodTension += activityFishData._fishDamage;
        activityFishData._fishHp -= activityFishData._rodDamage;
    }

    if (activityFishData._fishHp <= 0) {
        endActivityFish({ activityId });
        winActivity({ activityId });

        event({
            data: { audioName: 'activity_fish_win' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }
    else if (activityFishData._rodTension > activityFishData._rodMaxTension) {
        endActivityFish({ activityId });
        endActivity({ activityId });

        return;
    }

    event({
        data: activityFishData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_UPDATE,
    });
    event({
        data: { audioName: `activity_fish_play${randAudio({ nb: 2 })}` },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const endActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    setState('isActivityFishRunning', false);
    setState('isActivityFishFrenzy', false);
    clearCycle('activityFishTickInterval');
    clearCycle('activityFishTickIntervalFrenzyOn');
    clearCycle('activityFishTickIntervalFrenzyOff');

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_FISH_END,
    });
};
//#endregion
