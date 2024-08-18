const state = {
    isActivityBugCooldown: false,
    isActivityBugRunning: false,
    isActivityCraftPlaying: false,
    isActivityCraftRunning: false,
    isActivityCraftSelecting: false,
    isActivityFishFrenzy: false,
    isActivityFishRunning: false,
    isActivityRunning: false,
    isActivityWin: false,
    isGameRunning: false,
    isInputCooldown: false,
    isPlayerDialogOpen: false,
    isPlayerInventoryOpen: false,
};

export const setState = (key: keyof typeof state, value: boolean) => state[key] = value;
export const getState = (key: keyof typeof state) => state[key];
