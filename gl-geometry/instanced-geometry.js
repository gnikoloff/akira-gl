import { FLOAT } from '../gl-constants'

import { Geometry } from './geometry'
import { InstancedArrayBuffer } from '../gl-core'
import { getWebGLExtension } from '../gl-core'

/**
 * Instanced Geometry class for gpu instancing
 * @class
 * @param {number} instanceCount - how many instances to draw 
 * @param {Array} buffers
 */

export class InstancedGeometry extends Geometry {
    constructor (instanceCount, buffers = []) {
        super(buffers)
        this.instanceCount = instanceCount
        this.isInstanced = true
        this.buffers = buffers
    }

    /**
     * Initialize geometry and get ANGLE_instanced_arrays extension
     * @param {WebGLRenderingContext} gl 
     * @param {GLenum} drawOperation 
     */

    init (gl, drawOperation) {
        this._ext = getWebGLExtension(gl, 'ANGLE_instanced_arrays')
        this.buffers.forEach(buffer => {
            if (buffer.isInstanced) {
                buffer.addInstancingExtension(this._ext)
            }
        })
        super.init(gl, drawOperation)
    }

    /**
     * Adds instanced  attribute and associated buffer with it
     * @param {string} name - attrib name
     * @param {Float32Array|Float64Array} array - associated array
     * @param {number} size - size per vertex
     * @param {GLenum} type 
     * @param {boolean} normalize 
     * @param {number} stride 
     * @param {number} offset 
     */


    addInstancedAttribute (
        name, 
        array, 
        size = 2, 
        type = FLOAT, 
        normalize = false, 
        stride = 0,
        offset = 0
    ) {
        this.buffers.push(new InstancedArrayBuffer(
            name,
            array,
            size,
            type,
            normalize,
            stride,
            offset
        ))
    }

}