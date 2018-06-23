import { 
    FLOAT, 
    STATIC_DRAW,
    ARRAY_BUFFER 
} from '../akira-constants'

/**
 * Used to associate attribute and it's buffer
 * @class 
 * @param {string} name - attrib name
 * @param {Float32Array|Float64Array} array - associated buffer's array
 * @param {number} [size = 2] - size per vertex
 * @param {GLEnum} [type = FLOAT] - type of data
 * @param {boolean} [normalize = false] - should normalize buffer
 * @param {number} [stride = 0] - attrib's stride
 * @param {number} [offset = 0] - attrib's offset
 */
export class ArrayBuffer {
    constructor (name, array, size = 2, type = FLOAT, normalize = false, stride = 0, offset = 0, mode = STATIC_DRAW) {

        this._type = ARRAY_BUFFER

        this._name = name
        this._array = array
        this._size = size
        this._type = type
        this._normalize = normalize
        this._stride = stride
        this._offset = offset
        this._mode = mode
    }

    get type () {
        return this._type
    }

    get size () {
        return this._size
    }

    get name () {
        return this._name
    }

    get array () {
        return this._array
    }

    get count () {
        return this._array.length / this._size
    }

    get normalize () {
        return this._normalize
    }

    get stride () {
        return this._stride
    }

    get offset () {
        return this._offset
    }

    get mode () {
        return this._mode
    }

    /**
     * Initializes attribute and associated buffer
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program - program needed to look up buffer's location on GPU
     */

    init (gl, program) {
        this._gl = gl
        this._program = program

        this._location = this._gl.getAttribLocation(program, this._name)
        if (this._location === -1) return

        this._buffer = this._gl.createBuffer()
        
        this.bind()
        this.setData()
        this.unbind()
    }

    /**
     * Set buffer's data
     */

    setData () {
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._array, this._mode)
    }

    /**
     * Bind to Vertex Array Objext
     */

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
        this.unbind()
    }

    /**
     * Update buffer's contents
     */

    update () {
        this.bind()
        this.setData()
        this.unbind()
    }

    /**
     * Bind buffer to gl.ARRAY_BUFFER
     * @returns {ArrayBuffer} `this`
     */

    bind () {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer)
        return this
    }

    /**
     * Unbind buffer
     * @returns {ArrayBuffer} `this`
     */

    unbind () {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
        return this
    }


}