import { mat4 } from 'gl-matrix/src/gl-matrix'

import { Euler, Vector3 } from '../gl-math'

export class PerspectiveCamera {
	constructor(width = window.innerWidth, height = window.innerHeight, fov = 60, near = 0.1, far = 1000) {

		this.type = 'perspectiveCamera';
		this.position = new Vector3();
		this.rotation = new Euler();

		this._fov = fov;
		this._width = width;
		this._height = height;
		this._near = near;
		this._far = far;

		this.needsUpdate = true;

		this.viewMatrix = mat4.create();
		this.projectionMatrix = mat4.create();

		setTimeout(() => {
			this._updateViewMatrix();
			this._updateProjectionMatrix();
		}, 0);
	}

	update(forceUpdate = false) {
		this._updateViewMatrix(forceUpdate);

		return this;
	}

	setPosition(x, y, z) {
		this.updatePosition(x, y, z);
	}

	updatePosition(x, y, z) {
		if (x !== undefined) this.position.x = x;
		if (y !== undefined) this.position.y = y;
		if (z !== undefined) this.position.z = z;

		return this;
	}

	setRotation(x, y, z) {
		this.updateRotation(x, y, z);
	}

	updateRotation(x, y, z) {
		if (x !== undefined) this.rotation.x = x;
		if (y !== undefined) this.rotation.y = y;
		if (z !== undefined) this.rotation.z = z;

		return this;
	}

	/**
	 *
	 * @param {Array}targetPosition
	 */
	lookAt(targetPosition) {
		if (Array.isArray(targetPosition)) mat4.lookAt(this.viewMatrix, this.position.array, targetPosition, [0, 1, 0]);
		else mat4.lookAt(this.viewMatrix, this.position.array, targetPosition.array, [0, 1, 0]);

		mat4.invert(this.rotation.matrix, this.viewMatrix);
		this.rotation.setFromRotationMatrix(this.rotation.matrix);
		this.needsUpdate = false;

		return this;
	}

	log() {
		console.log(
			`[PerspectiveCamera] position: {x: ${this.position.x}, y: ${this.position.y}, z: ${this.position.z} }`
		);
		console.log(
			`[PerspectiveCamera] rotation: {x: ${this.rotation.x}, y: ${this.rotation.y}, z: ${this.rotation.z} }`
		);
	}

	updateSize(width, height) {
		this._width = width;
		this._height = height;

		this._updateProjectionMatrix();
	}

	updateFov(fov, updateProjectionMatrix = true) {
		this._fov = fov;

		if (updateProjectionMatrix) this._updateProjectionMatrix();
	}

	updateDistance(near, far) {
		if (near) this._near = near;
		if (far) this._far = far;

		this._updateProjectionMatrix();
	}

	updateMatrix() {
		this.updateProjectionMatrix();
		this.updateViewMatrix();
	}

	updateProjectionMatrix() {
		this._updateProjectionMatrix();
	}

	updateViewMatrix() {
		this._updateViewMatrix();
	}

	_updateProjectionMatrix() {
		mat4.perspective(
			this.projectionMatrix,
			this._fov / 180 * Math.PI,
			this._width / this._height,
			this._near,
			this._far
		);
	}

	_updateViewMatrix(forceUpdate = false) {
		if (!this.rotation.needsMatrixUpdate && !this.needsUpdate && !forceUpdate) return;

		this.rotation.updateMatrix();
		mat4.copy(this.viewMatrix, this.rotation.matrix);
		this.viewMatrix[12] = this.position.array[0];
		this.viewMatrix[13] = this.position.array[1];
		this.viewMatrix[14] = this.position.array[2];
		mat4.invert(this.viewMatrix, this.viewMatrix);

		this.needsUpdate = false;

		return this;
	}
	
	get fov (){
		return this._fov;
	}
	
	get width (){
		return this._width;
	}
	
	get height (){
		return this._height;
	}
	
	get near (){
		return this._near;
	}
	
	get far (){
		return this._far;
	}
}