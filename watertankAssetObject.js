class WatertankAssetObject extends PickAssetObject {
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["watertank"], textureList["gun"], position, scale, rotate, new AlignedBoxCollision(4, 4, 2));
    }

}