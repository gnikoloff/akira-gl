/**
 * Compile a WebGLProgram using supplied vertex and fragment shaders
 * @param {WebGLRenderingContext} gl - WebGL Context
 * @param {GLenum} type - Shader's type constant
 * @param {string} source - Shader's source string
 * @returns {WebGLShader} 
 */

export const makeShader = (gl, type, source) => {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let shaderType = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'
        console.error(
            `Error compiling ${shaderType} shader: 
            ${gl.getShaderInfoLog(shader)}`
        )
        gl.deleteShader(shader)
        
        return
    }

    return shader
}