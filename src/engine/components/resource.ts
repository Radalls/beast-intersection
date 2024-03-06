import { Item } from "./inventory";

export type Resource = {
    _: 'Resource',
    _activityType: ActivityTypes,
    _isTemporary: boolean,
    activityData?: ActivityBugData,
    item: Item,
};

export enum ActivityTypes {
    PICKUP = 'PICKUP',
    BUG = 'BUG',
}

export type ActivityData = ActivityBugData;

export type ActivityBugData = {
    _hp: number,
    _maxHp: number,
    _maxNbErrors: number,
    _nbErrors: number,
    _symbol?: string,
    _symbolInterval: number,
    _symbolFound?: boolean,
}
