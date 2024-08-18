import { Item } from "./inventory";

export type Resource = {
    _: 'Resource',
    _activityType: ActivityTypes,
    _isTemporary: boolean,
    activityData?: ActivityData,
    item?: Item,
};

export enum ActivityTypes {
    ITEM = 'ITEM',
    BUG = 'BUG',
    FISH = 'FISH',
    CRAFT = 'CRAFT',
}

export type ActivityData = ActivityBugData | ActivityFishData | ActivityCraftData;

export type ActivityBugData = {
    _hp: number,
    _maxHp: number,
    _maxNbErrors: number,
    _nbErrors: number,
    _symbol?: string,
    _symbolInterval: number,
    _symbolFound?: boolean,
}

export type ActivityFishData = {
    _fishDamage: number,
    _fishHp: number,
    _fishMaxHp: number,
    _frenzyDuration: number,
    _frenzyInterval: number,
    _isFrenzy?: boolean,
    _rodDamage: number,
    _rodTension: number,
    _rodMaxTension: number,
}

export type ActivityCraftData = {
    _currentRecipeIndex?: number,
    _nbErrors: number,
    _maxNbErrors: number,
    _currentRecipeId?: number,
    _hitCount?: number,
}
