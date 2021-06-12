///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var message = document.getElementById("message");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;
var lighting = true;

// Matrices
var modelViewMatrixStack = [];
var modelViewMatrix = new Float32Array(16);
var projectionMatrix = new Float32Array(16);

// Loading models
var modelList = {};
var textureList = {};

// Camera
var objCamera = null; //initialized in main
var warpGate = null; //initialized in main

// Game Objects
var staticGameObjects = [];
var gameObjects = [];
var bulletObjects = [];

// Game configuration
var gameConfiguration = {
    mouseSpeed: 100, // between 50 and 150
    gravity: 0.005, // gravity for jumping
    jumpFactor: 0.2, // jump factor (press half factor is used, long press up to this factor is used)
    runSpeed: 0.012, //character speed
    bulletSpeed: 0.09,
    worldBox: {
        minX: -150,
        minY: -2,
        minZ: -100,
        maxX: 140,
        maxY: 50,
        maxZ: 220,
    }
};

// Game variables
var mousePressTime = 0;
var gameStop = false;
///
//
///

/*************************/
/******** DRAWING ********/
/*************************/
///////////////////
// Loading models from JSON files and textures.
function initializeResources() {
    // initTextures2();
    const assets = [
        {name: "hangar", file: "hangar.json"},
        {name: "floor", file: "hangarfloor.json"},
        {name: "gun", file: "gun.json"},
        {name: "box", file: "box.json"},
        {name: "alien", file: "alien.json"},
        {name: "watertank", file: "watertank.json"},
        {name: "warpgate", file: "warpgate.json"},
        {name: "bullet", file: "bullet.json"},
        {name: "gun2", file: "ak47.json"},
    ];

    const textures = [
        {name: "crate", file: "box.png"},
        {name: "redWall", file: "wall.png"},
        {name: "glowingFloor", file: "floor.png"},
        {name: "gun", file: "guntexture.png"},
        {name: "alien", file: "alientexture.png"},
        {name: "warpgate", file: "warpgatetexture.png"},
        {name: "bullet", file: "guntexture.png"},
        {name: "gun2", file: "T_INS_Body_n.tga.png"}
    ];

    let loaded = assets.length + textures.length;

    const runMain = function () {
        if (--loaded === 0) {
            try {
                main();
            } catch (e) {
                console.error("Fatal error ", e);
                alert("Error in game!");
            }
        }
    };

    for (let i = 0; i < textures.length; i++) {
        let texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            runMain();
        };
        texture.image.src = "./assets/" + textures[i].file;
        textureList[textures[i].name] = texture;
    }

    for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        loadJSONResource(asset.name, "./assets/" + asset.file, function (modelErr, modelObj, name) {
            if (modelErr) {
                alert("Fatal error getting " + name + "model!");
            } else {
                modelList[name] = modelObj;
                runMain();
            }
        });
    }
}

// Initialize WebGL or experimental WebGL
function initializeWebGL(canvas) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    if (!gl) {
        alert("Error! Your browser may not support WebGL.");
    }
    return gl;
}

// This function is called every frame.
function drawScene(objCamera) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.53, 0.81, 0.8, 0.98);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    glMatrix.mat4.perspective(projectionMatrix, 45 * (Math.PI / 180), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);

    useLighting();

    glMatrix.mat4.identity(modelViewMatrix);

    objCamera.moveToCamera(glMatrix, modelViewMatrix);

    for (let i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].draw(glMatrix, modelViewMatrix);
    }
    for (let i = 0; i < this.staticGameObjects.length; i++) {
        this.staticGameObjects[i].draw(glMatrix, modelViewMatrix);
    }
    for (let i = 0; i < this.bulletObjects.length; i++) {
        this.bulletObjects[i].draw(glMatrix, modelViewMatrix);
    }

}


/*************************/
/********* EVENTS ********/

