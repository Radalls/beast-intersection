import { checkActivityId, endActivity, startActivity, winActivity } from './activity';

import itemRecipes from '@/assets/items/item_recipes.json';
import { ActivityCraftData, ActivityData } from '@/engine/components/resource';
import { addComponent, getComponent } from '@/engine/entities/entity.manager';
import { EventInputActionKeys, EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { getState, setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { removeItemFromInventory } from '@/engine/systems/inventory';
import { event } from '@/render/events';

//#region HELPERS
const checkActivityCraftData = (activityData: ActivityData): activityData is ActivityCraftData =>
    (activityData as ActivityCraftData)._nbErrors !== undefined;
//#endregion

//#region SERVICES
//#region SELECT
export const startActivityCraft = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
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
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_START,
    });

    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_START,
    });
};

export const selectActivityCraftRecipe = ({ activityId, offset }: { activityId?: string | null, offset: 1 | -1 }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
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
        activityCraftData._currentRecipeIndex = Math.min(
            itemRecipes.length - 1,
            activityCraftData._currentRecipeIndex + 1,
        );
    }

    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE,
    });
};

export const confirmActivityCraftRecipe = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: confirmActivityCraftRecipe.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: confirmActivityCraftRecipe.name });
    }

    const playerId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmActivityCraftRecipe.name });
    const playerInventory = getComponent({ componentId: 'Inventory', entityId: playerId });
    const playerInventoryBeforeCraft = { ...playerInventory, slots: [...playerInventory.slots] };

    let playerIsAbleToCraftRecipe = true;
    for (const ingredient of itemRecipes[activityCraftData._currentRecipeIndex].ingredients) {
        const itemAmountRemoved = removeItemFromInventory({
            entityId: playerId,
            itemAmount: ingredient.amount,
            itemName: ingredient.name,
        });

        if (!(itemAmountRemoved)) {
            playerIsAbleToCraftRecipe = false;
            throw error({
                message: `Could not remove ${ingredient.amount} ${ingredient.name} from inventory`,
                where: confirmActivityCraftRecipe.name,
            });
        }
    }

    if (!(playerIsAbleToCraftRecipe)) {
        addComponent({ component: playerInventoryBeforeCraft, entityId: playerId });
        return;
    }

    activityCraftData._currentRecipeId = itemRecipes[activityCraftData._currentRecipeIndex].id;
    activityResource.item = {
        info: { _name: itemRecipes[activityCraftData._currentRecipeIndex].name },
        sprite: { _image: `item_${itemRecipes[activityCraftData._currentRecipeIndex].name.toLowerCase()}` },
    };

    setState('isActivityCraftSelecting', false);
    setState('isActivityCraftPlaying', true);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
    });

    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_PLAY_START,
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

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
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
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE,
    });
};

export const endActivityCraft = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: endActivityCraft.name });
    }

    if (getState('isActivityCraftSelecting')) {
        setState('isActivityCraftSelecting', false);

        event({
            entityId: activityId,
            type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
        });

        endActivity({ activityId });
        return;
    }
    else if (getState('isActivityCraftPlaying')) {
        setState('isActivityCraftPlaying', false);

        event({
            entityId: activityId,
            type: EventTypes.ACTIVITY_CRAFT_PLAY_END,
        });
    }

    setState('isActivityCraftRunning', false);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_END,
    });
};
//#endregion
//#endregion
