import { displayLoading } from '@/render/templates';

//#region EVENTS
export const onLoadingDisplay = ({ display }: { display: boolean }) => displayLoading({ display });
//#endregion
