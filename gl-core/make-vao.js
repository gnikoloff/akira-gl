import { getExtension } from './get-extension'

export const makeVAO = (gl, attribs) => {

    let vaoExtension = getExtension(gl, 'OES_vertex_array_object')
    let vao = vaoExtension.createVertexArrayOES()

    vaoExtension.bindVertexArrayOES(vao)
 
    // rtn.buffers = attribs.map(attrib => {
    //     const buffer = makeBuffer(gl, attrib)
    //     if (attrib.bufferType !== gl.ELEMENT_ARRAY_BUFFER) {
    //         bindBuffer(gl, buffer, attrib)
    //     }
    //     return buffer
    // })

    vaoExtension.bindVertexArrayOES(null)

    return vao

}