/*************************/
function onResize() {
    //fix canvas width and height to fit document body
    this.canvas.width = document.body.clientWidth; //document.width is obsolete
    this.canvas.height = document.body.clientHeight; //document.height is obsolete
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

function mouseDown(event) {
    console.log("mouse down");
    // if canvas is not locking mouse pointer we lock it otherwise we trigger mouse down action
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        mousePressTime = new Date().getTime();
    } else {
        // lock mouse pointer on canvas
        // noinspection JSUnresolvedFunction
        canvas.requestPointerLock();
    }
}
function mouseUp(event) {
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        mousePressTime = 0;
        const cameraPosition = objCamera.position;

        let x = cameraPosition[0];
        let y = cameraPosition[1];
        let z = cameraPosition[2];
        let factor = 0.5;

        x -= Math.sin(degToRad(objCamera.yaw - 90)) * factor;
        z -= Math.cos(degToRad(objCamera.yaw - 90)) * factor;
        y -= factor;
        //
        // //forward
        // x -= Math.sin(degToRad(objCamera.yaw)) * 6;
        // z -= Math.cos(degToRad(objCamera.yaw)) * 6;
        // //right
        // x -= Math.sin(degToRad(objCamera.yaw - 90)) * 1.7;
        // z -= Math.cos(degToRad(objCamera.yaw - 90)) * 1.7;
        // //down
        // y -= 0.5;

        let damage = Math.max(parseFloat(document.documentElement.style.getPropertyValue('--bullet-size')), 0.1);

        bulletObjects.push(new BulletAssetObject([x, y, z], objCamera.yaw-10, objCamera.pitch, damage));
        document.documentElement.style.setProperty('--bullet-size', '0');
    }
}

function mouseMove(event) {
    objCamera.handleMouseMove(event);
}

function pointerLockChange(event) {
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        console.log("lock pointer change to locked");
        window.__mouseMoveEvent = mouseMove.bind(this); //we need to store bound mouse event so we can remove it later
        canvas.addEventListener('mousemove', window.__mouseMoveEvent, false);
    } else {
        console.log("lock pointer change to released");
        canvas.removeEventListener('mousemove', window.__mouseMoveEvent, false);
    }
}

function onAssetDeath(event) {
    console.error("ASSET DEATH");
    let asset = event.detail;
    let i, length = gameObjects.length;
    for(i = length - 1; i >= 0; i--) {
        if(gameObjects[i] === asset) {
            gameObjects.splice(i, 1);
            break;
        }
    }
}

function onBulletCollision(source, target) {
    console.warn("shot collided");
    if(source instanceof BulletAssetObject && target instanceof LiveAssetObject) {
        let i, length = bulletObjects.length;
        for(i = length - 1; i >= 0; i--) {
            if(bulletObjects[i] === source) {
                bulletObjects.splice(i, 1);
                break;
            }
        }
        target.hit(source.getDamage());
    }
}

function onAssetPick(asset) {
    console.error("asset picked");
    LiveAssetObject.triggerDeathEvent(asset);
    document.documentElement.style.setProperty('--key-picked', 'block')
}

function onPortalEnter(asset) {
    if(document.documentElement.style.getPropertyValue('--key-picked') === 'block') {
        let finish = true;
        for(let i=0; i<gameObjects.length; i++) {
            if(gameObjects[i] instanceof AlienAssetObject) {
                finish = false;
                break;
            }
        }
        if(finish) {
            gameStop = true;
            setMessage("Done");
            document.documentElement.style.setProperty('--end-slide', '0');
        } else {
            setMessage("You need to kill al of the friendly aliens!");
        }
    } else {
        setMessage("You need to find the fuel!");
    }
}

/*************************/
/********** MAIN *********/
/*************************/

function setMessage(text) {
    message.innerHTML = text;
    setTimeout(function () {
        message.innerHTML = "";
    }, 5000);
}

