class FloorAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["floor"], textureList["glowingFloor"], position, scale, rotate);
    }

}
