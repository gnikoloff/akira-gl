import { FLOAT } from '../gl-constants'

export const bindBuffer = (gl, buffer, attribLocation, attribType = FLOAT, itemsPerVert = 2) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    if (!buffer) return
    gl.enableVertexAttribArray(attribLocation)
    gl.vertexAttribPointer(attribLocation, itemsPerVert, attribType, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
}