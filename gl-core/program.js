import { makeShader } from './utils'
import { makeProgram } from './utils'

export class Program {
    constructor (gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl

        const vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

        this._program = makeProgram(gl, vertexShader, fragmentShader)

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