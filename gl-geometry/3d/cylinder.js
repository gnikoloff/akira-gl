import { vec3 } from 'gl-matrix'
import { LINE_STRIP } from '../../gl-constants'
import { Geometry } from '../geometry'
import { generateWireframeIndices } from '../utils'

/**
 * Cylinder geometry wrapper with vertices, uvs, normals and indices
 * @constructor 
 * @param {number} radiusTop
 * @param {number} radiusBottom
 * @param {number} height
 * @param {number} radialSegments
 * @param {number} heightSegments
*/
export class CylinderGeometry extends Geometry {
    constructor (
        radiusTop = 2,
        radiusBottom = 2,
        height = 5,
        radialSegments = 3,
        heightSegments = 2
    ) {
        super()

        this._radiusTop = radiusTop
        this._radiusBottom = radiusBottom
        this._height = height
        this._radialSegments = radialSegments
        this._heightSegments = heightSegments

        if (radialSegments < 3) {
			console.warn('make sure radialsegments are more than 3')
			return
        }

        const {
            vertices,
            uvs,
            normals,
            indices
        } = this._getData()

		this.vertices = vertices
		this.uvs = uvs
		this.normals = normals
		this.indices = indices

    }

	init (gl, drawOperation) {
		const { indices } = this
		if (drawOperation === LINE_STRIP) {
            this.indices = generateWireframeIndices(indices)
        } else {
            this.indices = indices
        }

        this.addAttribute('a_position', this.vertices, 3)
        this.addAttribute('a_uv', this.uvs, 2)
        this.addAttribute('a_normal', this.normals, 3)
        this.addIndiceAttribute(this.indices)

		super.init(gl, drawOperation)
	}

    // private

    _getData () {
        let vertices = []
        let uvs = []
        let normals = []
        let indices = []
        let index = 0

        index = this._generateTorso(vertices, uvs, normals, indices, index)
        index = this._generateCap(true, vertices, uvs, normals, indices, index)
        index = this._generateCap(false, vertices, uvs, normals, indices, index)

        return {
            vertices: new Float32Array(vertices),
            uvs: new Float32Array(uvs),
            normals: new Float32Array(normals),
            indices: new Uint16Array(indices)
        }

    }

    _generateTorso (vertices, uvs, normals, indices, index) {
        let slope = (this._radiusBottom - this._radiusBottom) / this._height
		let indexArray = []

		let normal = vec3.create()

		for (let y = 0; y <= this._heightSegments; y += 1) {
            
            let indexRow = []
			let v = y / this._heightSegments
			let radius = v * (this._radiusBottom - this._radiusTop) + this._radiusTop

			for (let x = 0; x <= this._radialSegments; x += 1) {
				let u = x / this._radialSegments;
				let theta = 2 * Math.PI * u

				let sinTheta = Math.sin(theta)
				let cosTheta = Math.cos(theta)

				vertices.push(radius * sinTheta, (-v + 0.5) * this._height, radius * cosTheta)
				vec3.normalize(normal, [sinTheta, slope, cosTheta])
				normals.push(normal[0], normal[1], normal[2])
				uvs.push(u, 1 - v)

				indexRow.push(index++)
			}

			indexArray.push(indexRow)
		}

		for (let x = 0; x < this._radialSegments; x += 1) {
			for (let y = 0; y < this._heightSegments; y += 1) {
				let a = indexArray[y][x]
				let b = indexArray[y + 1][x]
				let c = indexArray[y + 1][x + 1]
				let d = indexArray[y][x + 1]

				// faces

				indices.push(a, b, d)
				indices.push(b, c, d)
			}
		}

		return index
    }

    _generateCap (isTop = true, vertices, uvs, normals, indices, index) {
        let centerIndexStart
        let centerIndexEnd

		let sign = isTop === true ? 1 : -1
		let radius = isTop === true ? this._radiusTop : this._radiusBottom

		centerIndexStart = index

		for (let x = 1; x <= this._radialSegments; x += 1) {
			vertices.push(0, this._height / 2 * sign, 0)
			normals.push(0, sign, 0)
			uvs.push(0.5, 0.5)
			index++
		}

		centerIndexEnd = index

		for (let x = 0; x <= this._radialSegments; x += 1) {
			let u = x / this._radialSegments
			let theta = u * 2 * Math.PI

			let cosTheta = Math.cos(theta)
			let sinTheta = Math.sin(theta)

			vertices.push(radius * sinTheta, sign * this._height / 2, radius * cosTheta)

			normals.push(0, sign, 0)

			uvs.push(cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5)
			index++
		}

		for (let x = 0; x < this._radialSegments; x += 1) {
			let c = centerIndexStart + x
			let i = centerIndexEnd + x

			if (top === true) {
				// face top

				indices.push(i, i + 1, c)
			} else {
				// face bottom

				indices.push(i + 1, i, c)
			}
		}

		return index
    }

}