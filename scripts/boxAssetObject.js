class BoxAssetObject extends LiveAssetObject {
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["box"], textureList["crate"], position, scale, rotate, new AlignedBoxCollision(scale[0] * 2, scale[1] * 2, scale[2] * 2), 100000 * scale[0] * scale[0] * scale[0]);
    }
}
