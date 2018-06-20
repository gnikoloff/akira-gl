import { vec4, mat4 } from 'gl-matrix'

import { Vector3 } from './vector3'
import { Vector4 } from './vector4'

export class Transform {
    constructor () {
        this.position = new Vector3()
        this.scale = new Vector3()
        this.rotation = new Vector3()

        this.viewMatrix = mat4.create()
        this.normalMatrix = mat4.create()
        
        this.shouldUpdateMatrix = false

        this.forward = new Vector4()
        this.up = new Vector4()
        this.right = new Vector4()

        this.setScale(1, 1, 1)

    }

    setPosition (x = 0, y = 0, z = 0) {
        this.position.set(x, y, z)   
        this.shouldUpdateMatrix = true
    }

    setRotate (x = 0, y = 0, z = 0) {
        this.rotation.set(x, y, z)
        this.shouldUpdateMatrix = true
    }

    setScale (x = 1, y = 1, z = 1) {
        this.scale.set(x, y, z)
        this.shouldUpdateMatrix = true
    }

    updateMatrix () {

        mat4.identity(this.viewMatrix)
        mat4.translate(this.viewMatrix, this.viewMatrix, this.position.vector)
        mat4.rotateX(this.viewMatrix, this.viewMatrix, this.rotation.x)
        mat4.rotateY(this.viewMatrix, this.viewMatrix, this.rotation.y)
        mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation.z)
        mat4.scale(this.viewMatrix, this.viewMatrix, this.scale.vector)
    }

    reset () {
        vec3.set(this.position, 0, 0, 0)
        vec3.set(this.scale, 1, 1, 1)
        vec3.set(this.rotation, 0, 0, 0)
    }

}