import { Timer } from "@drk4/utilities";

let CONTAINER: HTMLElement;
let SCORE: HTMLElement;
let HIGH_SCORE: HTMLElement;
let TIMER: Timer;
let ON_END: () => void;

export type GameMenuInitArgs = {
    onRestart: () => void;
    onHelp: () => void;
    onEnd: () => void;
};

/**
 * Initialize the game menu.
 */
export function init({ onRestart, onHelp, onEnd }: GameMenuInitArgs) {
    const container = <HTMLElement>document.querySelector("#GameMenu");

    const restart = <HTMLElement>container.querySelector("#Restart");
    restart.onclick = onRestart;

    const help = <HTMLElement>document.getElementById("Help");
    help.onclick = onHelp;

    SCORE = <HTMLElement>container.querySelector("#Score");
    HIGH_SCORE = <HTMLElement>document.getElementById("HighScore");

    const timerValue = <HTMLElement>container.querySelector("#Timer");

    TIMER = new Timer({
        updateElement: {
            element: timerValue,
        },
    });
    CONTAINER = container;
    ON_END = onEnd;
}

/**
 * Show the game menu.
 */
export function show() {
    CONTAINER.style.visibility = "visible";
}

/**
 * Hide the game menu.
 */
export function hide() {
    CONTAINER.style.visibility = "hidden";
}

/**
 * Update the game menu with the current score.
 */
export function updateScore(score: number) {
    SCORE.innerHTML = score.toString();
}

/**
 * Start the game timer, when the time runs out the game is over.
 */
export function startTimer(startTime: number) {
    TIMER.start({
        startValue: startTime * 1000,
        endValue: 0,
        onEnd: ON_END,
        countDown: true,
    });
}

/**
 * Increase the current value of the count down timer (this happens when a gem combination is made).
 */
export function addToTimer(time: number) {
    TIMER.add(time * 1000);
}

/**
 * Update menu with the current highest score.
 */
export function updateHighScore(score: number) {
    HIGH_SCORE.innerHTML = score.toString();
}
