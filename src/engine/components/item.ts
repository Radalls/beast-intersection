import { Info } from "./info";
import { Sprite } from "./sprite";

export type Item = {
    _: 'Item';
    _amount: number;
    _maxAmount: number;
    info: Info;
    sprite?: Sprite;
};
