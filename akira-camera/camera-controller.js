/**
 * Taken from tubugl's camera ctrls class
 * https://github.com/kenjiSpecial/tubugl-camera/blob/master/src/cameraController.js
 */

import { vec3 } from 'gl-matrix'
import { Vector3 } from '../akira-math/vector3'
import { clamp } from '../akira-math/utils'

/**
 * Creates a camera controller to allow user to explore 3d scene with moving, panning and zooming
 * @class
 * @memberof Camera
 * @param {PerspectiveCamera|OrthographicCamera} - The camera to be controlled
 * @param {HTMLElement} [domElement = document.body] - The DOM element to attach the controller listeners to
 */

export class CameraController {
	constructor(camera, domElement = document.body) {

		if (!camera) {
			console.error('camera is undefined')
		}
		this._camera = camera
		this.domElement = domElement

		this.target = new Vector3()

		this.minDistance = 0
		this.maxDistance = Infinity
		this.isEnabled = true

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.isDamping = false
		this.dampingFactor = 0.25

		// This option actually enables dollying in and out left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.isZoom = true
		this.zoomSpeed = 1.0

		// Set to false to disable rotating
		this.isRotate = true
		this.rotateSpeed = 1.0

		// Set to false to disable panning
		this.isPan = true
		this.keyPanSpeed = 7.0 // pixels moved per arrow key push

		// Set to false to disable use of the keys
		this.enableKeys = true

		// The four arrow keys
		this.keys = {
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			BOTTOM: 40,
			SHIFT: 16
		}

		// for reset
		this.originTarget = new Vector3()
		this.originPosition = new Vector3(this._camera.position.x, this._camera.position.y, this._camera.position.z)

		this._isShiftDown = false

		this._rotateStart = {
			x: null,
			y: null
		}
		this._rotateEnd = {
			x: null,
			y: null
		}
		this._roatteDelta = {
			x: null,
			y: null
		}

		let dX = this._camera.position.x
		let dY = this._camera.position.y
		let dZ = this._camera.position.z
		let radius = Math.sqrt(dX * dX + dY * dY + dZ * dZ)
		let theta = Math.atan2(this._camera.position.x, this._camera.position.z) // equator angle around y-up axis
		let phi = Math.acos(clamp(this._camera.position.y / radius, -1, 1)) // polar angle
		
		this._spherical = {
			radius: radius,
			theta: theta,
			phi: phi
		}
		this._pan = {
			axis: {}
		}

		this._contextMenuHandler = this._contextMenuHandler.bind(this)
		this._mouseDownHandler = this._mouseDownHandler.bind(this)
		this._mouseWheelHandler = this._mouseWheelHandler.bind(this)
		this._mouseMoveHandler = this._mouseMoveHandler.bind(this)
		this._mouseUpHandler = this._mouseUpHandler.bind(this)
		this._touchStartHandler = this._touchStartHandler.bind(this)
		this._touchEndHandler = this._touchEndHandler.bind(this)
		this._touchMoveHandler = this._touchMoveHandler.bind(this)
		this._onKeyDownHandler = this._onKeyDownHandler.bind(this)
		this._onKeyUpHandler = this._onKeyUpHandler.bind(this)

		this.domElement.addEventListener('contextmenu', this._contextMenuHandler, false)
		this.domElement.addEventListener('mousedown', this._mouseDownHandler, false)
		this.domElement.addEventListener('wheel', this._mouseWheelHandler, false)
		this.domElement.addEventListener('touchstart', this._touchStartHandler, false)
		this.domElement.addEventListener('touchend', this._touchEndHandler, false)
		this.domElement.addEventListener('touchmove', this._touchMoveHandler, false)
		window.addEventListener('keydown', this._onKeyDownHandler, false)
		window.addEventListener('keyup', this._onKeyUpHandler, false)
	}
	/**
	 * Remove the controller's event listeners
	 */
	removeEventHandler() {
		this.domElement.removeEventListener('contextmenu', this._contextMenuHandler, false)
		this.domElement.removeEventListener('mousedown', this._mouseDownHandler, false)
		this.domElement.removeEventListener('wheel', this._mouseWheelHandler, false)
		this.domElement.removedEventListener('mousemove', this._mouseMoveHandler, false)
		window.removeEventListener('mouseup', this._mouseUpHandler, false)

		this.domElement.removeEventListener('touchstart', this._touchStartHandler, false)
		this.domElement.removeEventListener('touchend', this._touchEndHandler, false)
		this.domElement.removeEventListener('touchmove', this._touchMoveHandler, false)

		window.removeEventListener('keydown', this._onKeyDownHandler, false)
		window.removeEventListener('keydown', this._onKeyUpHandler, false)
	}
	/**
	 * Update camera's position and lookAt
	 */
	update () {
		let s = this._spherical
		var sinPhiRadius = Math.sin(s.phi) * s.radius

		this._camera.position.x = sinPhiRadius * Math.sin(s.theta) + this.target.x
		this._camera.position.y = Math.cos(s.phi) * s.radius + this.target.y
		this._camera.position.z = sinPhiRadius * Math.cos(s.theta) + this.target.z

		this._camera.lookAt(this.target)
	}

