import { displaySecretBoss, displaySecretPath, displaySecretWin, startSecret } from '../templates/template.secret';

//#region EVENTS
export const onSecretStart = () => startSecret();

export const onSecretBossDisplay = () => displaySecretBoss();

export const onSecretPathDisplay = () => displaySecretPath();

export const onSecretWinDisplay = () => displaySecretWin();
//#endregion
