import { createElement, destroyElement } from './template';
import { getElement, checkElement, getSpritePath } from './template.utils';

import itemRecipes from '@/assets/items/item_recipes.json';
import { Resource, ActivityBugData, ActivityFishData, ActivityCraftData } from '@/engine/components/resource';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
//#region MAIN ACTIVITY
export const startActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    createElement({
        elementClass: 'activity',
        elementId: `${activityEntityId}-activity`,
        entityId: activityEntityId,
    });
};

export const winActivity = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => {
    const activity = getElement({ elementId: `${activityEntityId}-activity` });
    activity.style.visibility = 'hidden';

    const activityWin = createElement({
        elementClass: 'activity-win',
        elementId: `${activityEntityId}-activity-win`,
        entityId: activityEntityId,
    });

    activityWin.textContent = `You get ${resource.item?.info._name}!`;
};

export const endActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity` });

    if (checkElement({ elementId: `${activityEntityId}-activity-win` })) {
        destroyElement({ elementId: `${activityEntityId}-activity-win` });
    }
};
//#endregion

//#region ACTIVITY BUG
export const startActivityBug = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => {
    const activity = getElement({ elementId: `${activityEntityId}-activity` });

    const activityBug = createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug',
        elementId: `${activityEntityId}-activity-bug`,
        elementParent: activity,
        entityId: activityEntityId,
    });

    const activityBugScore = createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-score',
        elementId: `${activityEntityId}-activity-bug-score`,
        elementParent: activityBug,
        entityId: activityEntityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-score',
        elementId: `${activityEntityId}-activity-bug-score-hp`,
        elementParent: activityBugScore,
        entityId: activityEntityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-score',
        elementId: `${activityEntityId}-activity-bug-score-error`,
        elementParent: activityBugScore,
        entityId: activityEntityId,
    });

    const activityBugSymbol = createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-symbol',
        elementId: `${activityEntityId}-activity-bug-symbol`,
        elementParent: activityBug,
        entityId: activityEntityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-symbol-value',
        elementId: `${activityEntityId}-activity-bug-symbol-value`,
        elementParent: activityBugSymbol,
        entityId: activityEntityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-symbol-found',
        elementId: `${activityEntityId}-activity-bug-symbol-found`,
        elementParent: activityBugSymbol,
        entityId: activityEntityId,
    });

    updateActivityBug({ activityBugData, activityEntityId });
};

export const updateActivityBug = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => {
    const activityBugScoreHp = getElement({ elementId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugScoreHp.textContent = `HP: ${activityBugData._hp}`;

    const activityBugScoreError = getElement({ elementId: `${activityEntityId}-activity-bug-score-error` });
    activityBugScoreError.textContent = `Errors: ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugSymbolValue = getElement({ elementId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugSymbolValue.textContent = `Press: ${activityBugData._symbol ?? '...'}`;

    const activityBugSymbolFound = getElement({ elementId: `${activityEntityId}-activity-bug-symbol-found` });
    if (activityBugData._symbolFound === undefined) {
        activityBugSymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_blank')})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugSymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_found')})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugSymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_error')})`;
    }
};

