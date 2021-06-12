
function loadJSONResource(src)
{
    var request = new XMLHttpRequest();
    request.open("GET", src);
    request.onreadystatechange = function () 
    {
      if (request.readyState == 4) 
      {
        handleLoadedResource(JSON.parse(request.responseText));
      }
    }
    request.send();
}

function handleLoadedResource(resourceData)
{
    // Pass the normals into WebGL
    resourceVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, resourceVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(resourceData.vertexNormals), gl.STATIC_DRAW);
    resourceVertexNormalBuffer.itemSize = 3;
    resourceVertexNormalBuffer.numItems = resourceData.vertexNormals.length / 3;

    // Pass the vertex positions into WebGL
    resourceVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, resourceVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(resourceData.vertexPositions), gl.STATIC_DRAW);
    resourceVertexPositionBuffer.itemSize = 3;
    resourceVertexPositionBuffer.numItems = resourceData.vertexPositions.length / 3;

    // Pass the indices into WebGL
    resourceVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resourceVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(resourceData.indices), gl.STATIC_DRAW);
    resourceVertexIndexBuffer.itemSize = 1;
    resourceVertexIndexBuffer.numItems = resourceData.indices.length;
}


