import {
    FLOAT,
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

import { ArrayBuffer } from '../gl-core'
import { IndexArrayBuffer } from '../gl-core'

export class Geometry {
    
    constructor (buffers = []) {
        this.buffers = buffers
    }

    init (gl) {
        this._gl = gl
        return this.buffers
    }

    addAttribute (
        name, 
        array, 
        size = 2, 
        type = FLOAT, 
        normalize = false, 
        stride = 0,
        offset = 0
    ) {
        this.buffers.push(new ArrayBuffer(
            name,
            array,
            size,
            type,
            normalize,
            stride,
            offset
        ))
    }

    addIndiceAttribute (array) {
        this.buffers.push(new IndexArrayBuffer(array))
    }

    fromGeometry (geometry) {
        const indices = geometry.buffers.find(buffer => {
            return buffer.type === ELEMENT_ARRAY_BUFFER
        })
        if (indices) {
            this.indices = indices._array
            this.hasIndices = true
        }
        
        this.buffers = geometry.buffers.map(buffer => buffer)
        
        return this
    }

}