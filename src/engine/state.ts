const state = {
    isGameRunning: false,
    isInventoryOpen: false,
    isActivityRunning: false,
    isActivityBugRunning: false,
    isActivityBugCooldown: false,
}

export const setState = (key: keyof typeof state, value: boolean) => state[key] = value;
export const getState = (key: keyof typeof state) => state[key];
