import { onInputKeyDown } from "./event";

export const app = document.getElementById("app")!;

export const TILE_PIXEL_SIZE = 64;

export const main = () => {
    document.addEventListener("keydown", onInputKeyDown);
};
