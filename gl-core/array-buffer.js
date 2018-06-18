const STATIC_DRAW = 0x88E4

export class ArrayBuffer {
    // webglrenderingengine
    // float32array
    // static or dynamic
    constructor (gl, data, usage) {
        this.gl = gl
        this.buffer = gl.createBuffer()
        this.attribs = []

        try {
            const success = data instanceof Float32Array || data instanceof Float64Array
            if (success) {
                
                this.bind()
                    .setData(data, usage)
                    .unbind()

            } else throw 'data should be Float32Array or Float64Array'
        } catch (error) {
            console.error(error)
        }
        
    }

    bind () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
        return this
    }

    unbind () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
        return this
    }

    setData (data, usage = STATIC_DRAW) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, usage)   
        return this
    }

}