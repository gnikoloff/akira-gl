import createCamera from 'perspective-camera'

let w = window.innerWidth
let h = window.innerHeight

export class PerspectiveCamera {
	
	constructor (fov = Math.PI / 4, near = 0.01, far = 1000, viewport = [ 0, 0, w, h ]) {
		this.camera = createCamera({
			fov,
			near,
			far,
			viewport
		})
	}

	get viewMatrix () {
		return this.camera.view
	}

	get projectionMatrix () {
		return this.camera.projection
	}

	translate (x = 0, y = 0, z = 0) {
		this.camera.translate([ x, y, z ])
	}

	lookAt (x = 0, y = 0, z = 0) {
		this.camera.lookAt([ x, y, z ])
	}

	update () {
		this.camera.update()
	}

}