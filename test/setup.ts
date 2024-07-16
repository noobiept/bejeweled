import { vi } from "vitest";
import * as Preload from "../source/preload";
import { Gem } from "../source/gem";
import { Stage as AppStage } from "../source/stage";

// mock the createjs library
class EventDispatcher {
    on() {}
    off() {}
}

class DisplayObject extends EventDispatcher {
    x = 0;
    y = 0;
}

class Container extends DisplayObject {
    addChild() {}
}

class AbstractLoader extends EventDispatcher {
    getResult() {}
}

class LoadQueue extends AbstractLoader {
    loadManifest() {}
}

class Graphics {
    beginFill() {}
    drawRect() {}
    endFill() {}
}

class Bitmap extends DisplayObject {}

class Shape extends DisplayObject {
    graphics = new Graphics();
}

class Stage extends Container {}

class Ticker extends EventDispatcher {
    RAF = "RAF";
}

const createjs = {
    EventDispatcher,
    DisplayObject,
    Container,
    LoadQueue,
    Bitmap,
    Shape,
    Stage,
    Ticker: new Ticker(),
};

vi.stubGlobal("createjs", createjs);

// init the app
const canvas = {} as HTMLCanvasElement;
const stage = new AppStage(canvas);

Preload.init();
Gem.init(stage);
