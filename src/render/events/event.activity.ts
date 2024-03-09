import { ActivityBugData, ActivityFishData, Resource } from "../../engine/components/resource";
import { startActivity, winActivity, endActivity, startActivityBug, updateActivityBug, endActivityBug, endActivityFish, startActivityFish, updateActivityFish } from "../templates/template.activity";

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
//#endregion
