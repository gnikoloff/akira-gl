import { 
    FLOAT,
    ARRAY_BUFFER, 
    STATIC_DRAW 
} from '../akira-constants'

// name
// size
// type
// normalize
// stride
// offset

export class InterleavedArrayBuffer {
    constructor (array, buffersInfo = []) {
        this._array = array
        this._type = ARRAY_BUFFER
        this._buffersInfo = buffersInfo.map(buff => {
            if (!buff.type) buff.type = FLOAT
            if (!buff.normalize) buff.normalize = false
            return buff
        })
        
        this._totalSize = buffersInfo.reduce((acc, buffer) => {
            acc += buffer.size
            return acc
        }, 0)

        this._stride = this._totalSize * Float32Array.BYTES_PER_ELEMENT
        

    }
    init (gl, program) {
        this._gl = gl
        this._program = program

        this._buffer = this._gl.createBuffer()
        let prevAttribOffset = 0
        this._buffersInfo.forEach((buff, i) => {
            const loc = this._gl.getAttribLocation(this._program, buff.name)
            if (loc === -1) return

            buff.location = loc
            buff.offset = prevAttribOffset * Float32Array.BYTES_PER_ELEMENT
            prevAttribOffset += buff.size
        })

        this.bind()
        this.setData()
        this.unbind()
    }
    bindToVAO () {        
        this.bind()

        this._buffersInfo.forEach(buff => {
            this._gl.enableVertexAttribArray(buff.location)
            this._gl.vertexAttribPointer(
                buff.location, 
                buff.size, 
                buff.type, 
                buff.normalize, 
                this._stride, 
                buff.offset
            )
        })
        this.unbind()
    }
    setData () {
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._array, STATIC_DRAW)
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