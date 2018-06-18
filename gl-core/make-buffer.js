import { STATIC_DRAW } from '../gl-constants'

export const makeBuffer = (gl, arrayType, array, mode = STATIC_DRAW) => {
    
    const buffer = gl.createBuffer()
    gl.bindBuffer(arrayType, buffer)
    gl.bufferData(arrayType, array, mode)
    
    return buffer
}