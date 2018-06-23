import { mat4 } from 'gl-matrix'
import { Euler, Vector3 } from '../gl-math'

/**
 * @class Perspspective Camera class
 * @param {number} [width = window.innerWidth] - viewport's width
 * @param {number} [height = window.innerWidth] - viewport's height
 * @param {number} [fov = 45] - camera's field of view
 * @param {number} [near = 1] - camera's near visibility
 * @param {number} [far = 1000] - camera's far visibility
 */
export class PerspectiveCamera {
	constructor(
		width = window.innerWidth, 
		height = window.innerHeight, 
		fov = 45, 
		near = 1, 
		far = 1000
	) {

		this.type = 'perspectiveCamera'
		this.position = new Vector3()
		this.rotation = new Euler()

		this._fov = fov
		this._width = width
		this._height = height
		this._near = near
		this._far = far

		this.needsUpdate = true

		this.viewMatrix = mat4.create()
		this.projectionMatrix = mat4.create()

		requestAnimationFrame(() => {
			this._updateViewMatrix()
			this._updateProjectionMatrix()
		})
	}

	get fov (){
		return this._fov
	}
	
	get width (){
		return this._width
	}
	
	get height (){
		return this._height
	}
	
	get near (){
		return this._near
	}
	
	get far (){
		return this._far
	}

	/**
	 * Update camera's view matrix
	 * @param {boolean} [forceUpdate = false] - should update
	 */
	update (forceUpdate = false) {
		this._updateViewMatrix(forceUpdate)

		return this
	}

	/**
	 * Set camera's position in world
	 * @param {number} x - camera x position
	 * @param {number} y - camera y position
	 * @param {number} z - camera z position
	 */
	setPosition (x, y, z) {
		this.updatePosition(x, y, z)
	}

	updatePosition (x, y, z) {
		if (x !== undefined) this.position.x = x
		if (y !== undefined) this.position.y = y
		if (z !== undefined) this.position.z = z

		return this
	}

	/**
	 * Set camera's rotation
	 * @param {number} x - camera x rotation
	 * @param {number} y - camera y rotation
	 * @param {number} z - camera z rotation
	 */
	setRotation (x, y, z) {
		this.updateRotation(x, y, z)
	}

	updateRotation( x, y, z) {
		if (x !== undefined) this.rotation.x = x
		if (y !== undefined) this.rotation.y = y
		if (z !== undefined) this.rotation.z = z

		return this
	}

	/**
	 * Orient camera to look at supplied array's x y z positions
	 * @param {Array} targetPosition
	 */
	lookAt (targetPosition) {
		if (Array.isArray(targetPosition)) mat4.lookAt(this.viewMatrix, this.position.array, targetPosition, [0, 1, 0])
		else mat4.lookAt(this.viewMatrix, this.position.array, targetPosition.array, [0, 1, 0])

		mat4.invert(this.rotation.matrix, this.viewMatrix)
		this.rotation.setFromRotationMatrix(this.rotation.matrix)
		this.needsUpdate = false

		return this
	}

	log () {
		console.log(
			`PerspectiveCamera position: {x: ${this.position.x}, y: ${this.position.y}, z: ${this.position.z} }`
		)
		console.log(
			`PerspectiveCamera rotation: {x: ${this.rotation.x}, y: ${this.rotation.y}, z: ${this.rotation.z} }`
		)
	}

	/**
	 * Update camera's viewport size
	 * @param {number} width 
	 * @param {number} height 
	 */

	updateSize (width, height) {
		this._width = width
		this._height = height

		this._updateProjectionMatrix()
	}

	/**
	 * Update camera's field of view
	 * @param {number} fov - field of view
	 * @param {boolean} [updateProjectionMatrix = true] - should update projection matrix
	 */

	updateFov (fov, updateProjectionMatrix = true) {
		this._fov = fov

		if (updateProjectionMatrix) this._updateProjectionMatrix()
	}

	/**
	 * Update camera's near and far visibility
	 * @param {number} near 
	 * @param {number} far 
	 */

	updateDistance (near, far) {
		if (near) this._near = near
		if (far) this._far = far

		this._updateProjectionMatrix()
	}

	/**
	 * Update camera's projection and view matrices
	 */

	updateMatrix () {
		this.updateProjectionMatrix()
		this.updateViewMatrix()
	}

	/**
	 * Update camera's projection matrix
	 */

	updateProjectionMatrix () {
		this._updateProjectionMatrix()
	}

	/**
	 * Update camera's view matrix
	 */

	updateViewMatrix () {
		this._updateViewMatrix()
	}

	_updateProjectionMatrix () {
		mat4.perspective(
			this.projectionMatrix,
			this._fov / 180 * Math.PI,
			this._width / this._height,
			this._near,
			this._far
		)
	}

	_updateViewMatrix (forceUpdate = false) {
		if (!this.rotation.needsMatrixUpdate && !this.needsUpdate && !forceUpdate) return

		this.rotation.updateMatrix()
		mat4.copy(this.viewMatrix, this.rotation.matrix)
		this.viewMatrix[12] = this.position.array[0]
		this.viewMatrix[13] = this.position.array[1]
		this.viewMatrix[14] = this.position.array[2]
		mat4.invert(this.viewMatrix, this.viewMatrix)

		this.needsUpdate = false

		return this
	}

}