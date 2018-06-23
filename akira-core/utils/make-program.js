/**
 * Compile a WebGLProgram using supplied vertex and fragment shaders
 * @param {WebGLRenderingContext} gl - WebGL Context
 * @param {WebGLShader} vertexShader - compiled vertex shader
 * @param {WebGLShader} fragmentShader - compiled fragment shader
 * @returns {WebGLProgram} 
 */

export const makeProgram = (gl, vertexShader, fragmentShader, doValidate = false) => {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`)
        gl.deleteProgram(program)
        return
    }

    if (doValidate) {
        gl.validateProgram(program)
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error(`Error validating program ${gl.getProgramInfoLog(program)}`)
            gl.deleteProgram(program)
            return
        }
    }

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    return program
}