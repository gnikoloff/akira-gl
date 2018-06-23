import { ELEMENT_ARRAY_BUFFER } from '../akira-constants'
import { Uniform } from '../akira-core/uniform'
import { Transform } from '../akira-math'

import { makeShader, makeProgram } from '../akira-core/utils'

import { shaderSharedUniformsVertexFragment } from './shader-bits/shared-uniforms'
import { shaderPrecisionFragment } from './shader-bits/shader-precision'

/**
 * @class
 * @param {Object} props
 * @param {Object} props.uniforms
 * @param {string} props.vertexShader - vertex shader source
 * @param {string} props.fragmentShader - fragment shader source
 * @param {boolean} transparent
 */

export class Material {
    constructor (props) {

        const {
            uniforms,
            vertexShader,
            fragmentShader,
            transparent
        } = props

        this.textures = []
        this.texCount = 0
        this.transform = new Transform()

        this.transparent = transparent

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

    /**
     * Merges user's supplied uniforms with default ones that every mesh gets:
     * u_modelMatrix
     * u_transposeModelMatrix
     * u_viewMatrix
     * u_projectionMatrix
     * @param {Object} uniforms 
     */

    generateUniforms (uniforms) {
        const sharedUniforms = {
            u_modelMatrix:          new Uniform('u_modelMatrix', 'matrix4fv', this.transform.viewMatrix),
            u_transposeModelMatrix: new Uniform('u_transposeModelMatrix', 'matrix4fv', this.transform.transposeViewMatrix),
            u_viewMatrix:           new Uniform('u_viewMatrix', 'matrix4fv'),
            u_projectionMatrix:     new Uniform('u_projectionMatrix', 'matrix4fv')
        }
        Object.keys(uniforms).forEach(val => {
            const uniformCopy = uniforms[val]
            uniforms[val] = new Uniform(val, uniformCopy.type, uniformCopy.value)
        })
        this.uniforms = Object.assign(sharedUniforms, uniforms)

        // textures
        Object.keys(this.uniforms).map(key => {
            if (this.uniforms[key].type === 't') {
                this.textures.push(this.uniforms[key].value)
            }
        })
    }

    /**
     * Initialize material
     * @param {WebGLRenderingContext} gl 
     * @param {Array} buffers 
     */

    init (gl, buffers) {
        this.gl = gl
        const vertexShader = makeShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource)
        const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource)

        this.program = makeProgram(gl, vertexShader, fragmentShader)

        this.activate()

        const { uniforms } = this
        Object.keys(uniforms).forEach(val => {
            uniforms[val].setLocation(this.gl, this.program)
            uniforms[val].setValue()
        })
        this.uniforms = uniforms

        buffers.forEach(buffer => {
            buffer.init(this.gl, this.program)
        })

        this.deactivate()
        
    }

    /**
     * Update mode's matrix
     */

    updateModelMatrix () {
        if (!this.transform.shouldUpdateMatrix) return
        
        this.uniforms.u_modelMatrix.setValue(this.transform.viewMatrix)
        this.transform.shouldUpdateMatrix = false
    }

    /**
     * set model's view matrix
     * @param {Float32Array|Float64Array} matrix
     */

    setViewMatrix (matrix) {
        this.uniforms.u_viewMatrix.setValue(matrix)
    }

    /**
     * set model's projection matrix
     * @param {Float32Array|Float64Array} matrix
     */

    setProjectionMatrix (matrix) {
        this.uniforms.u_projectionMatrix.setValue(matrix)
    }

    /**
     * Activate material's shader program
     * @returns {Material} `this`
     */

    activate () {
        this.gl.useProgram(this.program)
        
        this.textures.forEach((tex, i) => {
            tex.bind()
            tex.activate(i)
        })

        if (this.transparent) {
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE)
            this.gl.enable(this.gl.BLEND)
            this.gl.disable(this.gl.DEPTH_TEST)
        }

        return this
    }

    /**
     * Deactivate material's shader program
     * @returns {Material} `this`
     */

    deactivate () {
        if (this.transparent) {
            this.gl.disable(this.gl.BLEND)
            this.gl.enable(this.gl.DEPTH_TEST)
        }
        this.gl.useProgram(null)
        return this
    }

}