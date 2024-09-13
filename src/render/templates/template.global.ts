import { createElement } from './template';
import { getElement } from './template.utils';

import { ErrorData } from '@/engine/services/error';

//#region TEMPLATES
//#region LOADING
export const createLoading = () => {
    const loading = createElement({
        elementClass: 'loading',
        elementId: 'Loading',
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'loader',
        elementId: 'LoadingLoader',
        elementParent: loading,
    });
};

export const displayLoading = ({ display }: { display: boolean }) => {
    const loading = getElement({ elementId: 'Loading' });

    if (display) {
        loading.style.display = 'flex';
    }
    else {
        loading.style.display = 'none';
    }
};
//#endregion

//#region ERROR
export const createError = () => {
    createElement({
        elementClass: 'error',
        elementId: 'Error',
    });
};

export const displayError = ({ error }: { error: ErrorData }) => {
    const errorElement = getElement({ elementId: 'Error' });

    errorElement.style.display = 'block';
    errorElement.innerText = `⚠️ ${error.message} ⚠️`;

    setTimeout(() => {
        errorElement.style.display = 'none';
        errorElement.innerText = '';
    }, 3000);
};
//#endregion
//#endregion
