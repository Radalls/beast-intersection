import itemRecipes from '../../assets/items/item_recipes.json';

import { createElement, destroyElement } from './template';
import { getElement, checkElement, getSpritePath } from './template.utils';

import {
    ActivityBugData,
    ActivityCraftData,
    ActivityFishData,
    ActivityTypes,
} from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';

//#region CONSTANTS
//#endregion

//#region HELPERS
const checkActivityBugData = (data: any): data is ActivityBugData => data;
const checkActivityFishData = (data: any): data is ActivityFishData => data;
const checkActivityCraftData = (data: any): data is ActivityCraftData => data;
//#endregion

//#region TEMPLATES
//#region MAIN ACTIVITY
export const startActivity = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startActivity.name });

    const activity = createElement({
        elementClass: 'activity',
        elementId: `${activityEntityId}-activity`,
        entityId: activityEntityId,
    });

    const activityCancel = createElement({
        elementAbsolute: false,
        elementClass: 'activity-cancel',
        elementId: `${activityEntityId}-activity-cancel`,
        elementParent: activity,
        entityId: activityEntityId,
    });
    activityCancel.innerText = '❌';
};

export const winActivity = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: winActivity.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });

    const activity = getElement({ elementId: `${activityEntityId}-activity` });
    activity.style.visibility = 'hidden';

    const activityWin = createElement({
        elementClass: 'activity-win',
        elementId: `${activityEntityId}-activity-win`,
        entityId: activityEntityId,
    });

    activityWin.innerText = (resource._activityType === ActivityTypes.CRAFT)
        ? `You crafted a ${resource.item?.info._name} !`
        : `You caught a ${resource.item?.info._name} !`;
};

export const loseActivity = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: loseActivity.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });

    const activity = getElement({ elementId: `${activityEntityId}-activity` });
    activity.style.visibility = 'hidden';

    const activityWin = createElement({
        elementClass: 'activity-win',
        elementId: `${activityEntityId}-activity-win`,
        entityId: activityEntityId,
    });

    activityWin.innerText = (resource._activityType === ActivityTypes.CRAFT)
        ? 'I give up...'
        : 'It got away... ';
};

export const endActivity = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endActivity.name });

    destroyElement({ elementId: `${activityEntityId}-activity` });

    if (checkElement({ elementId: `${activityEntityId}-activity-cancel` })) {
        destroyElement({ elementId: `${activityEntityId}-activity-cancel` });
    }
    if (checkElement({ elementId: `${activityEntityId}-activity-win` })) {
        destroyElement({ elementId: `${activityEntityId}-activity-win` });
    }
};
//#endregion

//#region ACTIVITY BUG
export const startActivityBug = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startActivityBug.name });

    const activityElement = getElement({ elementId: `${activityEntityId}-activity` });

    const activityBug = createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug',
        elementId: `${activityEntityId}-activity-bug`,
        elementParent: activityElement,
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
        elementClass: 'activity-bug-score-label',
        elementId: `${activityEntityId}-activity-bug-score-hp`,
        elementParent: activityBugScore,
        entityId: activityEntityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-bug-score-label',
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

    updateActivityBug();
};

