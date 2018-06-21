export class Uniform {
    
    constructor (name, type, value) {
        this.name = name
        this.type = type
        this.value = value
    }
    
    setLocation (gl, program) {
        this.gl = gl
        this.location = gl.getUniformLocation(program, this.name)
    }

    setValue (val) {
        let value = val ? val : this.value
        if (!value) return

        switch (this.type) {
            case '1f':
                this.gl.uniform1f(this.location, value)
                break
            case '2f':
                this.gl.uniform2f(this.location, ...value.getArray())
                break
            case '3f':
                this.gl.uniform3f(this.location, ...value.getArray())
                break
            case '4f':
                this.gl.uniform4f(this.location, ...value.getArray())
                break
            case 'matrix2fv':
                this.gl.uniformMatrix2fv(this.location, false, value)
                break
            case 'matrix3fv':
                this.gl.uniformMatrix3fv(this.location, false, value)
                break
            case 'matrix4fv':
                this.gl.uniformMatrix4fv(this.location, false, value)
                break
            case 't':
                this.gl.uniform1i(this.location, this.value)
                break
        }
    }

}