import { makeShader } from './make-shader'
import { makeProgram } from './make-program'

export class Material {
    constructor (gl, uniforms, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl

        const vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

        this.program = makeProgram(gl, vertexShader, fragmentShader)
        this.gl.useProgram(this.program)

        Object.keys(uniforms).map(val => {
            uniforms[val].location = gl.getUniformLocation(this.program, val)
            this.gl[`uniform${uniforms[val].type}`](uniforms[val].location, uniforms[val].value)
        })
        this.uniforms = uniforms

        this.gl.useProgram(null)
    }

    updateUniform (uniform) {
        this.gl[`uniform${uniform.type}`](uniform.location, uniform.value)
    }

    activate () {
        this.gl.useProgram(this.program)
        return this
    }

    deactivate () {
        this.gl.useProgram(null)
        return this
    }

}