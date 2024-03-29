const state = {
    isGameRunning: false,
    isInputCooldown: false,
    isPlayerInventoryOpen: false,
    isPlayerDialogOpen: false,
    isActivityRunning: false,
    isActivityWin: false,
    isActivityBugRunning: false,
    isActivityBugCooldown: false,
    isActivityFishRunning: false,
    isActivityFishFrenzy: false,
    isActivityCraftRunning: false,
    isActivityCraftSelecting: false,
    isActivityCraftPlaying: false,
}

export const setState = (key: keyof typeof state, value: boolean) => state[key] = value;
export const getState = (key: keyof typeof state) => state[key];
