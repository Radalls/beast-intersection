import { ActivityBugData, ActivityCraftData, ActivityFishData, Resource } from "../../engine/components/resource";
import { startActivity, winActivity, endActivity, startActivityBug, updateActivityBug, endActivityBug, endActivityFish, startActivityFish, updateActivityFish, startActivityCraft, startSelectActivityCraft, updateSelectActivityCraft, endSelectActivityCraft, startPlayActivityCraft, updatePlayActivityCraft, endPlayActivityCraft, endActivityCraft } from "../templates/template.activity";

//#region MAIN ACTIVITY
export const onActivityStart = ({ activityEntityId }: { activityEntityId: string }) => startActivity({ activityEntityId });

export const onActivityWin = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => winActivity({ activityEntityId, resource });

export const onActivityEnd = ({ activityEntityId }: { activityEntityId: string }) => endActivity({ activityEntityId });
//#endregion

//#region EVENTS
//#region ACTIVITY BUG
export const onActivityBugStart = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => startActivityBug({ activityEntityId, activityBugData });

export const onActivityBugUpdate = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => updateActivityBug({ activityEntityId, activityBugData });

export const onActivityBugEnd = ({ activityEntityId }: { activityEntityId: string }) => endActivityBug({ activityEntityId });
//#endregion

//#region ACTIVITY FISH
export const onActivityFishStart = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => startActivityFish({ activityEntityId, activityFishData });

export const onActivityFishUpdate = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => updateActivityFish({ activityEntityId, activityFishData });

export const onActivityFishEnd = ({ activityEntityId }: { activityEntityId: string }) => endActivityFish({ activityEntityId });
//#endregion

//#region ACTIVITY CRAFT
export const onActivityCraftStart = ({ activityEntityId }: { activityEntityId: string }) => startActivityCraft({ activityEntityId });

export const onActivityCraftSelectStart = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => startSelectActivityCraft({ activityEntityId, activityCraftData });

export const onActivityCraftSelectUpdate = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => updateSelectActivityCraft({ activityEntityId, activityCraftData });

export const onActivityCraftSelectEnd = ({ activityEntityId }: { activityEntityId: string }) => endSelectActivityCraft({ activityEntityId });

export const onActivityCraftPlayStart = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => startPlayActivityCraft({ activityEntityId, activityCraftData });

export const onActivityCraftPlayUpdate = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => updatePlayActivityCraft({ activityEntityId, activityCraftData });

export const onActivityCraftPlayEnd = ({ activityEntityId }: { activityEntityId: string }) => endPlayActivityCraft({ activityEntityId });

export const onActivityCraftEnd = ({ activityEntityId }: { activityEntityId: string }) => endActivityCraft({ activityEntityId });
//#endregion
//#endregion
