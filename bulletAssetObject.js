class BulletAssetObject extends AssetObject {
    constructor(position, yaw, pitch, scale = 0.1) {
        super(modelList["bullet"], textureList["bullet"], position, [scale, scale, scale], [0, 0, 0], new AlignedBoxCollision(scale * 2, scale * 2, scale * 2));

        this.yaw = yaw;
        this.pitch = pitch;
        this.lastTime = 0;
        this.startTime = new Date().getTime();
    }

    getDamage() {
        return 200 * this.scale[0];
    }

    animate() {
        let timeNow = new Date().getTime();
        if (this.lastTime !== 0) {
            let elapsed = timeNow - this.lastTime;

            this.position[0] -= Math.sin(degToRad(this.yaw)) * gameConfiguration.bulletSpeed * elapsed;
            this.position[1] += Math.sin(degToRad(this.pitch) * gameConfiguration.bulletSpeed * elapsed);
            this.position[2] -= Math.cos(degToRad(this.yaw )) * gameConfiguration.bulletSpeed * elapsed;

        }
        this.lastTime = timeNow;
    }

    draw(glMatrix, modelViewMatrix) {
        if(new Date().getTime() - this.startTime > 100) {
            super.draw(glMatrix, modelViewMatrix);
        }
    }

    checkWorldCollision() {
        return Collision.checkPointToWorldCollision(this.position, gameConfiguration.worldBox.minX, gameConfiguration.worldBox.minY, gameConfiguration.worldBox.minZ,
            gameConfiguration.worldBox.maxX, gameConfiguration.worldBox.maxY, gameConfiguration.worldBox.maxZ);
    }
}