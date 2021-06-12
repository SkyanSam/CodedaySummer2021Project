class GunAssetObject extends AssetObject{
    constructor(camera, position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["gun2"], textureList["gun2"], position, scale, rotate);
        this.camera = camera;
    }

    _tranformate(glMatrix, modelViewMatrix) {
        //move gun to camera center
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [this.camera.position[0], this.camera.position[1], this.camera.position[2]]);
        //rotate gun to straight position
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [0, 1, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [0, 0, 1]);
        //rotate gun based on yaw and pitch
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(180-this.camera.yaw), [1, 0, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.camera.pitch), [0, 0, 1]);
        //scale gun to its proportions
        glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
        //rotate a little so it will point more straight when moved aside
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(10), [1, 0, 0]);
        //move gun out of center of camera (up/down, in/out, left/right)
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [3, 12, 2]);
    }
}
