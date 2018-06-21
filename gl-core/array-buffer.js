import { 
    FLOAT, 
    STATIC_DRAW,
    ARRAY_BUFFER 
} from '../gl-constants'

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

    setData () {
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._array, this._mode)
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
        this.unbind()
    }

    update () {
        this.bind()
        this.setData()
        this.unbind()
    }

    bind () {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer)
        return this
    }

    unbind () {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
        return this
    }


}