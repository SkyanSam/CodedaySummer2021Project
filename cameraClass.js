/////
// Camera class to handle movement around the scene.

class Camera {
    constructor(position = [0, 0, 0], yaw = 90) {
        this.pitch = 0;
        this.pitchRate = 0;
        this.yaw = yaw;
        this.yawRate = 0;
        this.joggingAngle = 0;
        this.position = position;
        this.speed = 0;
        this.direction = 0;
        this.lastTime = 0;
        this.yVelocity = 0;
        this.onGround = true;
        this.currentlyPressedKeys = {};
        this.collision = new AlignedBoxCollision(4, 2, 4);
    }

    animate() {
        var timeNow = new Date().getTime();
        if (this.lastTime !== 0) {
            var elapsed = timeNow - this.lastTime;

            if (!this.onGround) {
                this.yVelocity += gameConfiguration.gravity;
                this.position[1] -= this.yVelocity;
                if (this.position[1] < 1) {
                    this.position[1] = 1;
                    this.yVelocity = 0;
                    this.onGround = true;
                }
            }
            if (this.speed !== 0) {
                this.position[0] -= Math.sin(degToRad(this.yaw + this.direction)) * this.speed * elapsed;
                this.position[2] -= Math.cos(degToRad(this.yaw + this.direction)) * this.speed * elapsed;
                if (this.onGround) {
                    this.joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
                    this.position[1] = 1 + Math.sin(degToRad(this.joggingAngle)) / 20 + 0.4
                }
            }

            this.yaw += this.yawRate * elapsed;
            this.pitch += this.pitchRate * elapsed;
            console.log("x: " + this.position[0] + " y: " + this.position[1] + " z: " + this.position[2] + "YAW: " + this.yaw + " PITCH: " + this.pitch);
            //reset yaw and pitch rate so it stops when mouse is not moving
            this.yawRate = 0;
            this.pitchRate = 0;
        }
        this.lastTime = timeNow;
    }

    checkCollision(asset) {
        if (asset.collision) {
            let collision = this.collision.checkCollision(this, asset.collision, asset);
            if (!collision) {
                if (this.position[0] > 124 || this.position[0] < -123 || this.position[2] < -21 || this.position[2] > 191) {
                    return true;
                }
            }
            return collision;
        } else {
            console.warn("Checking collision on asset without collision object!");
        }
    }

    moveToCamera(glMatrix, modelViewMatrix) {
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.pitch), [1, 0, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.yaw), [0, 1, 0]);
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-this.position[0], -this.position[1], -this.position[2]]);
    }

    handleMouseMove(event) {
        this.yawRate = -(event.movementX / gameConfiguration.mouseSpeed);
        this.pitchRate = -(event.movementY / gameConfiguration.mouseSpeed);
    }

    handleKeys() {
        this.speed = 0;
        this.direction = 0;

        if (this.currentlyPressedKeys[79]) {
            gameObjects[0].position[2]++;
            this.currentlyPressedKeys[79] = false;
        }
        if (this.currentlyPressedKeys[80]) {
            gameObjects[0].position[2]--;
            this.currentlyPressedKeys[80] = false;
        }

        //dummy way to set direction, could be improved
        if (this.currentlyPressedKeys[87]) {
            // forward
            this.speed = gameConfiguration.runSpeed;

            if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
                // forward left
                this.direction = 45;
            } else if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
                // forward right
                this.direction = -45;
            }
        } else if (this.currentlyPressedKeys[83]) {
            // backward
            this.speed = -gameConfiguration.runSpeed;
            if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
                // backward left
                this.direction = -45;
            }

            if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
                // backward right
                this.direction = 45;
            }
        } else if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
            // left
            this.direction = 90;
            this.speed = gameConfiguration.runSpeed;
        } else if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
            // right
            this.direction = -90;
            this.speed = gameConfiguration.runSpeed;
        }

        if (this.currentlyPressedKeys[37] && !this.currentlyPressedKeys[39]) {
            //left
            this.yawRate = 0.1;
        } else if (this.currentlyPressedKeys[39] && !this.currentlyPressedKeys[37]) {
            //right
            this.yawRate = -0.1;
        }

        if (this.currentlyPressedKeys[38] && !this.currentlyPressedKeys[40]) {
            //up
            this.pitchRate = 0.1;
        } else if (this.currentlyPressedKeys[40] && !this.currentlyPressedKeys[38]) {
            //down
            this.pitchRate = -0.1;
        }

        if (this.currentlyPressedKeys[32]) {
            //jump
            if (this.onGround) {
                this.yVelocity = -gameConfiguration.jumpFactor;
                this.onGround = false;
            }
        } else if (!this.onGround) {
            //end jump
            if (this.yVelocity < -(gameConfiguration.jumpFactor / 2)) {
                this.yVelocity = -(gameConfiguration.jumpFactor / 2);
            }
        }
    }

    handleKeyDown(event) {
        //console.log(event.keyCode);
        this.currentlyPressedKeys[event.keyCode] = true;
    }

    handleKeyUp(event) {
        this.currentlyPressedKeys[event.keyCode] = false;
    }

}