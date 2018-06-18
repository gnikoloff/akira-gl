import { ELEMENT_ARRAY_BUFFER } from '../gl-constants'

import { getExtension } from './get-extension'
import { makeBuffer } from './make-buffer'
import { bindBuffer } from './bind-buffer'

export const makeVAO = (gl, attribs) => {

    let vaoExtension = getExtension(gl, 'OES_vertex_array_object')
    let vao = vaoExtension.createVertexArrayOES()

    vaoExtension.bindVertexArrayOES(vao)

    const buffers = attribs.map(attrib => {
        let { bufferType, array, mode } = attrib
        let buffer = makeBuffer(gl, bufferType, array, mode)
        if (attrib.bufferType !== ELEMENT_ARRAY_BUFFER) {
            let { attribLocation, attribType, itemsPerVert } = attrib
            bindBuffer(gl, buffer, attribLocation, attribType, itemsPerVert)
        }
        return buffer
    })

    vaoExtension.bindVertexArrayOES(null)

    return {
        vaoExtension,
        buffers,
        vao
    }

}