import {
    FLOAT,
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

import { ArrayBuffer } from './array-buffer'

// import { bindBuffer } from './bind-buffer'
// import { updateBuffer } from './update-buffer'


export class Geometry {
    constructor (attribs = []) {
        this.attribs = attribs
    }

    addAttribute (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0) {
        this.attribs.push(new ArrayBuffer(
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
        this.attribs.push({
            bufferType: ELEMENT_ARRAY_BUFFER,
            array,
            mode: STATIC_DRAW
        })
    }

    updateAttribute (gl, name, array) {
        const attrib = this.attribs.find(attrib => attrib.name === name)
        updateBuffer(gl, attrib.buffer, attrib.attribType, array, attrib.mode)
        // bindBuffer(gl, attrib.attribLocation, attrib.itemsPerVert, attrib.attribType, false, 0, 0)
    }

}