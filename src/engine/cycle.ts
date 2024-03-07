import { getState, setState } from "./state"
import { tickActivityBug } from "./services/activity/activity.bug";
import { endActivity } from "./services/activity/activity";

const cycle = {
    deltaTime: 1 / 60,
    elapsedGameTime: 0,
    elapsedActivityTime: 0,
    activityInterval: 0,
    activityBugTickInterval: 0,
}

export const setCycle = (key: keyof typeof cycle, value: number) => cycle[key] = value;
export const getCycle = (key: keyof typeof cycle) => cycle[key];
export const clearCycle = (key: keyof typeof cycle) => cycle[key] = 0;

export const runCycle = () => {
    if (getState('isGameRunning')) {
        cycle.elapsedGameTime += cycle.deltaTime;
    }

    if (getState('isActivityRunning')) {
        cycle.elapsedActivityTime += cycle.deltaTime;

        if (getState('isActivityBugRunning') && cycle.activityBugTickInterval > 0) {
            const activityBugTickIntervals = Math.floor(cycle.elapsedActivityTime / cycle.activityBugTickInterval);

            if (activityBugTickIntervals > 0) {
                tickActivityBug({})
                cycle.elapsedActivityTime %= cycle.activityBugTickInterval;

                if (getState('isActivityBugCooldown')) {
                    setState('isActivityBugCooldown', false);
                }
            }
        }

        if (getState('isActivityWin') && cycle.activityInterval > 0) {
            const activityIntervals = Math.floor(cycle.elapsedActivityTime / cycle.activityInterval);

            if (activityIntervals > 0) {
                setState('isActivityWin', false);
                endActivity({});
            }
        }
    }
}
