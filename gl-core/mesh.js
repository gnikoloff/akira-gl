import { 
    ELEMENT_ARRAY_BUFFER,
    TRIANGLES
} from '../gl-constants'

import { makeVAO } from './make-vao'

export class Mesh {
    constructor (gl, geometry, material, drawOperation = TRIANGLES) {
        this.gl = gl
        this.material = material
        this.drawOperation = drawOperation

        material.init(gl)
        this.activate()
        material.getAttribLocations(geometry.attribs)
        material.setUniforms()
        this.deactivate()

        this.vao = makeVAO(gl, geometry.attribs)

        this.hasIndices = geometry.attribs.find(attrib => {
            if (attrib.bufferType === ELEMENT_ARRAY_BUFFER) return true
        })

        if (this.hasIndices) {
            this.vertexCount = geometry.indices.length
        }
    }
    
    activate () {
        this.material.activate()
    }

    deactivate () {
        this.material.deactivate()
    }

    renderFrame () {
        this.vao.vaoExtension.bindVertexArrayOES(this.vao.vao)

        if (this.hasIndices) {
            this.gl.drawElements(this.drawOperation, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
        }

        this.vao.vaoExtension.bindVertexArrayOES(null)
    }


}