import { 
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

export class IndexArrayBuffer {
    constructor (array, mode = STATIC_DRAW) {

        this._type = ELEMENT_ARRAY_BUFFER

        this._array = array
        this._mode = mode
    }   

    get type () {
        return this._type
    }

    init (gl) {
        this._gl = gl

        this._buffer = gl.createBuffer()
        console.log(this)
    }

    bindToVAO () {
        this.bind()
        this.setData()
        this.unbind()
    }

    setData () {
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._array, this._mode)
    }

    bind () {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer)
        return this
    }

    unbind () {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null)
        return this
    }

}