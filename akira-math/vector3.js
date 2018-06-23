import { mat4 } from 'gl-matrix';

export class Vector3 {
	constructor (x = 0, y = 0, z = 0) {
		this.needsUpdate = true
		this._x = x
		this._y = y
		this._z = z

		this.array = new Float32Array([x, y, z])
		this.matrix = mat4.create()
	}
    set (x, y, z) {
        this._x = x
        this._y = y
        this._z = z
    }
	set x (value) {
		this.needsUpdate = true
		this._x = value
		this.array[0] = value

		this.update()
	}
	get x () {
		return this._x
	}
	set y (value) {
		this.needsUpdate = true
		this._y = value
		this.array[1] = value

		this.update()
	}
	get y () {
		return this._y
	}
	set z (value) {
		this.needsUpdate = true
		this._z = value
		this.array[2] = value

		this.update()
	}
	get z () {
		return this._z
	}
	update () {
		mat4.fromTranslation(this.matrix, this.array)
	}
	setArray (arr) {
		this._x = arr[0]
		this._y = arr[1]
		this._z = arr[2]

		this.array[0] = arr[0]
		this.array[1] = arr[1]
		this.array[2] = arr[2]

		this.update()
	}
}