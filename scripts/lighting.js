function useLighting()
{
    gl.uniform1i(SHADER_PROGRAM.uUseLightingLocation, lighting);

    if(lighting)
    {
        gl.uniform3f(
            SHADER_PROGRAM.uAmbientColorLocation,
            0.2,  // R
            0.2,  // G
            0.2,  // B
        );

        gl.uniform3f(
            SHADER_PROGRAM.uPointLightingPositionLocation,
            20, //20
            10,  //5
            -5, //15
        );

        gl.uniform3f(
            SHADER_PROGRAM.uPointLightingColorLocation,
            0.8,
            0.8,
            0.8,
        );

    }

}
