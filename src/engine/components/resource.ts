import { Item } from "./inventory";

export type Resource = {
    _: 'Resource',
    _isTemporary: boolean,
    item: Item,
};
