////////////
// Vertex and fragement shader and their setup


///
// Vertex shader
///
var vertexShaderSource = 
`
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;       // Used for lighting
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uAmbientColor;             // Used for lighting

uniform vec3 uPointLightingPosition;    // Used for lighting
uniform vec3 uPointLightingColor;         // Used for lighting

uniform bool uUseLighting;          // Used for lighting

varying highp vec2 vTextureCoord;
varying vec3 vLightWeighting;       // Used for lighting

void main()
{
    vTextureCoord = aTextureCoord;

    vec4 mvPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0); 
    gl_Position = uProjectionMatrix * mvPosition;

    if(!uUseLighting)
    {
        vLightWeighting = vec3(1.0, 1.0, 1.0);
    }
    else
    {
        vec3 lightDirection = normalize(uPointLightingPosition - mvPosition.xyz);
        vec3 transformedNormal = uNormalMatrix * aVertexNormal;
        float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
        vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;   

    }

}

`;

///
// Fragment shader
///
var fragmentShaderSource = 
`
precision mediump float;

varying highp vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;

void main()
{
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
}

`;

function initializeShaders()
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) 
    {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) 
    {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
    }

    SHADER_PROGRAM = gl.createProgram();
    gl.attachShader(SHADER_PROGRAM, vertexShader);
    gl.attachShader(SHADER_PROGRAM, fragmentShader);

    gl.linkProgram(SHADER_PROGRAM);
    if (!gl.getProgramParameter(SHADER_PROGRAM, gl.LINK_STATUS)) 
    {
        console.error('ERROR linking SHADER_PROGRAM!', gl.getProgramInfoLog(SHADER_PROGRAM));
    }

    ///
    // Don't include this in the final release
    ///---------------------------------------------------------------

    gl.validateProgram(SHADER_PROGRAM);
    if (!gl.getProgramParameter(SHADER_PROGRAM, gl.VALIDATE_STATUS)) 
    {
		console.error('ERROR validating SHADER_PROGRAM!', gl.getProgramInfoLog(SHADER_PROGRAM));
		return;
    }

    ///--------------------------------------------------------------
    //
    ///

    gl.useProgram(SHADER_PROGRAM);

    SHADER_PROGRAM.aVertexPositionLocation = gl.getAttribLocation(SHADER_PROGRAM, "aVertexPosition");
    SHADER_PROGRAM.aVertexNormalLocation = gl.getAttribLocation(SHADER_PROGRAM, "aVertexNormal");
    SHADER_PROGRAM.aTextureCoordLocation = gl.getAttribLocation(SHADER_PROGRAM, "aTextureCoord");

    gl.enableVertexAttribArray(SHADER_PROGRAM.aVertexPositionLocation);
    gl.enableVertexAttribArray(SHADER_PROGRAM.aVertexNormalLocation);
    gl.enableVertexAttribArray(SHADER_PROGRAM.aTextureCoordLocation);

    SHADER_PROGRAM.uModelViewMatrixLocation = gl.getUniformLocation(SHADER_PROGRAM, "uModelViewMatrix");
    SHADER_PROGRAM.uProjectionMatrixLocation = gl.getUniformLocation(SHADER_PROGRAM, "uProjectionMatrix");
    SHADER_PROGRAM.uNormalMatrixLocation = gl.getUniformLocation(SHADER_PROGRAM, "uNormalMatrix");

    SHADER_PROGRAM.uUseLightingLocation = gl.getUniformLocation(SHADER_PROGRAM, "uUseLighting");
    SHADER_PROGRAM.uAmbientColorLocation = gl.getUniformLocation(SHADER_PROGRAM, "uAmbientColor");
    SHADER_PROGRAM.uPointLightingPositionLocation = gl.getUniformLocation(SHADER_PROGRAM, "uPointLightingPosition");
    SHADER_PROGRAM.uPointLightingColorLocation = gl.getUniformLocation(SHADER_PROGRAM, "uPointLightingColor");

    SHADER_PROGRAM.samplerUniform = gl.getUniformLocation(SHADER_PROGRAM, "uSampler");
}

function setMatrixUniforms(modelViewMatrix, projectionMatrix)
{
    gl.uniformMatrix4fv(SHADER_PROGRAM.uModelViewMatrixLocation, gl.FALSE, modelViewMatrix);
    gl.uniformMatrix4fv(SHADER_PROGRAM.uProjectionMatrixLocation, gl.FALSE, projectionMatrix);

    var normalMatrix = glMatrix.mat3.create();
    glMatrix.mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    glMatrix.mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(SHADER_PROGRAM.uNormalMatrixLocation, false, normalMatrix);

}
