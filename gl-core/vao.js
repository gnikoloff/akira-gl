import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'

import { getWebGLExtension } from './utils/get-webgl-extension'
import { makeBuffer } from './make-buffer'
import { bindBuffer } from './bind-buffer'

export class VAO {
    constructor (gl, attribs) {
        
        this.vaoExtension = getWebGLExtension(gl, `OES_vertex_array_object`)
        this.vao = this.vaoExtension.createVertexArrayOES()

        this.bind()

        this.buffers = attribs.map(attrib => {
            attrib.bindToVAO()
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