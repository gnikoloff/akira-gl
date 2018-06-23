import { ELEMENT_ARRAY_BUFFER } from '../akira-constants'
import { getWebGLExtension } from './utils'

/**
 * Generates Vertex Array Object to hold single geometry's buffers
 * @class
 * @param {WebGLRenderingContext} gl
 * @param {Array} buffers
 */
export class VAO {
    constructor (gl, buffers) {
        
        this.vaoExtension = getWebGLExtension(gl, `OES_vertex_array_object`)
        this.vao = this.vaoExtension.createVertexArrayOES()

        this.bind()

        buffers.forEach(buffer => {
            buffer.bindToVAO()
        })

        this.unbind()
        
    }

    /**
     * Bind vao
     */

    bind () {
        this.vaoExtension.bindVertexArrayOES(this.vao)
    }

    /**
     * Unbind vao
     */

    unbind () {
        this.vaoExtension.bindVertexArrayOES(null)
    }

    /**
     * Delete vao
     */

    delete () {
        this.vaoExtension.deleteVertexArrayOES(this.vao)
    }

}