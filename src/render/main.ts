import { onInputKeyDown } from './events';
import { createLoading } from './templates';

export const app = document.getElementById('app')!;

export const main = () => {
    document.addEventListener('keydown', onInputKeyDown);

    createLoading();
};
