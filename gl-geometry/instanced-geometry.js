import { FLOAT } from '../gl-constants'

import { Geometry } from './geometry'
import { InstancedArrayBuffer } from '../gl-core'
import { getWebGLExtension } from '../gl-core/utils'

export class InstancedGeometry extends Geometry {
    constructor (instanceCount = 20, buffers = []) {
        super()
        this.instanceCount = instanceCount
        this.isInstanced = true
        this.buffers = buffers
    }

    init (gl) {
        super.init(gl)
        this._ext = getWebGLExtension(gl, 'ANGLE_instanced_arrays')
        this.buffers.forEach(buffer => {
            if (buffer.isInstanced) {
                this._isInstanced = true
                buffer.addInstancingExtension(this._ext)
            }
        })
    }

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