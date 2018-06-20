import { vec4 } from 'gl-matrix'

export class Vector4 {
    constructor (x = 0, y = 0, z = 0, w = 0) {
        this._x = x
        this._y = y
        this._z = z
        this._w = w

        this._vector = vec4.create()

        vec4.set(this._vector, x, y, z, w)   
    }

    set (x = 0, y = 0, z = 0, w = 0) {
        this._x = x
        this._y = y
        this._z = z
        this._w = w

        vec4.set(this._vector, x, y, z, w)
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

    get w () {
        return this._w = w
    }

    set w (w) {
        this._w = w
    }

    clone () {
        const newVector = vec4.create()
        vec4.set(newVector, this._x, this._y, this._z, this._w)
        return newVector
    }

}