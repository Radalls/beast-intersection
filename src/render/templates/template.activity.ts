import { Resource, ActivityBugData, ActivityFishData } from "../../engine/components/resource";
import { checkEntity, createEntity, destroyEntity, getEntity, getSpritePath } from "./template";

//#region CONSTANTS
//#endregion

//#region TEMPLATES
//#region MAIN ACTIVITY
export const startActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity`,
        htmlClass: "activity",
    });
}

export const winActivity = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });
    activityEntity.style.visibility = 'hidden';

    const activityEntityWin = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-win`,
        htmlClass: "activity-win",
    });

    activityEntityWin.textContent = `You get ${resource.item.info._name}!`;
}

export const endActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity` });
    if (checkEntity({ entityId: `${activityEntityId}-activity-win` })) {
        destroyEntity({ entityId: `${activityEntityId}-activity-win` });
    }
}
//#endregion

//#region ACTIVITY BUG
export const startActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    const activityBugEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug`,
        htmlClass: "activity-bug",
        htmlParent: activityEntity,
        htmlAbsolute: false,
    });

    const activityBugEntityScore = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-hp`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-error`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    const activityBugEntitySymbol = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol`,
        htmlClass: "activity-bug-symbol",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-value`,
        htmlClass: "activity-bug-symbol-value",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-found`,
        htmlClass: "activity-bug-symbol-found",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    updateActivityBug({ activityEntityId, activityBugData });
};

export const updateActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityBugEntityScoreHp = getEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugEntityScoreHp.textContent = `HP: ${activityBugData._hp}`;

    const activityBugEntityScoreError = getEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    activityBugEntityScoreError.textContent = `Errors: ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugEntitySymbolValue = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugEntitySymbolValue.textContent = `Press: ${activityBugData._symbol ?? '...'}`;

    const activityBugEntitySymbolFound = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-found` });
    if (activityBugData._symbolFound === undefined) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_blank.png')})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_found.png')})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_error.png')})`;
    }
};

export const endActivityBug = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-symbol` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug` });
};
//#endregion

//#region ACTIVITY FISH
export const startActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    const activityFishEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish`,
        htmlClass: "activity-fish",
        htmlParent: activityEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBars = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-bars`,
        htmlClass: "activity-fish-hp-bars",
        htmlParent: activityFishEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsFishHp = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp`,
        htmlClass: "activity-fish-hp",
        htmlParent: activityFishEntityHpBars,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsFishHpLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-label`,
        htmlClass: "activity-fish-hp-label",
        htmlParent: activityFishEntityHpBarsFishHp,
        htmlAbsolute: false,
    });
    activityFishEntityHpBarsFishHpLabel.textContent = "Fish HP: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-value`,
        htmlClass: "activity-fish-hp-value",
        htmlParent: activityFishEntityHpBarsFishHp,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsRodTension = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension`,
        htmlClass: "activity-fish-rod-tension",
        htmlParent: activityFishEntityHpBars,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsRodTensionLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension-label`,
        htmlClass: "activity-fish-rod-tension-label",
        htmlParent: activityFishEntityHpBarsRodTension,
        htmlAbsolute: false,
    });
    activityFishEntityHpBarsRodTensionLabel.textContent = "Rod Tension: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension-value`,
        htmlClass: "activity-fish-rod-tension-value",
        htmlParent: activityFishEntityHpBarsRodTension,
        htmlAbsolute: false,
    });

    const activityFishEntityFrenzy = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy`,
        htmlClass: "activity-fish-frenzy",
        htmlParent: activityFishEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityFrenzyLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy-label`,
        htmlClass: "activity-fish-frenzy-label",
        htmlParent: activityFishEntityFrenzy,
        htmlAbsolute: false,
    });
    activityFishEntityFrenzyLabel.textContent = "Frenzy: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy-value`,
        htmlClass: "activity-fish-frenzy-value",
        htmlParent: activityFishEntityFrenzy,
        htmlAbsolute: false,
    });

    updateActivityFish({ activityEntityId, activityFishData });
};

export const updateActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityFishEntityHpBarsFishHpValue = getEntity({ entityId: `${activityEntityId}-activity-fish-hp-value` });
    activityFishEntityHpBarsFishHpValue.innerHTML = `<progress value="${activityFishData._fishHp}" max="${activityFishData._fishMaxHp}"></progress>`;

    const activityFishEntityHpBarsRodTensionValue = getEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension-value` });
    activityFishEntityHpBarsRodTensionValue.innerHTML = `<progress value="${activityFishData._rodTension}" max="${activityFishData._rodMaxTension}"></progress>`;

    const activityFishEntityFrenzyValue = getEntity({ entityId: `${activityEntityId}-activity-fish-frenzy-value` });
    activityFishEntityFrenzyValue.style.backgroundImage = (activityFishData._isFrenzy)
        ? `url(${getSpritePath('activity_fish_frenzy_on.png')})`
        : `url(${getSpritePath('activity_fish_frenzy_off.png')})`;
};

export const endActivityFish = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-frenzy-value` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-frenzy-label` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-frenzy` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension-value` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension-label` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-hp-value` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-hp-label` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-hp` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish-hp-bars` });
    destroyEntity({ entityId: `${activityEntityId}-activity-fish` });
};
//#endregion
//#endregion
