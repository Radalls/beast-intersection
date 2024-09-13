import { createElement } from './template';
import { getElement, getSpritePath } from './template.utils';

//#region TEMPLATES
export const startSecret = () => {
    const secretPath = createElement({
        elementClass: 'secret-path',
        elementId: 'SecretPath',
    });
    secretPath.style.backgroundImage = `url(${getSpritePath({ spriteName: 'secret_path' })})`;

    const secretWin = createElement({
        elementClass: 'secret-win',
        elementId: 'SecretWin',
    });
    secretWin.style.backgroundImage = `url(${getSpritePath({ gif: true, spriteName: 'secret_win' })})`;
};

export const displaySecretPath = () => {
    const secretPath = getElement({ elementId: 'SecretPath' });
    secretPath.style.display = (secretPath.style.display === 'block') ? 'none' : 'block';
};

export const displaySecretWin = () => {
    const secretWin = getElement({ elementId: 'SecretWin' });
    secretWin.style.display = (secretWin.style.display === 'block') ? 'none' : 'block';
};
//#endregion
