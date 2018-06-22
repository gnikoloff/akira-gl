import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'

import { getWebGLExtension } from './utils'

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

    delete () {
        this.vaoExtension.deleteVertexArrayOES(this.vao)
    }

    bind () {
        this.vaoExtension.bindVertexArrayOES(this.vao)
    }

    unbind () {
        this.vaoExtension.bindVertexArrayOES(null)
    }

}