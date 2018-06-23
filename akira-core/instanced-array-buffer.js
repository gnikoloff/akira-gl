import { 
    FLOAT, 
    STATIC_DRAW,
    ARRAY_BUFFER 
} from '../akira-constants'

import { ArrayBuffer } from './array-buffer'

/**
 * Used to associate attribute and it's buffer.
 * It supports instancing to reuse buffer across multiple GPU instances
 * @class 
 * @param {string} name - attrib name
 * @param {Float32Array|Float64Array} array - associated buffer's array
 * @param {number} [size = 2] - size per vertex
 * @param {GLEnum} [type = FLOAT] - type of data
 * @param {boolean} [normalize = false] - should normalize buffer
 * @param {number} [stride = 0] - attrib's stride
 * @param {number} [offset = 0] - attrib's offset
 * @param {GLenum} [mode = STATIC_DRAW] 
 */
export class InstancedArrayBuffer extends ArrayBuffer {
    constructor (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0, mode = STATIC_DRAW) {
        super(name, array, size, type, normalize, stride, offset, mode)
        this.isInstanced = true
    }
    /**
     * Supply ANGLE_instanced_arrays extension from InstancedGeometry class
     * @param {*} ext - Extension
     */
    addInstancingExtension (ext) {
        this._ext = ext
    }
    /**
     * Bind to Vertex Array Object using the ANGLE_instanced_arrays extension.
     */
    bindToVAO () {
        if (this._location === -1) return

        this.bind()
        this._gl.enableVertexAttribArray(this._location)
        this._gl.vertexAttribPointer(
            this._location, 
            this._size, 
            this._type, 
            this._normalize, 
            this._stride, 
            this._offset
        )
        this._ext.vertexAttribDivisorANGLE(this._location, 1)
        this.unbind()
    }
}