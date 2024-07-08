let loadQueue: createjs.LoadQueue;

export type AssetData = {
    id: string;
    src: string;
};

export type AssetManifest = {
    path: string;
    manifest: AssetData[];
};

export function init() {
    loadQueue = new createjs.LoadQueue();
}

export function load(manifest: AssetManifest, onProgress, onComplete) {
    loadQueue.on("progress", onProgress);
    loadQueue.on("complete", onComplete);
    loadQueue.loadManifest(manifest, true);
}

export function getAsset(key: string) {
    return loadQueue.getResult(key);
}
