let loadQueue: createjs.LoadQueue;

export type AssetData = {
    id: string;
    src: string;
};

export type AssetManifest = {
    path: string;
    manifest: AssetData[];
};

export type LoadArgs = {
    manifest: AssetManifest;
    onProgress: (event: createjs.ProgressEvent) => void;
    onComplete: () => void;
};

export function init() {
    loadQueue = new createjs.LoadQueue();
}

export function load({ manifest, onProgress, onComplete }: LoadArgs) {
    loadQueue.on("progress", onProgress);
    loadQueue.on("complete", onComplete);
    loadQueue.loadManifest(manifest, true);
}

export function getAsset(key: string) {
    return loadQueue.getResult(key);
}
