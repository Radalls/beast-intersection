import { ActivityBugData, ActivityCraftData, ActivityFishData, Resource } from '@/engine/components/resource';
import {
    endActivity,
    endActivityBug,
    endActivityCraft,
    endActivityFish,
    endPlayActivityCraft,
    endSelectActivityCraft,
    startActivity,
    startActivityBug,
    startActivityCraft,
    startActivityFish,
    startPlayActivityCraft,
    startSelectActivityCraft,
    updateActivityBug,
    updateActivityFish,
    updatePlayActivityCraft,
    updateSelectActivityCraft,
    winActivity,
} from '@/render/templates';

//#region MAIN ACTIVITY
export const onActivityStart = (
    { activityEntityId }: { activityEntityId: string },
) => startActivity({ activityEntityId });

export const onActivityWin = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => winActivity({ activityEntityId, resource });

export const onActivityEnd = ({ activityEntityId }: { activityEntityId: string }) => endActivity({ activityEntityId });
//#endregion

//#region EVENTS
//#region ACTIVITY BUG
export const onActivityBugStart = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => startActivityBug({ activityBugData, activityEntityId });

export const onActivityBugUpdate = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => updateActivityBug({ activityBugData, activityEntityId });

export const onActivityBugEnd = (
    { activityEntityId }: { activityEntityId: string },
) => endActivityBug({ activityEntityId });
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

export const onActivityFishEnd = (
    { activityEntityId }: { activityEntityId: string },
) => endActivityFish({ activityEntityId });
//#endregion

//#region ACTIVITY CRAFT
export const onActivityCraftStart = (
    { activityEntityId }: { activityEntityId: string },
) => startActivityCraft({ activityEntityId });

export const onActivityCraftSelectStart = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => startSelectActivityCraft({ activityCraftData, activityEntityId });

export const onActivityCraftSelectUpdate = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => updateSelectActivityCraft({ activityCraftData, activityEntityId });

export const onActivityCraftSelectEnd = (
    { activityEntityId }: { activityEntityId: string },
) => endSelectActivityCraft({ activityEntityId });

export const onActivityCraftPlayStart = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => startPlayActivityCraft({ activityCraftData, activityEntityId });

export const onActivityCraftPlayUpdate = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => updatePlayActivityCraft({ activityCraftData, activityEntityId });

export const onActivityCraftPlayEnd = (
    { activityEntityId }: { activityEntityId: string }
) => endPlayActivityCraft({ activityEntityId });

export const onActivityCraftEnd = (
    { activityEntityId }: { activityEntityId: string }
) => endActivityCraft({ activityEntityId });
//#endregion
//#endregion
