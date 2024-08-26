import { error } from '@/engine/services/error';

//#region CONSTANTS
const audioFiles: Record<string, { default: string }>
    = import.meta.glob('../../src/assets/audio/**/*.mp3', { eager: true });

const audios: HTMLAudioElement[] = [];
//#endregion

//#region HELPERS
export const getAudioPath = ({ audioName }: { audioName: string }) => {
    const audioKey = audioName.replace(/^(.*?)(\/[^/]+)?(\.[^./]+)?$/, '$1').split('_')[0];
    const audioPath = `../assets/audio/${audioKey}/${audioName}.mp3`;

    return audioFiles[audioPath].default
        ?? error({ message: `Audio ${audioName} not found`, where: getAudioPath.name });
};

export const randAudio = ({ nb }: { nb: number }) => {
    return Math.floor(Math.random() * nb) + 1;
};
//#endregion

//#region SERVICES
export const createAudio = ({ audioName }: { audioName: string }) => {
    const audio = new Audio(getAudioPath({ audioName }));
    audios.push(audio);
};

export const destroyAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src === audioName)
        ?? error({ message: `Audio ${audioName} not found`, where: destroyAudio.name });

    audio.pause();

    audios.splice(audios.indexOf(audio), 1);
};

export const playAudio = ({ audioName, loop = false, volume = 0.5 }: {
    audioName: string,
    loop?: boolean,
    volume?: number
}) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.currentTime = 0;
    audio.loop = loop;
    audio.volume = volume;

    audio.play();
};

export const pauseAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.pause();
};

export const stopAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.pause();
    audio.currentTime = 0;
};
//#endregion
