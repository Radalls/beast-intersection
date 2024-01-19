import { Info } from "./info";
import { Sprite } from "./sprite";

export type Item = {
    _: 'Item';
    info: Info;
    sprite?: Sprite;
};
