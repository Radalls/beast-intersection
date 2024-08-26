import { getState } from '@/engine/state';
import { playAudio, stopAudio } from '@/render/audio';

//#region EVENTS
export const onAudioPlay = ({ audioName, loop = false, volume = 0.5 }: {
    audioName: string,
    loop?: boolean,
    volume?: number
}) => getState('isSettingAudioAllowed') && playAudio({ audioName, loop, volume });

export const onAudioStop = ({ audioName }: { audioName: string }) => stopAudio({ audioName });
//#endregion