export const endActivityBug = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity-bug` });
};
//#endregion

//#region ACTIVITY FISH
export const startActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activity = getElement({ elementId: `${activityEntityId}-activity` });

    const activityFish = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish',
        elementId: `${activityEntityId}-activity-fish`,
        elementParent: activity,
        entityId: activityEntityId,
    });

    const activityFishHpBars = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-hp-bars',
        elementId: `${activityEntityId}-activity-fish-hp-bars`,
        elementParent: activityFish,
        entityId: activityEntityId,
    });

    const activityFishHp = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-hp',
        elementId: `${activityEntityId}-activity-fish-hp`,
        elementParent: activityFishHpBars,
        entityId: activityEntityId,
    });

    const activityFishHpLabel = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-hp-label',
        elementId: `${activityEntityId}-activity-fish-hp-label`,
        elementParent: activityFishHp,
        entityId: activityEntityId,
    });
    activityFishHpLabel.textContent = 'Fish HP: ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-hp-value',
        elementId: `${activityEntityId}-activity-fish-hp-value`,
        elementParent: activityFishHp,
        entityId: activityEntityId,
    });

    const activityFishRodTension = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-rod-tension',
        elementId: `${activityEntityId}-activity-fish-rod-tension`,
        elementParent: activityFishHpBars,
        entityId: activityEntityId,
    });

    const activityFishRodTensionLabel = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-rod-tension-label',
        elementId: `${activityEntityId}-activity-fish-rod-tension-label`,
        elementParent: activityFishRodTension,
        entityId: activityEntityId,
    });
    activityFishRodTensionLabel.textContent = 'Rod Tension: ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-rod-tension-value',
        elementId: `${activityEntityId}-activity-fish-rod-tension-value`,
        elementParent: activityFishRodTension,
        entityId: activityEntityId,
    });

    const activityFishFrenzy = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-frenzy',
        elementId: `${activityEntityId}-activity-fish-frenzy`,
        elementParent: activityFish,
        entityId: activityEntityId,
    });

    const activityFishFrenzyLabel = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-frenzy-label',
        elementId: `${activityEntityId}-activity-fish-frenzy-label`,
        elementParent: activityFishFrenzy,
        entityId: activityEntityId,
    });
    activityFishFrenzyLabel.textContent = 'Frenzy: ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-frenzy-value',
        elementId: `${activityEntityId}-activity-fish-frenzy-value`,
        elementParent: activityFishFrenzy,
        entityId: activityEntityId,
    });

    updateActivityFish({ activityEntityId, activityFishData });
};

export const updateActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityFishHpValue =
        getElement({ elementId: `${activityEntityId}-activity-fish-hp-value` });
    activityFishHpValue.innerHTML =
        `<progress value="${activityFishData._fishHp}" max="${activityFishData._fishMaxHp}"></progress>`;

    const activityFishRodTensionValue =
        getElement({ elementId: `${activityEntityId}-activity-fish-rod-tension-value` });
    activityFishRodTensionValue.innerHTML =
        `<progress value="${activityFishData._rodTension}" max="${activityFishData._rodMaxTension}"></progress>`;

    const activityFishFrenzyValue = getElement({ elementId: `${activityEntityId}-activity-fish-frenzy-value` });
    activityFishFrenzyValue.style.backgroundImage = (activityFishData._isFrenzy)
        ? `url(${getSpritePath('activity_fish_frenzy_on')})`
        : `url(${getSpritePath('activity_fish_frenzy_off')})`;
};

export const endActivityFish = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity-fish` });
};
//#endregion

//#region ACTIVITY CRAFT
export const startActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    const activity = getElement({ elementId: `${activityEntityId}-activity` });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft',
        elementId: `${activityEntityId}-activity-craft`,
        elementParent: activity,
        entityId: activityEntityId,
    });
};