// Main function where the functions are called.
function main() {
    onResize();

    if (gl) {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
    }

    initializeShaders();

    objCamera = new Camera([110, 1, 28]);

    let gun = new GunAssetObject(objCamera, [-0.1, -0.8, 3], [0.25, 0.25, 0.25], [0, -98, -90]);

    this.staticGameObjects.push(gun);
    this.staticGameObjects.push(new HangarAssetObject([0, 31, 200], [1, 1, 1], [-90, 0, 0]));
    this.staticGameObjects.push(new FloorAssetObject([0, -1, 60], [140, 0.1, 150]));


    // Medium boxes
    this.gameObjects.push(new BoxAssetObject([102, 0.6, 25], [1.5, 1.5, 1.5], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([12, 0.6, -16], [1.5, 1.5, 1.5], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([6, 0.6, -16], [1.5, 1.5, 1.5], [0, 0, 0]));

    // Small boxes
    this.gameObjects.push(new BoxAssetObject([110, 2.1, 4], [1, 1, 1], [0, 37, 0]));
    this.gameObjects.push(new BoxAssetObject([110, 0.1, 4], [1, 1, 1], [0, 0, 0]));

    // Big boxes
    this.gameObjects.push(new BoxAssetObject([96, 3.1, 27], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([50, 3.1, -13], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([29, 3.1, 17], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-107, 3.1, -16], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([115, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-5, 3.1, 36], [4, 4, 4], [0, 0, 0]));

    this.gameObjects.push(new BoxAssetObject([-76, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-66, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-56, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-46, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-38, 3.1, -12], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-76, 11.2, -12], [4, 4, 4], [0, 30, 0]));
    this.gameObjects.push(new BoxAssetObject([-56, 11.2, -12], [4, 4, 4], [0, 60, 0]));
    this.gameObjects.push(new BoxAssetObject([-46, 11.2, -12], [4, 4, 4], [0, 15, 0]));
    this.gameObjects.push(new BoxAssetObject([-70, 3.1, -3], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-46, 3.1, -2], [4, 4, 4], [0, 0, 0]));

    this.gameObjects.push(new BoxAssetObject([-50, 3.1, 67], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-116, 3.1, 39], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([10, 3.1, 49], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([38, 3.1, 66], [4, 4, 4], [0, 0, 0]));

    // Aliens
    this.gameObjects.push(new AlienAssetObject([15, 5, 26], [1, 1, 1], [-90, 0, 90]));

    this.gameObjects.push(new AlienAssetObject([-12, 5, 37], [1, 1, 1], [-90, 0, 180]));
    this.gameObjects.push(new AlienAssetObject([-105, 5, 28], [1, 1, 1], [-90, 0, -90]));
    this.gameObjects.push(new AlienAssetObject([47, 5, 58], [1, 1, 1], [-90, 0, -90]));
    this.gameObjects.push(new AlienAssetObject([34, 5, 168], [1, 1, 1], [-90, 0, 120]));
    this.gameObjects.push(new AlienAssetObject([-41, 5, 154], [1, 1, 1], [-90, 0, 120]));
    this.gameObjects.push(new AlienAssetObject([-60, 5, 5], [1, 1, 1], [-90, 0, 45]));

    // Walls
    this.gameObjects.push(new WallAssetObject([90, 0, 37], [90, 53, 5], [0, 0, 0]));
    this.gameObjects.push(new WallAssetObject([-40, 0, 77], [110, 53, 5], [0, 0, 0]));
    this.gameObjects.push(new WallAssetObject([31, 0, -7], [14, 53, 20], [0, 0, 0]));
    this.gameObjects.push(new WallAssetObject([109, 0, 141], [24, 53, 30], [0, 0, 0]));
    this.gameObjects.push(new WallAssetObject([-92, 0, 9], [8, 53, 40], [0, 0, 0]));

    // Other
    warpGate = new WarpgateAssetObject([-26, 23, 185], [20, 20, 20], [0, 180, 0]);
    this.gameObjects.push(warpGate);
    this.gameObjects.push(new WatertankAssetObject([-116, -1, -19], [1, 1, 1], [-90, 0, 90]));


    document.onkeydown = function (event) {
        objCamera.handleKeyDown(event)
    };
    document.onkeyup = function (event) {
        objCamera.handleKeyUp(event)
    };
    canvas.onmousedown = mouseDown.bind(this);
    canvas.onmouseup = mouseUp.bind(this);
    canvas.addEventListener('death-event', onAssetDeath.bind(this), false);
    document.addEventListener('pointerlockchange', pointerLockChange.bind(this), false);


    setInterval(function () {
        if (!gameStop) {
            requestAnimationFrame(function () {
                let x = objCamera.position[0];
                let y = objCamera.position[1];
                let z = objCamera.position[2];

                objCamera.animate();
                warpGate.animate();

                let i, j;

                let length = bulletObjects.length;
                for (i = length - 1; i >= 0; i--) {
                    bulletObjects[i].animate();
                    if(bulletObjects[i].checkWorldCollision()) {
                        bulletObjects.splice(i, 1);
                    }
                }

                for (i = 0; i < gameObjects.length; i++) {
                    if (objCamera.checkCollision(gameObjects[i])) {
                        objCamera.position[0] = x;
                        objCamera.position[1] = y;
                        objCamera.position[2] = z;
                        console.log("collision detected " + i);
                        if(gameObjects[i] instanceof PickAssetObject) {
                            onAssetPick(gameObjects[i]);
                        } else if(gameObjects[i] instanceof WarpgateAssetObject) {
                            onPortalEnter(gameObjects[i]);
                        }
                    }
                    for (j = 0; j < bulletObjects.length; j++) {
                        if (bulletObjects[j].checkCollision(gameObjects[i])) {
                            onBulletCollision(bulletObjects[j], gameObjects[i]);
                        }
                    }
                }

                if(mousePressTime !== 0) {
                    const duration = new Date().getTime() - mousePressTime;
                    let damage = Math.min(Math.max(duration - 500, 0), 3000); //between 1000 and 5000
                    damage = damage / 3000;

                    document.documentElement.style.setProperty('--bullet-size', damage + '');
                }
            });

            objCamera.handleKeys();
            drawScene(objCamera);
        }

    }, 15);
}