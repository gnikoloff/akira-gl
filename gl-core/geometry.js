import {
    FLOAT,
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

import { ArrayBuffer } from './array-buffer'
import { IndexArrayBuffer } from './index-array-buffer'

export class Geometry {
    
    constructor (buffers = []) {
        this.buffers = buffers
    }

    addAttribute (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0) {
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

}