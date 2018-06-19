import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'

import { makeShader } from './make-shader'
import { makeProgram } from './make-program'

export class Material {
    constructor (uniforms, vertexShaderSource, fragmentShaderSource) {
        this.uniforms = uniforms
        this.vertexShaderSource = vertexShaderSource
        this.fragmentShaderSource = `
            precision highp float;

            ${fragmentShaderSource}
        `
    }   

    init (gl) {
        this.gl = gl
        const vertexShader = makeShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource)
        const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource)

        this.program = makeProgram(gl, vertexShader, fragmentShader)
        
    }

    setUniforms () {
        const { uniforms } = this
        Object.keys(uniforms).map(val => {
            uniforms[val].location = this.gl.getUniformLocation(this.program, val)
            if (uniforms[val].type === 'Matrix4fv') {
                this.gl[`uniform${uniforms[val].type}`](uniforms[val].location, false, uniforms[val].value)
            } else {
                this.gl[`uniform${uniforms[val].type}`](uniforms[val].location, uniforms[val].value)
            }
        })
        this.uniforms = uniforms
    }

    getAttribLocations (attribs) {
        attribs.forEach(attrib => {
            if (attrib.bufferType === ELEMENT_ARRAY_BUFFER) return
            const loc = this.gl.getAttribLocation(this.program, attrib.name)
            attrib.attribLocation = loc
        })
    }

    updateUniform (uniform) {
        if (uniform.type === 'Matrix4fv') {
            this.gl[`uniform${uniforms.type}`](uniforms.location, false, uniforms.value)
        } else {
            this.gl[`uniform${uniform.type}`](uniform.location, uniform.value)
        }
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