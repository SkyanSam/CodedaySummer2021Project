class AssetObject {
    constructor(model, texture, position, scale, rotate, collision) {
        this.vertexBuffer = null;
        this.normalsBuffer = null;
        this.textureCoordinatesBuffer = null;
        this.indexBuffer = null;
        this.texture = texture;
        this._createBuffers(model);

        this.collision = collision;
        this.position = position;
        this.scale = scale;
        this.rotate = rotate;
    }

    moveX(x) {
        this.position[0] = x;
    }

    moveY(y) {
        this.position[1] = y;
    }

    moveZ(z) {
        this.position[2] = z;
    }

    rotateX(x) {
        this.rotate[0] = x;
    }

    rotateY(y) {
        this.rotate[1] = y;
    }

    rotateZ(z) {
        this.rotate[2] = z;
    }

    checkCollision(asset) {
        if (this.collision && asset.collision) {
            return this.collision.checkCollision(this, asset.collision, asset);
        } else {
            console.warn("Checking collision on asset without collision object!");
        }
    }

    draw(glMatrix, modelViewMatrix) {
        modelViewPushMatrix();
        this._tranformate(glMatrix, modelViewMatrix);
        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(
            SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
            3,										// How many values per iteration
            gl.FLOAT,								// buffer data type
            gl.FALSE,								// don't normalize
            3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
            0										// Offset
        );

        // Normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.vertexAttribPointer(
            SHADER_PROGRAM.aVertexNormalLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            0,
            0,
        );

        // Textures
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.vertexAttribPointer(
            SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
            2,										// How many values per iteration
            gl.FLOAT,								// buffer data type
            gl.FALSE,								// don't normalize
            2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
            0										// Offset
        );
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        setMatrixUniforms(modelViewMatrix, projectionMatrix);
        gl.drawElements(gl.TRIANGLES, this.indicesLength, gl.UNSIGNED_SHORT, 0);

        modelViewPopMatrix();
    }

    _tranformate(glMatrix, modelViewMatrix) {
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, this.position);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.rotate[0]), [1, 0, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.rotate[1]), [0, 1, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.rotate[2]), [0, 0, 1]);
        glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
    }

    _createBuffers(model) {
        const vertices = model.meshes[0].vertices;
        const textureCoordinates = model.meshes[0].texturecoords[0];
        const normals = model.meshes[0].normals;
        const indices = [].concat.apply([], model.meshes[0].faces);
        this.indicesLength = indices.length;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.textureCoordinatesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }

}