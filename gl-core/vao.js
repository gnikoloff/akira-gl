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
            

            // HERE WE SHOULD BIND THE ALREADY INITIALIZED ATTRIBUTES!

            // let { bufferType, array, mode } = attrib
            // let buffer = makeBuffer(gl, bufferType, array, mode)
            
            // if (attrib.bufferType !== ELEMENT_ARRAY_BUFFER) {
            //     let { attribLocation, attribType, itemsPerVert } = attrib
            //     bindBuffer(gl, buffer, attribLocation, attribType, itemsPerVert)
            // }
            // attrib.buffer = buffer
            // return buffer
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