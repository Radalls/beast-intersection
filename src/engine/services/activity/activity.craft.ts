import { checkActivityId, endActivity, startActivity, winActivity } from "./activity";
import itemRecipes from '../../../assets/items/item_recipes.json';
import { ActivityCraftData, ActivityData } from "../../components/resource";
import { addComponent, getComponent } from "../../entities/entity.manager";
import { error } from "../error";
import { EventInputActionKeys, EventTypes } from "../../event";
import { event } from "../../../render/events/event";
import { getState, setState } from "../../state";
import { removeItemFromInventory } from "../../systems/inventory/inventory";
import { getStore } from "../../store";

//#region HELPERS
const checkActivityCraftData = (activityData: ActivityData): activityData is ActivityCraftData => (activityData as ActivityCraftData)._nbErrors !== undefined;
//#endregion

//#region SERVICES
//#region SELECT
export const startActivityCraft = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: startActivityCraft.name });
    }

    activityCraftData._currentRecipeIndex = 0;
    activityCraftData._nbErrors = 0;
    activityCraftData._hitCount = 0;

    setState('isActivityCraftRunning', true);
    setState('isActivityCraftSelecting', true);

    event({
        type: EventTypes.ACTIVITY_CRAFT_START,
        entityId: activityId,
    });

    event({
        type: EventTypes.ACTIVITY_CRAFT_SELECT_START,
        entityId: activityId,
        data: activityCraftData,
    });
};

export const selectActivityCraftRecipe = ({ activityId, offset }: { activityId?: string | null, offset: 1 | -1 }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: selectActivityCraftRecipe.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: selectActivityCraftRecipe.name });
    }

    if (offset === -1) {
        activityCraftData._currentRecipeIndex = Math.max(0, activityCraftData._currentRecipeIndex - 1);
    }
    else if (offset === 1) {
        activityCraftData._currentRecipeIndex = Math.min(itemRecipes.length - 1, activityCraftData._currentRecipeIndex + 1);
    }

    event({
        type: EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE,
        entityId: activityId,
        data: activityCraftData,
    });
};

export const confirmActivityCraftRecipe = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: confirmActivityCraftRecipe.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: confirmActivityCraftRecipe.name });
    }

    const playerId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmActivityCraftRecipe.name });
    const playerInventory = getComponent({ entityId: playerId, componentId: 'Inventory' });
    const playerInventoryBeforeCraft = { ...playerInventory, slots: [...playerInventory.slots] };

    let playerIsAbleToCraftRecipe = true;
    for (const ingredient of itemRecipes[activityCraftData._currentRecipeIndex].ingredients) {
        const itemAmountRemoved = removeItemFromInventory({
            entityId: playerId,
            itemName: ingredient.name,
            itemAmount: ingredient.amount,
        });

        if (!(itemAmountRemoved)) {
            playerIsAbleToCraftRecipe = false;
            throw error({ message: `Could not remove ${ingredient.amount} ${ingredient.name} from inventory`, where: confirmActivityCraftRecipe.name });
        }
    }

    if (!(playerIsAbleToCraftRecipe)) {
        addComponent({ entityId: playerId, component: playerInventoryBeforeCraft });
        return;
    }

    activityCraftData._currentRecipeId = itemRecipes[activityCraftData._currentRecipeIndex].id;
    activityResource.item = {
        info: { _name: itemRecipes[activityCraftData._currentRecipeIndex].name },
        sprite: { _image: `item_${itemRecipes[activityCraftData._currentRecipeIndex].name.toLowerCase()}.png` },
    }

    setState('isActivityCraftSelecting', false);
    setState('isActivityCraftPlaying', true);

    event({
        type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
        entityId: activityId,
    });

    event({
        type: EventTypes.ACTIVITY_CRAFT_PLAY_START,
        entityId: activityId,
        data: activityCraftData,
    });
};
//#endregion

//#region PLAY
export const playActivityCraft = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    if (symbol !== EventInputActionKeys.ACT) return;

    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: playActivityCraft.name });
    }

    if (activityCraftData._hitCount === undefined) {
        throw error({ message: 'Activity Craft hit count is invalid', where: playActivityCraft.name });
    }

    activityCraftData._hitCount++;

    if (activityCraftData._hitCount >= 10) {
        endActivityCraft({ activityId });
        winActivity({ activityId });
        return;
    }

    event({
        type: EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE,
        entityId: activityId,
        data: activityCraftData,
    });
};

export const endActivityCraft = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ entityId: activityId, componentId: 'Resource' });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: endActivityCraft.name });
    }

    if (getState('isActivityCraftSelecting')) {
        setState('isActivityCraftSelecting', false);

        event({
            type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
            entityId: activityId
        });

        endActivity({ activityId });
        return;
    }
    else if (getState('isActivityCraftPlaying')) {
        setState('isActivityCraftPlaying', false);

        event({
            type: EventTypes.ACTIVITY_CRAFT_PLAY_END,
            entityId: activityId
        });
    }

    setState('isActivityCraftRunning', false);

    event({
        type: EventTypes.ACTIVITY_CRAFT_END,
        entityId: activityId,
    });
};
//#endregion
//#endregion