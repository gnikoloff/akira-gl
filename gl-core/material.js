import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'
import { Transform } from '../gl-math'
import { makeShader } from './make-shader'
import { makeProgram } from './make-program'

const shaderPrecisionFragment = `
    precision highp float;
`

const shaderSharedUniformsVertexFragment = `
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
`

export class Material {
    constructor (props) {

        const {
            uniforms,
            vertexShader,
            fragmentShader
        } = props

        this.transform = new Transform()

        const sharedUniforms = {
            u_modelMatrix: { type: 'Matrix4fv', value: this.transform.viewMatrix },
            u_viewMatrix: { type: 'Matrix4fv', value: null },
            u_projectionMatrix: { type: 'Matrix4fv', value: null } 
        }
        this.uniforms = Object.assign(sharedUniforms, uniforms)

        this.vertexShaderSource = `
            ${shaderSharedUniformsVertexFragment}
        
            ${vertexShader}
        `
        this.fragmentShaderSource = `
            ${shaderPrecisionFragment}
            
            ${fragmentShader}
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
        Object.keys(uniforms).forEach(val => {
            uniforms[val].location = this.gl.getUniformLocation(this.program, val)
            
            if (!uniforms[val].value) return
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

    updateModelMatrix () {
        if (!this.transform.shouldUpdateMatrix) return
        console.log('updating model matrix')
        const { u_modelMatrix } = this.uniforms
        this.gl.uniformMatrix4fv(u_modelMatrix.location, false, this.transform.viewMatrix)
        this.transform.shouldUpdateMatrix = false
    }

    setViewMatrix (matrix) {
        const { u_viewMatrix } = this.uniforms
        this.gl.uniformMatrix4fv(u_viewMatrix.location, false, matrix)
    }

    setProjectionMatrix (matrix) {
        const { u_projectionMatrix } = this.uniforms
        this.gl.uniformMatrix4fv(u_projectionMatrix.location, false, matrix)
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