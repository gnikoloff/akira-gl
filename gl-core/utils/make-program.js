/**
 * Compile a WebGLProgram using supplied vertex and fragment shaders
 * @param {WebGLRenderingContext} gl - WebGL Context
 * @param {WebGLShader} vertexShader - compiled vertex shader object
 * @param {WebGLShader} fragmentShader - compiled fragment shader object
 * @returns {WebGLProgram} 
 */

export const makeProgram = (gl, vertexShader, fragmentShader) => {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`)
        return
    }

    return program
}