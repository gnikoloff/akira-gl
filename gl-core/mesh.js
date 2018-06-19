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
        material.setUniforms()
        material.getAttribLocations(geometry.attribs)
        this.deactivate()

        this.vao = makeVAO(gl, geometry.attribs)

        this.hasIndices = geometry.attribs.find(attrib => {
            if (attrib.bufferType === ELEMENT_ARRAY_BUFFER) return true
        })

        if (this.hasIndices) {
            this.vertexCount = geometry.indices.length
        } else {
            const vertices = geometry.attribs.find(attrib => {
                if (attrib.name === 'a_position') return attrib
            })
            const { itemsPerVert } = vertices
            this.vertexCount = vertices.array.length / itemsPerVert
        }
    }
    
    activate () {
        this.material.activate()
    }

    deactivate () {
        this.material.deactivate()
    }

    preRender (camera) {
        this.material.setViewMatrix(camera.viewMatrix)
        this.material.setProjectionMatrix(camera.projectionMatrix)
    }

    renderFrame (camera) {

        this.preRender(camera)

        this.vao.vaoExtension.bindVertexArrayOES(this.vao.vao)

        if (this.hasIndices) {
            this.gl.drawElements(this.drawOperation, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
        } else {
            this.gl.drawArrays(this.drawOperation, 0, this.vertexCount) 
        }

        this.vao.vaoExtension.bindVertexArrayOES(null)
    }


}