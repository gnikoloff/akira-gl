import { 
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

/**
 * Buffer used for geometry's indices to reduce vertices redundancy.
 */

export class IndexArrayBuffer {
    constructor (array, mode = STATIC_DRAW) {

        this._type = ELEMENT_ARRAY_BUFFER

        this._array = array
        this._mode = mode
    }   

    get type () {
        return this._type
    }

    /**
     * Initializes buffer
     * @param {WebGLRenderingContext} gl
     */

    init (gl) {
        this._gl = gl

        this._buffer = gl.createBuffer()    
    }

    /**
     * Binds buffer to VAO
     */

    bindToVAO () {
        this.bind()
        this.setData()

        // why index buffers should not be unbound 
        // when binded to vaos ??

        // this.unbind()
    }

    /**
     * Sets buffer data
     */

    setData () {
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._array, this._mode)
    }

    /**
     * Binds buffer for usage
     * @returns {IndexArrayBuffer} `this`
     */

    bind () {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer)
        return this
    }

    /**
     * Unbinds buffer
     * @returns {IndexArrayBuffer} `this`
     */

    unbind () {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null)
        return this
    }

}