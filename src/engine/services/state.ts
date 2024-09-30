const state = {
    isActivityBugInputCooldown: false,
    isActivityBugRunning: false,
    isActivityCraftPlaying: false,
    isActivityCraftRunning: false,
    isActivityCraftSelecting: false,
    isActivityFishFrenzy: false,
    isActivityFishRunning: false,
    isActivityInputCooldown: false,
    isActivityLose: false,
    isActivityRunning: false,
    isActivityWin: false,
    isGameLaunching: false,
    isGameLoading: false,
    isGamePaused: false,
    isGameRunning: false,
    isInputCooldown: false,
    isPlayerDialogOpen: false,
    isPlayerInventoryOpen: false,
    isPlayerInventorySlotSelected: false,
    isQuestActive: false,
    isQuestComplete: false,
    isQuestEnd: false,
    isSettingAudioAllowed: false,
    isSettingEditOpen: false,
};

export const setState = (key: keyof typeof state, value: boolean) => state[key] = value;
export const getState = (key: keyof typeof state) => state[key];
