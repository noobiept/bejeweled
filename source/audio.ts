const SELECT_KEY = "select";
const COMBINE_KEY = "combine";

export function init() {
    createjs.Sound.registerSound("sounds/select.wav", SELECT_KEY);
    createjs.Sound.registerSound("sounds/combine.wav", COMBINE_KEY);
}

/**
 * When a gem is selected, play a sound.
 */
export function playSelectSound() {
    try {
        createjs.Sound.play(SELECT_KEY);
    } catch {
        // do nothing
    }
}

/**
 * When there's a gem combination, play a sound.
 */
export function playCombineSound() {
    try {
        createjs.Sound.play(COMBINE_KEY);
    } catch {
        // do nothing
    }
}
