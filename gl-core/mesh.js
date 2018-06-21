import { 
    ELEMENT_ARRAY_BUFFER,
    TRIANGLES
} from '../gl-constants'

import { VAO } from './vao'

export class Mesh {
    constructor (gl, geometry, material, drawOperation = TRIANGLES) {
        this.gl = gl
        this.geometry = geometry
        this.material = material
        this.drawOperation = drawOperation
        
        material.init(gl, geometry.buffers)
        this.vao = new VAO(gl, geometry.buffers)

        this.hasIndices = geometry.buffers.find(attrib => {
            if (attrib.type === ELEMENT_ARRAY_BUFFER) return true
        })

        if (this.hasIndices) {
            this.vertexCount = geometry.indices.length
        } else {
            const vertices = geometry.buffers.find(attrib => {
                if (attrib.name === 'a_position') return attrib
            })
            this.vertexCount = vertices.count
        }
    }
    
    activate () {
        this.material.activate()
        this.vao.bind()
    }

    deactivate () {
        this.material.deactivate()
        this.vao.unbind()
    }

    setPosition (x = 0, y = 0, z = 0) {
        this.material.transform.setPosition(x, y, z)
    }

    setRotate (x = 0, y = 0, z = 0) {
        this.material.transform.setRotate(x, y, z)
    }

    setScale (x = 1, y = 1, z = 1) {
        this.material.transform.setScale(x, y, z)
    }

    preRender (camera) {
        this.material.updateModelMatrix()
        
        this.material.setViewMatrix(camera.viewMatrix)
        this.material.setProjectionMatrix(camera.projectionMatrix)
    }

    renderFrame (camera) {

        this.preRender(camera)

        if (this.hasIndices) {
            if (this.geometry.type === 'Plane') {
                this.gl.drawElements(this.drawOperation, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
            } else {
                if (this.geometry.isWire) {
                    this.gl.drawElements(3, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
                } else {
                    this.gl.drawElements(this.drawOperation, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
                }
            }
            
        } else {
            this.gl.drawArrays(this.drawOperation, 0, this.vertexCount) 
        }   

    }


}