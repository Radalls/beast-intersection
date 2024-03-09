const state = {
    isGameRunning: false,
    isInputCooldown: false,
    isInventoryOpen: false,
    isActivityRunning: false,
    isActivityWin: false,
    isActivityBugRunning: false,
    isActivityBugCooldown: false,
    isActivityFishRunning: false,
    isActivityFishFrenzy: false,
}

export const setState = (key: keyof typeof state, value: boolean) => state[key] = value;
export const getState = (key: keyof typeof state) => state[key];
