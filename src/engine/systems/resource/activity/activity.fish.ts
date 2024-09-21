import { canPlay, checkActivityId, loseActivity, startActivity, winActivity } from './activity';

import { ActivityFishData } from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { clearCycle, setCycle } from '@/engine/services/cycle';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { playerInventoryFull } from '@/engine/systems/inventory';
import {
    isSecretRun,
    loseActivityFishSecret,
    startActivityFishSecret,
    winActivityFishSecret,
} from '@/engine/systems/manager';
import { randAudio } from '@/render/audio';
import { event } from '@/render/events';

//#region SERVICES
export const onActivityFishInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onActivityFishInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const activityFishEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityFishInput.name });

    if (inputKey === manager.settings.keys.action._back) {
        if (isSecretRun()) return;

        loseActivityFish();
    }
    else {
        playActivityFish({ activityId: activityFishEntityId, symbol: inputKey });
    }
};

export const startActivityFish = ({ activityId }: { activityId: string }) => {
    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });

    if (!(activityResource.item)) {
        throw error({ message: `Resource ${activityId} does not have an item`, where: startActivityFish.name });
    }

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: startActivityFish.name });

    if (!(canPlay({ activity: activityResource._activityType, entityId: playerEntityId }))) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Wrong tool - Not enough energy' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Player can't play activity ${activityResource._activityType}`,
            where: startActivityFish.name,
        });
    }
    if (playerInventoryFull({ item: activityResource.item })) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Inventory full' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Player will not be able to get ${activityResource.item?.info._name}`,
            where: startActivityFish.name,
        });
    }

    startActivity({ activityId });

    if (isSecretRun()) {
        startActivityFishSecret();
    }

    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp = activityFishData._fishMaxHp;
    activityFishData._rodTension = 0;
    activityFishData._isFrenzy = false;

    setState('isActivityFishRunning', true);
    setState('isActivityFishFrenzy', false);
    setCycle('activityFishTickInterval', 1 / 2);
    setCycle('activityFishTickIntervalFrenzyOff', activityFishData._frenzyInterval);
    setCycle('activityFishTickIntervalFrenzyOn', activityFishData._frenzyDuration);

    event({ type: EventTypes.ACTIVITY_FISH_START });
    event({ data: { audioName: 'activity_fish_start' }, type: EventTypes.AUDIO_PLAY });
};

export const tickActivityFish = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._fishHp += Math.floor(activityFishData._rodDamage / 2);
    activityFishData._fishHp = Math.min(activityFishData._fishHp, activityFishData._fishMaxHp);
    activityFishData._rodTension -= activityFishData._fishDamage * 2;
    activityFishData._rodTension = Math.max(activityFishData._rodTension, 0);

    event({ type: EventTypes.ACTIVITY_FISH_UPDATE });

    if (activityFishData._isFrenzy) {
        event({ data: { audioName: 'activity_fish_frenzy' }, type: EventTypes.AUDIO_PLAY });
    }
};

export const tickActivityFishFrenzy = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityFishData = activityResource.activityData as ActivityFishData;
    activityFishData._isFrenzy = !(activityFishData._isFrenzy);

    setState('isActivityFishFrenzy', activityFishData._isFrenzy);

    event({ type: EventTypes.ACTIVITY_FISH_UPDATE });
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
        if (isSecretRun()) {
            winActivityFishSecret({ activityId });
            return;
        }

        endActivityFish();
        winActivity({ activityId });

        event({ data: { audioName: 'activity_fish_win' }, type: EventTypes.AUDIO_PLAY });

        return;
    }
    else if (activityFishData._rodTension > activityFishData._rodMaxTension) {
        if (isSecretRun()) {
            loseActivityFishSecret({ activityId });
            return;
        }

        endActivityFish();
        loseActivity();

        return;
    }

    event({ type: EventTypes.ACTIVITY_FISH_UPDATE });
    event({ data: { audioName: `activity_fish_play${randAudio({ nb: 2 })}` }, type: EventTypes.AUDIO_PLAY });
};

export const loseActivityFish = () => {
    endActivityFish();
    loseActivity();
};

export const endActivityFish = () => {
    setState('isActivityFishRunning', false);
    setState('isActivityFishFrenzy', false);
    clearCycle('activityFishTickInterval');
    clearCycle('activityFishTickIntervalFrenzyOn');
    clearCycle('activityFishTickIntervalFrenzyOff');

    event({ type: EventTypes.ACTIVITY_FISH_END });
};
//#endregion
