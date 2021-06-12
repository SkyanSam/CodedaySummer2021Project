//////////////
// Each function will draw an object. Call it more and u get more objects

function drawBox(buffers, x, y, z, angle)
{
    modelViewPushMatrix();

    glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [x, y, z]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(angle), [0, 1, 0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxVertexBufferObject);
	// Setting vertecies
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		5 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Setting normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxVertexNormalBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);

	// Setting a texture
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxVertexBufferObject);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT,
	);

	gl.bindTexture(gl.TEXTURE_2D, textureList["crate"]);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.boxIndexBufferObject);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
    gl.drawElements(gl.TRIANGLES, buffers.boxIndicesLength, gl.UNSIGNED_SHORT, 0);
    
    modelViewPopMatrix();
}

function drawHangar(buffers)
{
	/////////////////////////
	// Hangar model

	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 31, 200]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [1, 0, 0]);

	// Vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarNormalsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);

	// Textures
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarTexCoordsVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
		2,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);
	gl.bindTexture(gl.TEXTURE_2D, textureList["concrete"]);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.hangarIndexBuffer);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.drawElements(gl.TRIANGLES, buffers.hangarIndeciesLength, gl.UNSIGNED_SHORT, 0);

	modelViewPopMatrix();
}

function drawHangarFloor(buffers)
{
	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1, 60]);
	//glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [1, 0, 0]);
	glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [140, 0.1, 150]);

	// Vertecies
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorNormalsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);

	// Textures
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorTexCoordsVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
		2,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);
	gl.bindTexture(gl.TEXTURE_2D, textureList["metal"]);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.hangarfloorIndexBuffer);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.drawElements(gl.TRIANGLES, buffers.hangarfloorIndeciesLength, gl.UNSIGNED_SHORT, 0);

	modelViewPopMatrix();
}

function drawGun(buffers, objCamera)
{
	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-4, 2, 0]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(60), [0, 1, 0]);

	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [0, 0, 1]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(90), [1, 0, 0]);
	glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [0.25, 0.25, 0.25]);


	// Vertecies
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.gunVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.gunNormalsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);

	// Textures
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.gunTexCoordsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
		2,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);
	gl.bindTexture(gl.TEXTURE_2D, gunTexture);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.gunIndexBuffer);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.drawElements(gl.TRIANGLES, buffers.gunIndeciesLength, gl.UNSIGNED_SHORT, 0);


	modelViewPopMatrix();
}
