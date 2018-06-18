export const makeShader = (gl, type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const shaderType = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'
        console.error(
            `Error compiling ${shaderType} shader: 
            ${gl.getShaderInfoLog(shader)}`
        )
        return
    }
    return shader
}