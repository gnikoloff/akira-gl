import { FLOAT, STATIC_DRAW } from '../gl-constants'

export class ArrayBuffer {
    constructor (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0) {
        this._name = name
        this._array = array
        this._size = size
        this._type = type
        this._normalize = normalize
        this._stride = stride
        this._offset = offset

    }

    bind () {
        
    }


}