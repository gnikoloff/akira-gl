import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'
import { Uniform } from './uniform'
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

        this.generateUniforms(uniforms)

        this.vertexShaderSource = `
            ${shaderSharedUniformsVertexFragment}
        
            ${vertexShader}
        `
        this.fragmentShaderSource = `
            ${shaderPrecisionFragment}
            
            ${fragmentShader}
        `
    }   

    generateUniforms (uniforms) {
        const sharedUniforms = {
            u_modelMatrix: new Uniform('u_modelMatrix', 'Matrix4fv', this.transform.viewMatrix),
            u_viewMatrix: new Uniform('u_viewMatrix', 'Matrix4fv'),
            u_projectionMatrix: new Uniform('u_projectionMatrix', 'Matrix4fv')
        }
        Object.keys(uniforms).forEach(val => {
            const uniformCopy = uniforms[val]
            uniforms[val] = new Uniform(val, uniformCopy.type, uniformCopy.value)
        })
        this.uniforms = Object.assign(sharedUniforms, uniforms)
        console.log(this.uniforms)
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
            uniforms[val].setLocation(this.gl, this.program)
            uniforms[val].setValue()
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

    updateModelMatrix () {
        if (!this.transform.shouldUpdateMatrix) return
        
        this.uniforms.u_modelMatrix.setValue(this.transform.viewMatrix)
        this.transform.shouldUpdateMatrix = false
    }

    setViewMatrix (matrix) {
        this.uniforms.u_viewMatrix.setValue(matrix)
    }

    setProjectionMatrix (matrix) {
        this.uniforms.u_projectionMatrix.setValue(matrix)
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