import { getState, setState } from "./state"
import { tickActivityBug } from "./services/activity/activity.bug";
import { endActivity } from "./services/activity/activity";
import { tickActivityFish, tickActivityFishFrenzy } from "./services/activity/activity.fish";

const cycle = {
    deltaTime: 1 / 60,
    elapsedTimeSinceInputTick: 0,
    elapsedTimeSinceActivityWinTick: 0,
    elapsedTimeSinceActivityBugTick: 0,
    elapsedTimeSinceActivityFishInputTick: 0,
    elapsedTimeSinceActivityFishFrenzyOnTick: 0,
    elapsedTimeSinceActivityFishFrenzyOffTick: 0,
    inputTickInterval: 1 / 10,
    activityWinTickInterval: 0,
    activityBugTickInterval: 0,
    activityFishTickInterval: 1 / 2,
    activityFishTickIntervalFrenzyOn: 0,
    activityFishTickIntervalFrenzyOff: 0,
}

export const setCycle = (key: keyof typeof cycle, value: number) => cycle[key] = value;
export const getCycle = (key: keyof typeof cycle) => cycle[key];
export const clearCycle = (key: keyof typeof cycle) => cycle[key] = 0;

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
    }

    if (getState('isActivityRunning')) {
        if (getState('isActivityWin') && cycle.activityWinTickInterval > 0) {
            cycle.elapsedTimeSinceActivityWinTick += cycle.deltaTime;

            const activityTickIntervalProgress = cycle.elapsedTimeSinceActivityWinTick / cycle.activityWinTickInterval;
            if (activityTickIntervalProgress >= 1) {
                clearCycle('elapsedTimeSinceActivityWinTick');
                clearCycle('activityWinTickInterval');

                endActivity({});
            }
        }

        if (getState('isActivityBugRunning') && cycle.activityBugTickInterval > 0) {
            cycle.elapsedTimeSinceActivityBugTick += cycle.deltaTime;

            const activityBugTickIntervalProgress = cycle.elapsedTimeSinceActivityBugTick / cycle.activityBugTickInterval;
            if (activityBugTickIntervalProgress >= 1) {
                clearCycle('elapsedTimeSinceActivityBugTick');

                tickActivityBug({})
            }
        }

        if (getState('isActivityFishRunning')) {
            cycle.elapsedTimeSinceActivityFishInputTick += cycle.deltaTime;

            const activityFishInputTickIntervalProgress = cycle.elapsedTimeSinceActivityFishInputTick / cycle.activityFishTickInterval;
            if (activityFishInputTickIntervalProgress >= 1) {
                clearCycle('elapsedTimeSinceActivityFishInputTick');

                tickActivityFish({});
            }

            if (getState('isActivityFishFrenzy') && cycle.activityFishTickIntervalFrenzyOn > 0) {
                cycle.elapsedTimeSinceActivityFishFrenzyOnTick += cycle.deltaTime;

                const activityFishFrenzyOnTickInvervalProgress = cycle.elapsedTimeSinceActivityFishFrenzyOnTick / cycle.activityFishTickIntervalFrenzyOn;
                if (activityFishFrenzyOnTickInvervalProgress >= 1) {
                    clearCycle('elapsedTimeSinceActivityFishFrenzyOnTick');

                    tickActivityFishFrenzy({});
                }
            }
            else if (!(getState('isActivityFishFrenzy')) && cycle.activityFishTickIntervalFrenzyOff > 0) {
                cycle.elapsedTimeSinceActivityFishFrenzyOffTick += cycle.deltaTime;

                const activityFishFrenzyOffTickInvervalProgress = cycle.elapsedTimeSinceActivityFishFrenzyOffTick / cycle.activityFishTickIntervalFrenzyOff;
                if (activityFishFrenzyOffTickInvervalProgress >= 1) {
                    clearCycle('elapsedTimeSinceActivityFishFrenzyOffTick');

                    tickActivityFishFrenzy({});
                }
            }
        }
    }
}
