import {
    FLOAT,
    ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

export class Geometry {
    constructor () {
        this.attribs = []
    }

    addAttribute (name, array, itemsPerVert = 2, mode = STATIC_DRAW) {
        this.attribs.push({
            name,
            bufferType: ARRAY_BUFFER,
            array,
            attribType: FLOAT,
            itemsPerVert,
            mode
        })
    }

}