import { ErrorData } from '@/engine/services/error';
import { displayError, displayLoading } from '@/render/templates';

//#region EVENTS
//#region LOADING
export const onLoadingDisplay = ({ display }: { display: boolean }) => displayLoading({ display });
//#endregion

//#region ERROR
export const onError = ({ error }: { error: ErrorData }) => displayError({ error });
//#endregion
//#endregion
