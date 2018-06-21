import { Geometry } from '../geometry'
import { generateWireframeIndices } from '../utils'

/**
 * Plane geometry wrapper with vertices, uvs and indices
 * @constructor 
 * @param {number} width - cube's width
 * @param {number} height - cube's height
 * @param {number} depth - cube's depth
 * @param {number} widthSegments - cube's x segments
 * @param {number} heightSegments - cube's y segments
 * @param {number} depthSegments - cube's z segments
 * @param {boolean} isWire - will the cube be rendered with lines?
 */

export class CubeGeometry extends Geometry {
    constructor (width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1, isWire = false) {
        super()

        this.isWire = isWire

        widthSegments = Math.floor(widthSegments)
        heightSegments = Math.floor(heightSegments)
        depthSegments = Math.floor(depthSegments)

		const verticesUvs = CubeGeometry.makeVerticesUvs(
			width,
			height,
			depth,
			widthSegments,
			heightSegments,
			depthSegments
		)
		const { vertices } = verticesUvs
		const { uvs } = verticesUvs

		if (isWire) {
			this.indices = generateWireframeIndices(
				CubeGeometry.getIndices(widthSegments, heightSegments, depthSegments)
			)
		} else {
			this.indices = CubeGeometry.getIndices(widthSegments, heightSegments, depthSegments)
		}

		console.log(this.indices)
		
		this.addAttribute(
			'a_position',
			vertices,
			3
		)
		this.addAttribute(
			'a_uv',
			uvs,
			2
		)
		this.addIndiceAttribute(this.indices)

    }

	static makeVerticesUvs (width, height, depth, widthSegment, heightSegment, depthSegment) {
		let vertices = []
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

					vertices.push(posx)
					vertices.push(dir * height / 2)
					vertices.push(posz)

					uvs.push(x * ratex)

					if (i == 1) uvs.push(z * ratez)
					else uvs.push(1.0 - z * ratez)
				}
			}
		}

		for (let i = 0; i < 2; i += 1) {
			let dir = i === 0 ? -1 : 1
			for (let y = 0; y <= heightSegment; y += 1) {
				let posy = (-0.5 + ratey * y) * height

				for (let x = 0; x <= widthSegment; x += 1) {
					let posx = (-0.5 + ratex * x) * width

					vertices.push(posx)
					vertices.push(posy)
					vertices.push(dir * depth / 2)

					if (i == 1) uvs.push(x * ratex)
					else uvs.push(1.0 - x * ratex)

					uvs.push(1.0 - y * ratey)
				}
			}
		}

		for (let i = 0; i < 2; i += 1) {
			
			let dir = i === 0 ? -1 : 1

			for (let y = 0; y <= heightSegment; y += 1) {
				let posy = (-0.5 + ratey * y) * height
				for (let z = 0; z <= depthSegment; z += 1) {
					let posz = (-0.5 + ratez * z) * depth

					vertices.push(dir * width / 2)
					vertices.push(posy)
					vertices.push(posz)

					if (i === 0) uvs.push(z * ratez)
					else uvs.push(1.0 - z * ratez)
					uvs.push(1.0 - y * ratey)
				}
			}
		}

		return { 
			vertices: new Float32Array(vertices), 
			uvs: new Float32Array(uvs)
		}
	}
	
	static getIndices(widthSegment, heightSegment, depthSegment) {
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