	_contextMenuHandler(event) {
		if (!this.isEnabled) return

		event.preventDefault()
	}
	_mouseDownHandler(event) {
		if (!this.isEnabled) return

		if (event.button == 0) {
			this.state = 'rotate'
			this._rotateStart = {
				x: event.clientX,
				y: event.clientY
			}
		} else {
			this.state = 'pan'
			this._panStart = {
				x: event.clientX,
				y: event.clientY
			}
		}

		this.domElement.addEventListener('mousemove', this._mouseMoveHandler, false)
		window.addEventListener('mouseup', this._mouseUpHandler, false)
	}
	_mouseUpHandler() {
		this.domElement.removeEventListener('mousemove', this._mouseMoveHandler, false)
		window.removeEventListener('mouseup', this._mouseUpHandler, false)
	}
	_mouseMoveHandler(event) {
		if (!this.isEnabled) return

		if (this.state === 'rotate') {
			this._rotateEnd = {
				x: event.clientX,
				y: event.clientY
			}
			this._roatteDelta = {
				x: this._rotateEnd.x - this._rotateStart.x,
				y: this._rotateEnd.y - this._rotateStart.y
			}

			this._updateRotateHandler()

			this._rotateStart = {
				x: this._rotateEnd.x,
				y: this._rotateEnd.y
			}
		} else if (this.state === 'pan') {
			this._panEnd = {
				x: event.clientX,
				y: event.clientY
			}
			this._panDelta = {
				x: -0.5 * (this._panEnd.x - this._panStart.x),
				y: 0.5 * (this._panEnd.y - this._panStart.y)
			}

			this._updatePanHandler()
			this._panStart = {
				x: this._panEnd.x,
				y: this._panEnd.y
			}
		}
		this.update()
	}
	_mouseWheelHandler(event) {
		if (event.deltaY > 0) {
			this._spherical.radius *= 1.05
		} else {
			this._spherical.radius *= 0.95
		}

		this._spherical.radius = clamp(this._spherical.radius, this.minDistance, this.maxDistance)

		this.update()
	}

	_touchStartHandler(event) {
		let dX, dY
		switch (event.touches.length) {
			case 1:
				this.state = 'rotate'
				this._rotateStart = {
					x: event.touches[0].clientX,
					y: event.touches[0].clientY
				}
				break
			case 2:
				this.state = 'zoom'
				dX = event.touches[1].clientX - event.touches[0].clientX
				dY = event.touches[1].clientY - event.touches[0].clientY
				this._zoomDistance = Math.sqrt(dX * dX + dY * dY)
				break
			case 3:
				this.state = 'pan'
				this._panStart = {
					x: (event.touches[0].clientX + event.touches[1].clientX + event.touches[2].clientX) / 3,
					y: (event.touches[0].clientY + event.touches[1].clientY + event.touches[2].clientY) / 3
				}

				break
		}
	}

