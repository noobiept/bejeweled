export interface GemChain {
    line: number;
    column: number;
    size: number;
}

export enum GemType {
    green_gem,
    blue_gem,
    gray_gem,
    purple_gem,
    yellow_gem,
    red_gem,
    orange_gem,
}

export enum GemAction {
    move,
    remove,
}
