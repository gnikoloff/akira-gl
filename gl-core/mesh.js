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
        
        if (geometry._isCopied) {
            geometry._refGeometry.init(gl, drawOperation)
            geometry.init(gl, drawOperation)
        } else {
            geometry.init(gl, drawOperation)    
        }
        material.init(gl, geometry.buffers)
        this.vao = new VAO(gl, geometry.buffers)

    }
    
    activate () {
        this.material.activate()
        this.vao.bind()
        return this
    }

    deactivate () {
        this.material.deactivate()
        this.vao.unbind()
        return this
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
        this.geometry.draw() 
        return this
    }


}