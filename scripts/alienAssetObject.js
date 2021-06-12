class AlienAssetObject extends LiveAssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["alien"], textureList["alien"], position, scale, rotate, new AlignedBoxCollision(1, 1,1));
    }
}
