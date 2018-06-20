import { STATIC_DRAW } from '../gl-constants'

export const updateBuffer = (gl, buffer, arrayType, array, mode = STATIC_DRAW) => {
    gl.bindBuffer(arrayType, buffer)
    gl.bufferData(arrayType, array, mode)
    gl.bindBuffer(arrayType, null)
}