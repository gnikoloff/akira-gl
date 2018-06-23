/**
 * @class Uniform
 * @param {string} name
 * @param {number} type
 * @param {number} value
 */
export class Uniform {
    
    constructor (name, type, value) {
        this.name = name
        this.type = type
        this.value = value
    }
    
    /**
     * Set location to supplied program
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     */

    setLocation (gl, program) {
        this.gl = gl
        this.location = gl.getUniformLocation(program, this.name)
    }

    /**
     * Sets uniform value
     * @param {*} val 
     */

    setValue (val) {
        let value = val ? val : this.value
        if (!value) return
        
        this.value = value
        
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