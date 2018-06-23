import { 
    ELEMENT_ARRAY_BUFFER,
    TRIANGLES
} from '../akira-constants'

import { VAO } from './vao'

/**
 * Combine geometry and material to a model
 * @class
 * @param {WebGLRenderingContext} gl
 * @param {Geometry} geometry
 * @param {Material} material
 * @param {GLenum} [drawOperation = TRIANGLES]
 */

export class Mesh {
    constructor (gl, geometry, material, drawOperation = TRIANGLES) {
        this.gl = gl
        this.geometry = geometry
        this.material = material
        
        if (geometry._isCopied) {
            geometry._refGeometry.init(gl, drawOperation)
            geometry.init(gl, drawOperation)
        } else {
            geometry.init(gl, drawOperation)    
        }
        material.init(gl, geometry.buffers)
        this.vao = new VAO(gl, geometry.buffers)

    }
    
    /**
     * Bind model's shader program and vertex array object
     * @returns {Mesh} `this`
     */
    
    activate () {
        this.material.activate()
        this.vao.bind()
        return this
    }
    
    /**
     * Unbind model's shader program and vertex array object
     * @returns {Mesh} `this`
     */

    deactivate () {
        this.material.deactivate()
        this.vao.unbind()
        return this
    }

    /**
     * Set model's position
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {number} [z = 0]
     */

    setPosition (x = 0, y = 0, z = 0) {
        this.material.transform.setPosition(x, y, z)
    }

    /**
     * Set model's rotation
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {number} [z = 0]
     */

    setRotate (x = 0, y = 0, z = 0) {
        this.material.transform.setRotate(x, y, z)
    }

    /**
     * Set model's scale
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {number} [z = 0]
     */

    setScale (x = 1, y = 1, z = 1) {
        this.material.transform.setScale(x, y, z)
    }

    /**
     * Update model's model, view and projection matrixes before rendering it.
     * @param {PerspectiveCamera|OrthographicCamera} camera 
     */

    preRender (camera) {
        this.material.updateModelMatrix()
        
        this.material.setViewMatrix(camera.viewMatrix)
        this.material.setProjectionMatrix(camera.projectionMatrix)
    }

    /**
     * Render model
     * @param {PerspectiveCamera|OrthographicCamera} camera 
     * @returns {Mesh} `this`
     */

    renderFrame (camera) {
        this.preRender(camera)
        this.geometry.draw() 
        return this
    }


}