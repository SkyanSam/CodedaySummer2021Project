class Collision {
    constructor() {
    }

    checkCollision(collisionObject) {
        alert("calling abstract method!");
    }

    static _checkVerticalCollision(position1, height1, position2, height2) {
        return height1 / 2 + height2 / 2 > Math.abs(position1[1] - position2[1])
    }

    static _checkPointToCircleCollision(x, z, centerPosition, radius) {
        return Math.sqrt(Math.pow(x - centerPosition[0], 2) + Math.pow(z - centerPosition[2], 2)) < radius;
    }

    static checkPointToWorldCollision(position, xMin, yMin, zMin, xMax, yMax, zMax) {
        return position[0] < xMin || position[0] > xMax || position[1] < yMin || position[1] > yMax || position[2] < zMin || position[2] > zMax;
    }
}

class SATCollision extends Collision {
    //TODO need to implement
}

class AlignedBoxCollision extends Collision {
    constructor(width, height, depth) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    checkCollision(asset, collision, collisionAsset) {
        if (collision instanceof AlignedBoxCollision) {
            if (AlignedBoxCollision._checkBoxToBoxCollision(asset.position, this.width, this.depth, collisionAsset.position, collision.width, collision.depth)) {
                //check up down
                if (Collision._checkVerticalCollision(asset.position, this.height, collisionAsset.position, collision.height)) {
                    return true;
                }
            }
            return false;
        } else if (collision instanceof CylinderCollision) {
            const x = asset.position[0];
            const z = asset.position[2];

            const halfWidth = this.width / 2;
            const halfDepth = this.depth / 2;

            if (Collision._checkPointToCircleCollision(x + halfWidth, z + halfDepth, collisionAsset.position, collision.radius) ||
                Collision._checkPointToCircleCollision(x + halfWidth, z - halfDepth, collisionAsset.position, collision.radius) ||
                Collision._checkPointToCircleCollision(x - halfWidth, z + halfDepth, collisionAsset.position, collision.radius) ||
                Collision._checkPointToCircleCollision(x - halfWidth, z + halfDepth, collisionAsset.position, collision.radius)) {
                //check up down
                if (Collision._checkVerticalCollision(asset.position, this.height, collisionAsset.position, collision.height)) {
                    return true;
                }
            }
            return false;
        } else {
            throw("unsupported collison object!");
        }
    }

    static _checkBoxToBoxCollision(position1, width1, depth1, position2, width2, depth2) {
        // return position1[0] < position2[0] + width2 &&
        //     position1[0] + width1 > position2[0] &&
        //     position1[2] < position2[2] + depth2 &&
        //     position1[2] + depth1 > position2[2];
        if(Math.abs(position1[0] - position2[0]) > (width1 / 2 + width2 / 2)) {
            return false;
        }
        if(Math.abs(position1[2] - position2[2]) > (depth1 / 2 + depth2 / 2)) {
            return false;
        }
        return true;
    }
}

class CylinderCollision extends Collision {
    constructor(radius, height) {
        super();
        this.radius = radius;   // x and z
        this.height = height;   // y (up/down)
    }

    checkCollision(asset, collision, collisionAsset) {
        if (collision instanceof AlignedBoxCollision) {
            return collision.checkCollision(collisionAsset, this, asset)
        } else if (collision instanceof CylinderCollision) {
            return CylinderCollision._checkCircleToCircleCollision(asset.position, this.radius, collisionAsset.position, collision.radius)
        } else {
            console.error("unsupported collision object!" + collision);
        }
    }

    static _checkCircleToCircleCollision(position1, radius1, position2, radius2) {
        return Math.sqrt(Math.pow(position1[0] - position2[0], 2) + Math.pow(position1[2] - position2[2], 2)) < radius1 + radius2;

    }
}