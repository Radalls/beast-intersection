import { endActivity, tickActivityBug, tickActivityFish, tickActivityFishFrenzy } from './services/activity';
import { completeQuest } from './services/quest';
import { getState, setState } from './state';

//#region TYPES
const cycle = {
    activityBugTickInterval: 0,
    activityFishTickInterval: 1 / 2,
    activityFishTickIntervalFrenzyOff: 0,
    activityFishTickIntervalFrenzyOn: 0,
    activityWinTickInterval: 0,
    checkTime: 1 / 10,
    deltaTime: 1 / 60,
    elapsedTimeSinceActivityBugTick: 0,
    elapsedTimeSinceActivityFishFrenzyOffTick: 0,
    elapsedTimeSinceActivityFishFrenzyOnTick: 0,
    elapsedTimeSinceActivityFishInputTick: 0,
    elapsedTimeSinceActivityWinTick: 0,
    elapsedTimeSinceInputTick: 0,
    inputTickInterval: 1 / 10,
};

const check = {
    questCheck: () => false,
};
//#endregion

//#region HELPERS
export const setCycle = (key: keyof typeof cycle, value: number) => cycle[key] = value;
export const getCycle = (key: keyof typeof cycle) => cycle[key];
export const clearCycle = (key: keyof typeof cycle) => cycle[key] = 0;

export const setCheck = (key: keyof typeof check, value: () => boolean) => check[key] = value;
export const getCheck = (key: keyof typeof check) => check[key]();
export const clearCheck = (key: keyof typeof check) => check[key] = () => false;
//#endregion

//#region CYCLE
export const runCycle = () => {
    if (getState('isGameRunning')) {
        cycle.elapsedTimeSinceInputTick += cycle.deltaTime;

        if (getState('isInputCooldown')) {
            const inputTickIntervalProgress = cycle.elapsedTimeSinceInputTick / cycle.inputTickInterval;
            if (inputTickIntervalProgress >= 1) {
                clearCycle('elapsedTimeSinceInputTick');
                setState('isInputCooldown', false);
            }
        }

        if (getState('isActivityRunning')) {
            if (getState('isActivityWin') && cycle.activityWinTickInterval > 0) {
                cycle.elapsedTimeSinceActivityWinTick += cycle.deltaTime;

                const activityTickIntervalProgress
                    = cycle.elapsedTimeSinceActivityWinTick / cycle.activityWinTickInterval;
                if (activityTickIntervalProgress >= 1) {
                    clearCycle('elapsedTimeSinceActivityWinTick');
                    clearCycle('activityWinTickInterval');

                    endActivity({});
                }
            }

            if (getState('isActivityBugRunning') && cycle.activityBugTickInterval > 0) {
                cycle.elapsedTimeSinceActivityBugTick += cycle.deltaTime;

                const activityBugTickIntervalProgress =
                    cycle.elapsedTimeSinceActivityBugTick / cycle.activityBugTickInterval;
                if (activityBugTickIntervalProgress >= 1) {
                    clearCycle('elapsedTimeSinceActivityBugTick');

                    tickActivityBug({});
                }
            }

            if (getState('isActivityFishRunning')) {
                cycle.elapsedTimeSinceActivityFishInputTick += cycle.deltaTime;

                const activityFishInputTickIntervalProgress =
                    cycle.elapsedTimeSinceActivityFishInputTick / cycle.activityFishTickInterval;
                if (activityFishInputTickIntervalProgress >= 1) {
                    clearCycle('elapsedTimeSinceActivityFishInputTick');

                    tickActivityFish({});
                }

                if (getState('isActivityFishFrenzy') && cycle.activityFishTickIntervalFrenzyOn > 0) {
                    cycle.elapsedTimeSinceActivityFishFrenzyOnTick += cycle.deltaTime;

                    const activityFishFrenzyOnTickInvervalProgress =
                        cycle.elapsedTimeSinceActivityFishFrenzyOnTick / cycle.activityFishTickIntervalFrenzyOn;
                    if (activityFishFrenzyOnTickInvervalProgress >= 1) {
                        clearCycle('elapsedTimeSinceActivityFishFrenzyOnTick');

                        tickActivityFishFrenzy({});
                    }
                }
                else if (!(getState('isActivityFishFrenzy')) && cycle.activityFishTickIntervalFrenzyOff > 0) {
                    cycle.elapsedTimeSinceActivityFishFrenzyOffTick += cycle.deltaTime;

                    const activityFishFrenzyOffTickInvervalProgress =
                        cycle.elapsedTimeSinceActivityFishFrenzyOffTick / cycle.activityFishTickIntervalFrenzyOff;
                    if (activityFishFrenzyOffTickInvervalProgress >= 1) {
                        clearCycle('elapsedTimeSinceActivityFishFrenzyOffTick');

                        tickActivityFishFrenzy({});
                    }
                }
            }
        }
    }
};

export const runCheck = () => {
    if (getState('isGameRunning')) {
        if (getState('isQuestActive')) {
            const questCheckResult = getCheck('questCheck');

            if (questCheckResult) {
                setCheck('questCheck', () => false);
                completeQuest();
            }
        }
    }
};
//#endregion
