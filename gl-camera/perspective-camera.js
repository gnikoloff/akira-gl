import createCamera from 'perspective-camera'

let w = window.innerWidth
let h = window.innerHeight

export class PerspectiveCamera {
	
	constructor (width = w, height = h, fov = Math.PI / 4, near = 0.01, far = 1000) {
		this.camera = createCamera({
			fov,
			near,
			far,
			viewport: [ 0, 0, width, height ]
		})
	}

	get viewMatrix () {
		return this.camera.view
	}

	get projectionMatrix () {
		return this.camera.projection
	}

	setPosition (x, y, z) {
		this.identity()
		this.translate(x, y, z)
	}

	identity () {
		this.camera.identity()
	}

	translate (x = 0, y = 0, z = 0) {
		this.camera.translate([ x, y, z ])
	}

	lookAt (arr = [ 0, 0, 0 ]) {
		this.camera.lookAt(arr)
	}

	update () {
		this.camera.update()
	}

}