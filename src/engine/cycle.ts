import { getState, setState } from "./state"
import { tickActivityBug } from "./services/activity/activity.bug";

const cycle = {
    deltaTime: 1 / 60,
    elapsedGameTime: 0,
    elapsedActivityTime: 0,
    activityBugTickInterval: 0,
}

export const setCycle = (key: keyof typeof cycle, value: number) => cycle[key] = value;
export const getCycle = (key: keyof typeof cycle) => cycle[key];

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
    }
}
