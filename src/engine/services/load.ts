import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { event } from '@/render/events';

const spriteFiles = import.meta.glob('/src/assets/sprites/**/*.{png,gif}', { eager: true });
const audioFiles = import.meta.glob('/src/assets/audio/**/*.{mp3,wav,ogg}', { eager: true });
const fontFiles = import.meta.glob('/src/assets/fonts/**/*.{ttf,woff,woff2}', { eager: true });

export type LoadingManager = {
    isLoadingComplete: () => boolean;
    startLoading: () => Promise<boolean>;
}

export const createLoadingManager = () => {
    let isLoading = false;
    let loadingPromise: Promise<boolean> | null = null;

    const startLoading = () => {
        if (isLoading || loadingPromise) return;

        isLoading = true;
        setState('isGameLoading', true);
        event({ type: EventTypes.MAIN_LOADING_ON });

        loadingPromise = preloadAssets().then(success => {
            isLoading = false;
            loadingPromise = null;

            if (success) {
                setState('isGameLoading', false);
                event({ type: EventTypes.MAIN_LOADING_OFF });
            } else {
                event({ type: EventTypes.MAIN_LOADING_ERROR });
            }

            return success;
        });

        return loadingPromise;
    };

    const isLoadingComplete = () => !isLoading && !loadingPromise;

    return {
        isLoadingComplete,
        startLoading,
    } as LoadingManager;
};

const preloadAssets = async (): Promise<boolean> => {
    try {
        const [spritesLoaded, audioLoaded, fontsLoaded] = await Promise.all([
            loadSprites(),
            loadAudio(),
            loadFonts(),
        ]);

        const allLoaded = spritesLoaded && audioLoaded && fontsLoaded;

        if (allLoaded) {
            return true;
        } else {
            console.error('Some assets failed to load');
            return false;
        }
    } catch (error) {
        console.error('Error loading assets:', error);
        return false;
    }
};

const loadSprites = async (): Promise<boolean> => {
    const sprites = Object.entries(spriteFiles).map(([path, module]) => {
        const img = new Image();
        return new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => {
                console.error(`Failed to load sprite: ${path}`);
                resolve(false);
            };
            img.src = (module as { default: string }).default;
        });
    });

    const results = await Promise.all(sprites);
    return results.every(result => result);
};

const loadAudio = async (): Promise<boolean> => {
    const audio = Object.entries(audioFiles).map(([path, module]) => {
        const audio = new Audio();
        return new Promise<boolean>((resolve) => {
            audio.oncanplaythrough = () => resolve(true);
            audio.onerror = () => {
                console.error(`Failed to load audio: ${path}`);
                resolve(false);
            };
            audio.src = (module as { default: string }).default;
            // Preload but don't play
            audio.load();
        });
    });

    const results = await Promise.all(audio);
    return results.every(result => result);
};

const loadFonts = async (): Promise<boolean> => {
    const fonts = Object.entries(fontFiles).map(([path, module]) => {
        const fontName = path.split('/').pop()?.split('.')[0] || 'gameFont';
        const fontUrl = (module as { default: string }).default;

        return new Promise<boolean>((resolve) => {
            const fontFace = new FontFace(fontName, `url(${fontUrl})`);
            fontFace.load()
                .then(loadedFont => {
                    document.fonts.add(loadedFont);
                    resolve(true);
                })
                .catch(error => {
                    console.error(`Failed to load font: ${path}`, error);
                    resolve(false);
                });
        });
    });

    const results = await Promise.all(fonts);
    return results.every(result => result);
};