export const startSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraft = getElement({ elementId: `${activityEntityId}-activity-craft` });

    const activityCraftRecipes = createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-recipes',
        elementId: `${activityEntityId}-activity-craft-recipes`,
        elementParent: activityCraft,
        entityId: activityEntityId,
    });

    for (let i = 0; i < itemRecipes.length; i++) {
        const activityCraftRecipe = createElement({
            elementAbsolute: false,
            elementClass: 'activity-craft-recipe',
            elementId: `${activityEntityId}-activity-craft-recipe-${i}`,
            elementParent: activityCraftRecipes,
            entityId: activityEntityId,
        });

        const activityCraftRecipeIcon = createElement({
            elementAbsolute: false,
            elementClass: 'activity-craft-recipe-icon',
            elementId: `${activityEntityId}-activity-craft-recipe-${i}-icon`,
            elementParent: activityCraftRecipe,
            entityId: activityEntityId,
        });
        activityCraftRecipeIcon.style.backgroundImage =
            `url(${getSpritePath(`item_${itemRecipes[i].name.toLowerCase()}`)})`;

        const activityCraftRecipeName = createElement({
            elementAbsolute: false,
            elementClass: 'activity-craft-recipe-name',
            elementId: `${activityEntityId}-activity-craft-recipe-${i}-name`,
            elementParent: activityCraftRecipe,
            entityId: activityEntityId,
        });
        activityCraftRecipeName.textContent = itemRecipes[i].name;

        const activityCraftRecipeIngredients = createElement({
            elementAbsolute: false,
            elementClass: 'activity-craft-recipe-ingredients',
            elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredients`,
            elementParent: activityCraftRecipe,
            entityId: activityEntityId,
        });

        for (let j = 0; j < itemRecipes[i].ingredients.length; j++) {
            const activityCraftRecipeIngredient = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}`,
                elementParent: activityCraftRecipeIngredients,
                entityId: activityEntityId,
            });

            const activityCraftRecipeIngredientIcon = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient-icon',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-icon`,
                elementParent: activityCraftRecipeIngredient,
                entityId: activityEntityId,
            });
            activityCraftRecipeIngredientIcon.style.backgroundImage =
                `url(${getSpritePath(`item_${itemRecipes[i].ingredients[j].name.toLowerCase()}`)})`;

            const activityCraftRecipeIngredientName = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient-name',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-name`,
                elementParent: activityCraftRecipeIngredient,
                entityId: activityEntityId,
            });
            activityCraftRecipeIngredientName.textContent = itemRecipes[i].ingredients[j].name;

            const activityCraftRecipeIngredientAmount = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient-amount',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-amount`,
                elementParent: activityCraftRecipeIngredient,
                entityId: activityEntityId,
            });
            activityCraftRecipeIngredientAmount.textContent = `x${itemRecipes[i].ingredients[j].amount}`;
        }
    }

    updateSelectActivityCraft({ activityCraftData, activityEntityId });
};

export const updateSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftRecipes = getElement({ elementId: `${activityEntityId}-activity-craft-recipes` });

    for (let i = 0; i < activityCraftRecipes.children.length; i++) {
        const activityCraftRecipe = getElement({ elementId: `${activityEntityId}-activity-craft-recipe-${i}` });
        activityCraftRecipe.style.border = 'solid 4px rgb(70, 70, 70)';
    }

    const selectedActivityCraftRecipe =
        getElement({ elementId: `${activityEntityId}-activity-craft-recipe-${activityCraftData._currentRecipeIndex}` });
    selectedActivityCraftRecipe.style.border = 'solid 4px red';
};

export const endSelectActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity-craft-recipes` });
};

export const startPlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraft = getElement({ elementId: `${activityEntityId}-activity-craft` });

    const activityCraftProgress = createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-progress',
        elementId: `${activityEntityId}-activity-craft-progress`,
        elementParent: activityCraft,
        entityId: activityEntityId,
    });

    const activityCraftProgressLabel = createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-progress-label',
        elementId: `${activityEntityId}-activity-craft-progress-label`,
        elementParent: activityCraftProgress,
        entityId: activityEntityId,
    });
    activityCraftProgressLabel.textContent = 'Craft: ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-progress-value',
        elementId: `${activityEntityId}-activity-craft-progress-value`,
        elementParent: activityCraftProgress,
        entityId: activityEntityId,
    });

    updatePlayActivityCraft({ activityCraftData, activityEntityId });
};

export const updatePlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftProgressValue =
        getElement({ elementId: `${activityEntityId}-activity-craft-progress-value` });
    activityCraftProgressValue.innerHTML =
        `<progress value="${activityCraftData._hitCount}" max="${10}"></progress>`;
};

export const endPlayActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity-craft-progress` });
};

export const endActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyElement({ elementId: `${activityEntityId}-activity-craft` });
};
//#endregion
//#endregion
