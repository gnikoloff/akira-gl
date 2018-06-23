import { LINE_STRIP } from '../../akira-constants'
import { Geometry } from '../geometry'
import { generateWireframeIndices } from '../utils'

/**
 * Cube geometry wrapper with vertices, uvs, normals and indices
 * @constructor 
 * @param {number} width - cube's width
 * @param {number} height - cube's height
 * @param {number} depth - cube's depth
 * @param {number} widthSegments - cube's x segments
 * @param {number} heightSegments - cube's y segments
 * @param {number} depthSegments - cube's z segments
*/
export class CubeGeometry extends Geometry {
    constructor (width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        super()

		this._width = width
		this._height = height
		this._depth = depth
        this._widthSegments = Math.floor(widthSegments)
        this._heightSegments = Math.floor(heightSegments)
        this._depthSegments = Math.floor(depthSegments)

		const verticesUvsNormals = CubeGeometry.makeVerticesUvs(
			width,
			height,
			depth,
			widthSegments,
			heightSegments,
			depthSegments
		)
		this.verticesUvsNormals = verticesUvsNormals
		// this.normals = CubeGeometry.makeNormals(widthSegments, heightSegments, depthSegments)

    }

	init (gl, drawOperation) {
		if (drawOperation === LINE_STRIP) {
			this.indices = generateWireframeIndices(
				this.getIndices(
					this._widthSegments, 
					this._heightSegments, 
					this._depthSegments
				)
			)
		} else {
			this.indices = this.getIndices(
				this._widthSegments, 
				this._heightSegments, 
				this._depthSegments
			)
		}
		this.addInterleavedAttribute(this.verticesUvsNormals, [
			{ name: 'a_position', size: 3 },
			{ name: 'a_uv', size: 2 },
			{ name: 'a_normal', size: 3 }
		])
		this.addIndiceAttribute(this.indices)

		super.init(gl, drawOperation)
	}

	static makeVerticesUvs (width, height, depth, widthSegment, heightSegment, depthSegment) {
		let verticesUvsNormals = []
		let uvs = []
		let ratex = 1 / widthSegment
		let ratey = 1 / heightSegment
		let ratez = 1 / depthSegment

		for (let i = 0; i < 2; i += 1) {
			let dir = i === 0 ? -1 : 1

			for (let z = 0; z <= depthSegment; z += 1) {
				let posz = (-0.5 + ratez * z) * depth

				for (let x = 0; x <= widthSegment; x += 1) {
					let posx = (-0.5 + ratex * x) * width

					verticesUvsNormals.push(
						// pos
						posx,
						dir * height / 2,
						posz,
						// uv
						x * ratex,
						i === 1 ? z * ratez : 1.0 - z * ratez,
						// normal
						0, dir, 0
					)
				}
			}
		}

		for (let i = 0; i < 2; i += 1) {
			let dir = i === 0 ? -1 : 1
			for (let y = 0; y <= heightSegment; y += 1) {
				let posy = (-0.5 + ratey * y) * height

				for (let x = 0; x <= widthSegment; x += 1) {
					let posx = (-0.5 + ratex * x) * width

					verticesUvsNormals.push(
						// pos
						posx,
						posy,
						dir * depth / 2,
						// uv
						i === 1 ? x * ratex : 1.0 - x * ratex,
						1.0 - y * ratey,
						// normal 
						0, 0, dir
					)
				}
			}
		}

		for (let i = 0; i < 2; i += 1) {
			
			let dir = i === 0 ? -1 : 1

			for (let y = 0; y <= heightSegment; y += 1) {
				let posy = (-0.5 + ratey * y) * height
				for (let z = 0; z <= depthSegment; z += 1) {
					let posz = (-0.5 + ratez * z) * depth

					verticesUvsNormals.push(
						// pos
						dir * width / 2,
						posy,
						posz,
						// uv
						i === 0 ? z * ratez : 1.0 - z * ratez,
						1.0 - y * ratey,
						// normal
						dir, 0, 0
					)
				}
			}
		}

		return new Float32Array(verticesUvsNormals)
	}