export const updateActivityBug = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: updateActivityBug.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });
    if (!(checkActivityBugData(resource.activityData))) {
        throw error({
            message: 'Activity bug data is not defined',
            where: updateActivityBug.name,
        });
    }
    const activityBugData = resource.activityData;

    const activityBugScoreHp = getElement({ elementId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugScoreHp.innerText = `🦋❤️ ${activityBugData._hp}`;

    const activityBugScoreError = getElement({ elementId: `${activityEntityId}-activity-bug-score-error` });
    activityBugScoreError.innerText = `💔 ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugSymbolValue = getElement({ elementId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugSymbolValue.innerText = `Press ${getActivityBugSymbol({ symbol: activityBugData._symbol }) ?? '...'}`;

    const activityBugSymbolFound = getElement({ elementId: `${activityEntityId}-activity-bug-symbol-found` });
    if (activityBugData._symbolFound === undefined) {
        activityBugSymbolFound.style.backgroundImage
            = `url(${getSpritePath({ spriteName: 'activity_bug_symbol_blank' })})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugSymbolFound.style.backgroundImage
            = `url(${getSpritePath({ spriteName: 'activity_bug_symbol_found' })})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugSymbolFound.style.backgroundImage
            = `url(${getSpritePath({ spriteName: 'activity_bug_symbol_error' })})`;
    }
};

export const endActivityBug = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endActivityBug.name });

    destroyElement({ elementId: `${activityEntityId}-activity-bug` });
};

const getActivityBugSymbol = ({ symbol }: { symbol?: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: getActivityBugSymbol.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (symbol === manager.settings.keys.move._up) {
        return '🡅';
    }
    else if (symbol === manager.settings.keys.move._down) {
        return '🡇';
    }
    else if (symbol === manager.settings.keys.move._left) {
        return '🡄';
    }
    else if (symbol === manager.settings.keys.move._right) {
        return '🡆';
    }

    return symbol;
};
//#endregion

//#region ACTIVITY FISH
export const startActivityFish = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startActivityFish.name });

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
    activityFishHpLabel.innerText = '🐟❤️ ';

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
    activityFishRodTensionLabel.innerText = '🎣💀 ';

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

    // const activityFishFrenzyLabel = createElement({
    //     elementAbsolute: false,
    //     elementClass: 'activity-fish-frenzy-label',
    //     elementId: `${activityEntityId}-activity-fish-frenzy-label`,
    //     elementParent: activityFishFrenzy,
    //     entityId: activityEntityId,
    // });
    // activityFishFrenzyLabel.innerText = 'Frenzy: ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-frenzy-value',
        elementId: `${activityEntityId}-activity-fish-frenzy-value`,
        elementParent: activityFishFrenzy,
        entityId: activityEntityId,
    });

    const activityFishKey = createElement({
        elementAbsolute: false,
        elementClass: 'activity-fish-key',
        elementId: `${activityEntityId}-activity-fish-key`,
        elementParent: activityFish,
        entityId: activityEntityId,
    });
    activityFishKey.innerText = 'Hold 🖐';

    updateActivityFish();
};

export const updateActivityFish = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: updateActivityFish.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });
    if (!(checkActivityFishData(resource.activityData))) {
        throw error({
            message: 'Activity fish data is undefined',
            where: updateActivityFish.name,
        });
    }
    const activityFishData = resource.activityData;

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
        ? `url(${getSpritePath({ spriteName: 'activity_fish_frenzy_on' })})`
        : `url(${getSpritePath({ spriteName: 'activity_fish_frenzy_off' })})`;
};

export const endActivityFish = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endActivityFish.name });

    destroyElement({ elementId: `${activityEntityId}-activity-fish` });
};
//#endregion

//#region ACTIVITY CRAFT
export const startActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startActivityCraft.name });

    const activity = getElement({ elementId: `${activityEntityId}-activity` });

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft',
        elementId: `${activityEntityId}-activity-craft`,
        elementParent: activity,
        entityId: activityEntityId,
    });
};

export const startSelectActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startSelectActivityCraft.name });

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
        activityCraftRecipeIcon.style.backgroundImage
            = `url(${getSpritePath({ spriteName: `item_${itemRecipes[i].name.toLowerCase()}` })})`;

        const activityCraftRecipeName = createElement({
            elementAbsolute: false,
            elementClass: 'activity-craft-recipe-name',
            elementId: `${activityEntityId}-activity-craft-recipe-${i}-name`,
            elementParent: activityCraftRecipe,
            entityId: activityEntityId,
        });
        activityCraftRecipeName.innerText = itemRecipes[i].name;

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
            activityCraftRecipeIngredientIcon.style.backgroundImage
                = `url(${getSpritePath({ spriteName: `item_${itemRecipes[i].ingredients[j].name.toLowerCase()}` })})`;

            const activityCraftRecipeIngredientName = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient-name',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-name`,
                elementParent: activityCraftRecipeIngredient,
                entityId: activityEntityId,
            });
            activityCraftRecipeIngredientName.innerText = itemRecipes[i].ingredients[j].name;

            const activityCraftRecipeIngredientAmount = createElement({
                elementAbsolute: false,
                elementClass: 'activity-craft-recipe-ingredient-amount',
                elementId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-amount`,
                elementParent: activityCraftRecipeIngredient,
                entityId: activityEntityId,
            });
            activityCraftRecipeIngredientAmount.innerText = `x${itemRecipes[i].ingredients[j].amount}`;
        }
    }

    updateSelectActivityCraft();
};

export const updateSelectActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: updateSelectActivityCraft.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });
    if (!(checkActivityCraftData(resource.activityData))) {
        throw error({
            message: 'Activity craft data is undefined',
            where: updateSelectActivityCraft.name,
        });
    }
    const activityCraftData = resource.activityData;

    const activityCraftRecipes = getElement({ elementId: `${activityEntityId}-activity-craft-recipes` });

    for (let i = 0; i < activityCraftRecipes.children.length; i++) {
        const activityCraftRecipe = getElement({ elementId: `${activityEntityId}-activity-craft-recipe-${i}` });
        activityCraftRecipe.style.border = 'solid 4px rgb(70, 70, 70)';
    }

    const selectedActivityCraftRecipe =
        getElement({ elementId: `${activityEntityId}-activity-craft-recipe-${activityCraftData._currentRecipeIndex}` });
    selectedActivityCraftRecipe.style.border = 'solid 4px red';
};

export const endSelectActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endSelectActivityCraft.name });

    destroyElement({ elementId: `${activityEntityId}-activity-craft-recipes` });
};

export const startPlayActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: startPlayActivityCraft.name });

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
    activityCraftProgressLabel.innerText = 'Craft ';

    createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-progress-value',
        elementId: `${activityEntityId}-activity-craft-progress-value`,
        elementParent: activityCraftProgress,
        entityId: activityEntityId,
    });

    const activityCraftKey = createElement({
        elementAbsolute: false,
        elementClass: 'activity-craft-key',
        elementId: `${activityEntityId}-activity-craft-key`,
        elementParent: activityCraft,
        entityId: activityEntityId,
    });
    activityCraftKey.innerText = 'Press 🖐';

    updatePlayActivityCraft();
};

export const updatePlayActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: updatePlayActivityCraft.name });

    const resource = getComponent({ componentId: 'Resource', entityId: activityEntityId });
    if (!(checkActivityCraftData(resource.activityData))) {
        throw error({
            message: 'Activity craft data is undefined',
            where: updatePlayActivityCraft.name,
        });
    }
    const activityCraftData = resource.activityData;

    const activityCraftProgressValue =
        getElement({ elementId: `${activityEntityId}-activity-craft-progress-value` });
    activityCraftProgressValue.innerHTML =
        `<progress value="${activityCraftData._hitCount}" max="${10}"></progress>`;
};

export const endPlayActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endPlayActivityCraft.name });

    destroyElement({ elementId: `${activityEntityId}-activity-craft-progress` });
};

export const endActivityCraft = () => {
    const activityEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined', where: endActivityCraft.name });

    destroyElement({ elementId: `${activityEntityId}-activity-craft` });
};
//#endregion
//#endregion
