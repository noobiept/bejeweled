let SELECT_SOUND: HTMLAudioElement;
let COMBINE_SOUND: HTMLAudioElement;

export function init() {
    SELECT_SOUND = new Audio("sounds/select.wav");
    SELECT_SOUND.load();
    COMBINE_SOUND = new Audio("sounds/combine.wav");
    COMBINE_SOUND.load();
}

/**
 * When a gem is selected, play a sound.
 */
export function playSelectSound() {
    SELECT_SOUND.currentTime = 0;
    SELECT_SOUND.play().catch(() => {
        // do nothing
    });
}

/**
 * When there's a gem combination, play a sound.
 */
export function playCombineSound() {
    COMBINE_SOUND.currentTime = 0;
    COMBINE_SOUND.play().catch(() => {
        // do nothing
    });
}
