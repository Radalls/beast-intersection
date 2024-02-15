import { onInputKeyDown } from "./event";

export const app = document.getElementById("app")!;

export const main = () => {
    document.addEventListener("keydown", onInputKeyDown);
};
