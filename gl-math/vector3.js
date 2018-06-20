import { vec3 } from 'gl-matrix'

export class Vector3 {
    constructor (x = 0, y = 0, z = 0) {
        this._x = x
        this._y = y
        this._z = z

        this._vector = vec3.create()

        vec3.set(this._vector, x, y, z)   
    }

    get vector () {
        return this._vector
    }

    set (x = 0, y = 0, z = 0) {
        this._x = x
        this._y = y
        this._z = z

        vec3.set(this._vector, x, y, z)
    }

    get x () {
        return this._x
    }

    set x (x) {
        this._x = x
    }

    get y () {
        return this._y
    }

    set y (y) {
        this._y = y
    }

    get z () {
        return this._z
    }

    set z (z) {
        this._z = z
    }

    getArray () {
        return [ this._x, this._y, this._z ]
    }

    clone () {
        const newVector = vec3.create()
        vec3.set(newVector, this._x, this._y, this._z)
        return newVector
    }

}