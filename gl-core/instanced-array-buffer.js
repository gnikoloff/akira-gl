import { 
    FLOAT, 
    STATIC_DRAW,
    ARRAY_BUFFER 
} from '../gl-constants'

import { ArrayBuffer } from './array-buffer'

export class InstancedArrayBuffer extends ArrayBuffer {
    constructor (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0, mode = STATIC_DRAW) {
        super(name, array, size, type, normalize, stride, offset, mode)
        this.isInstanced = true
    }
    addInstancingExtension (ext) {
        this._ext = ext
    }
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