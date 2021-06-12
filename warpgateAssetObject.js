class WarpgateAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["warpgate"], textureList["warpgate"], position, scale, rotate, new AlignedBoxCollision(20, 100,20));
        this.lastTime = 0;
    }

    animate() {
        let timeNow = new Date().getTime();
        if (this.lastTime !== 0) {
            let elapsed = timeNow - this.lastTime;
            this.rotate[2] = this.rotate[2] - elapsed * 0.01;
        }
        this.lastTime = timeNow;
    }
}