	_touchMoveHandler(event) {
		let dX, dY, dDis
		switch (event.touches.length) {
			case 1:
				if (this.state !== 'rotate') return
				this._rotateEnd = {
					x: event.touches[0].clientX,
					y: event.touches[0].clientY
				}
				this._roatteDelta = {
					x: (this._rotateEnd.x - this._rotateStart.x) * 0.5,
					y: (this._rotateEnd.y - this._rotateStart.y) * 0.5
				}

				this._updateRotateHandler()

				this._rotateStart = {
					x: this._rotateEnd.x,
					y: this._rotateEnd.y
				}
				break
			case 2:
				if (this.state !== 'zoom') return
				dX = event.touches[1].clientX - event.touches[0].clientX
				dY = event.touches[1].clientY - event.touches[0].clientY
				this._zoomDistanceEnd = Math.sqrt(dX * dX + dY * dY)

				dDis = this._zoomDistanceEnd - this._zoomDistance
				dDis *= 1.5

				var targetRadius = this._spherical.radius - dDis
				targetRadius = clamp(targetRadius, this.minDistance, this.maxDistance)
				this._zoomDistance = this._zoomDistanceEnd

				TweenLite.killTweensOf(this._spherical)
				TweenLite.to(this._spherical, 0.3, {
					radius: targetRadius,
					onUpdate: () => {
						this.update()
					}
					// ease: Quint.easeOut
				})

				break
			case 3:
				this._panEnd = {
					x: (event.touches[0].clientX + event.touches[1].clientX + event.touches[2].clientX) / 3,
					y: (event.touches[0].clientY + event.touches[1].clientY + event.touches[2].clientY) / 3
				}
				this._panDelta = {
					x: this._panEnd.x - this._panStart.x,
					y: this._panEnd.y - this._panStart.y
				}

				this._updatePanHandler()
				this._panStart = {
					x: this._panEnd.x,
					y: this._panEnd.y
				}
				break
		}

		this.update()
	}

	_touchEndHandler(event) {}

	_onKeyDownHandler(event) {
		let dX = 0,
			dY = 0

		switch (event.keyCode) {
			case this.keys.SHIFT:
				this._isShiftDown = true
				break
			case this.keys.LEFT:
				dX = -10
				break
			case this.keys.RIGHT:
				dX = 10
				break
			case this.keys.UP:
				dY = 10
				break
			case this.keys.BOTTOM:
				dY = -10
				break
		}

		if (!this._isShiftDown) {
			this._panDelta = {
				x: dX,
				y: dY
			}
			this._updatePanHandler()
		} else {
			this._roatteDelta = {
				x: -dX,
				y: dY
			}
			this._updateRotateHandler()
		}

		this.update()
	}
	_onKeyUpHandler(event) {
		switch (event.keyCode) {
			case this.keys.SHIFT:
				this._isShiftDown = false
				break
		}
	}
	_updatePanHandler() {
		let xDir = vec3.create()
		let yDir = vec3.create()
		let zDir = vec3.create()
		zDir[0] = this.target.x - this._camera.position.x
		zDir[1] = this.target.y - this._camera.position.y
		zDir[2] = this.target.z - this._camera.position.z
		vec3.normalize(zDir, zDir)

		vec3.cross(xDir, zDir, [0, 1, 0])
		vec3.cross(yDir, xDir, zDir)

		this.target.x += xDir[0] * this._panDelta.x + yDir[0] * this._panDelta.y
		this.target.y += xDir[1] * this._panDelta.x + yDir[1] * this._panDelta.y
		this.target.z += xDir[2] * this._panDelta.x + yDir[2] * this._panDelta.y
	}
	_updateRotateHandler() {
		this._spherical.theta += -this._roatteDelta.x / this.domElement.clientWidth * Math.PI
		this._spherical.phi += -this._roatteDelta.y / this.domElement.clientHeight * Math.PI
	}
}