	static makeNormals (widthSegment, heightSegment, depthSegment) {
		let normals = []

		for (let ii = 0; ii < 2; ii++) {
			let dir = ii == 0 ? -1 : 1
			for (let yy = 0; yy <= depthSegment; yy++) {
				for (let xx = 0; xx <= widthSegment; xx++) {
					normals.push(0)
					normals.push(dir)
					normals.push(0)
				}
			}
		}

		for (let ii = 0; ii < 2; ii++) {
			let dir = ii == 0 ? -1 : 1
			for (let yy = 0; yy <= heightSegment; yy++) {
				for (let xx = 0; xx <= widthSegment; xx++) {
					normals.push(0)
					normals.push(0)
					normals.push(dir)
				}
			}
		}

		for (let ii = 0; ii < 2; ii++) {
			let dir = ii == 0 ? -1 : 1
			for (let yy = 0; yy <= heightSegment; yy++) {
				for (let xx = 0; xx <= depthSegment; xx++) {
					normals.push(dir)
					normals.push(0)
					normals.push(0)
				}
			}
		}

		return new Float32Array(normals)
	}
	
	getIndices(widthSegment, heightSegment, depthSegment) {
		let indices = []
		let num = 0

		for (let i = 0; i < 2; i += 1) {
			for (let y = 0; y < depthSegment; y += 1) {
				for (let x = 0; x < widthSegment; x += 1) {
					let rowStartNum = y * (widthSegment + 1)
					let nextRowStartNum = (y + 1) * (widthSegment + 1)

					if (i == 0) {
						indices.push(rowStartNum + x + num)
						indices.push(rowStartNum + x + 1 + num)
						indices.push(nextRowStartNum + x + 1 + num)

						indices.push(rowStartNum + x + num)
						indices.push(nextRowStartNum + x + 1 + num)
						indices.push(nextRowStartNum + x + num)
					} else {
						indices.push(rowStartNum + x + num)
						indices.push(nextRowStartNum + x + num)
						indices.push(rowStartNum + x + 1 + num)

						indices.push(rowStartNum + x + 1 + num)
						indices.push(nextRowStartNum + x + num)
						indices.push(nextRowStartNum + x + 1 + num)
					}
				}
			}

			num += (widthSegment + 1) * (depthSegment + 1)
		}

		for (let ii = 0; ii < 2; ii++) {
			for (let yy = 0; yy < heightSegment; yy++) {
				for (let xx = 0; xx < widthSegment; xx++) {
					let rowStartNum = yy * (widthSegment + 1);
					let nextRowStartNum = (yy + 1) * (widthSegment + 1);

					if (ii == 0) {
						indices.push(rowStartNum + xx + num);
						indices.push(nextRowStartNum + xx + num);
						indices.push(rowStartNum + xx + 1 + num);

						indices.push(rowStartNum + xx + 1 + num);
						indices.push(nextRowStartNum + xx + num);
						indices.push(nextRowStartNum + xx + 1 + num);
					} else {
						indices.push(rowStartNum + xx + num);
						indices.push(rowStartNum + xx + 1 + num);
						indices.push(nextRowStartNum + xx + num + 1);

						indices.push(rowStartNum + xx + num);
						indices.push(nextRowStartNum + xx + 1 + num);
						indices.push(nextRowStartNum + xx + num);
					}
				}
			}

			num += (widthSegment + 1) * (heightSegment + 1);
		}

		for (let i = 0; i < 2; i += 1) {
			for (let y = 0; y < heightSegment; y += 1) {
				for (let z = 0; z < depthSegment; z += 1) {
					let rowStartNum = y * (depthSegment + 1)
					let nextRowStartNum = (y + 1) * (depthSegment + 1)

					if (i == 0) {
						indices.push(rowStartNum + z + num)
						indices.push(rowStartNum + z + 1 + num)
						indices.push(nextRowStartNum + z + 1 + num)

						indices.push(rowStartNum + z + num)
						indices.push(nextRowStartNum + z + 1 + num)
						indices.push(nextRowStartNum + z + num)
					} else {
						indices.push(rowStartNum + z + num)
						indices.push(nextRowStartNum + z + num)
						indices.push(rowStartNum + z + 1 + num)

						indices.push(rowStartNum + z + 1 + num)
						indices.push(nextRowStartNum + z + num)
						indices.push(nextRowStartNum + z + num + 1)
					}
				}
			}

			num += (depthSegment + 1) * (heightSegment + 1)
		}

		return new Uint16Array(indices)
	}

    
}