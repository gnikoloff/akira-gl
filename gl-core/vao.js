import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'

import { getExtension } from './get-extension'
import { makeBuffer } from './make-buffer'
import { bindBuffer } from './bind-buffer'

export class VAO {
    constructor (gl, attribs) {
        
        this.vaoExtension = VAO.create(gl)
        this.vao = this.vaoExtension.createVertexArrayOES()

        this.bind()

        this.buffers = attribs.map(attrib => {
            let { bufferType, array, mode } = attrib
            let buffer = makeBuffer(gl, bufferType, array, mode)
            if (attrib.bufferType !== ELEMENT_ARRAY_BUFFER) {
                let { attribLocation, attribType, itemsPerVert } = attrib
                bindBuffer(gl, buffer, attribLocation, attribType, itemsPerVert)
            }
            return buffer
        })

        this.unbind()
        
    }

    static create (gl) {
        return getExtension(gl, `OES_vertex_array_object`)
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