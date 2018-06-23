import { vec3 } from 'gl-matrix'
import { LINE_STRIP } from '../../akira-constants'
import { Geometry } from '../geometry'
import { generateWireframeIndices } from '../utils'

/**
 * Sphere geometry wrapper with vertices, uvs, normals and indices
 * @constructor 
 * @param {number} radius
 * @param {number} widthSegments
 * @param {number} heightSegments
 * @param {number} phiStart
 * @param {number} phiLength
 * @param {number} thetaStart
 * @param {number} thetaLength
*/
export class SphereGeometry extends Geometry {
    constructor (
        radius = 2,
        widthSegments = 20,
        heightSegments = 20,
        phiStart = 0,
        phiLength = Math.PI * 2,
        thetaStart = 0,
        thetaLength = Math.PI * 2
    ) {
        super()

        let {
            verticesUvsNormals,
            indices
        } = SphereGeometry.getData(
                radius, 
                widthSegments, 
                heightSegments, 
                phiStart, 
                phiLength, 
                thetaStart, 
                thetaLength
        )

        this.verticesUvsNormals = verticesUvsNormals
        this.indices = indices

    }

    init (gl, drawOperation) {
        const { indices } = this
        if (drawOperation === LINE_STRIP) {
            this.indices = generateWireframeIndices(indices)
        } else {
            this.indices = indices
        }
        
        this.addInterleavedAttribute(this.verticesUvsNormals, [
            { name: 'a_position', size: 3 },
            { name: 'a_uv', size: 2 },
            { name: 'a_normal', size: 3 }
        ])
        this.addIndiceAttribute(this.indices)
        
        super.init(gl, drawOperation)
        return this
    }

    static getData (
        radius, 
        widthSegments, 
        heightSegments, 
        phiStart, 
        phiLength, 
        thetaStart, 
        thetaLength
    ) {

        let grid = []
		let indices = []
		let verticesUvsNormals = []
		let index = 0
		let normalVec3 = vec3.create()

		for (let y = 0; y <= heightSegments; y += 1) {

			let verticeRow = []
			let v = y / heightSegments

			for (let x = 0; x <= widthSegments; x += 1) {
				let u = x / widthSegments
				let phi = phiStart + phiLength * u
				let theta = thetaStart + thetaLength * v

				let vertex = [
					-radius * Math.cos(phi) * Math.sin(theta),
					radius * Math.cos(theta),
					radius * Math.sin(phi) * Math.sin(theta)
				]

				vec3.normalize(normalVec3, vertex)

                verticesUvsNormals.push(
                    // pos
                    vertex[0], vertex[1], vertex[2],
                    // uv
                    u, 1 - v,
                    // normal
                    normalVec3[0], normalVec3[1], normalVec3[2]
                )

				verticeRow.push(index++)
			}

			grid.push(verticeRow)
		}

		let thetaEnd = thetaStart + thetaLength

		for (let y = 0; y < heightSegments; y += 1) {
			for (let x = 0; x < widthSegments; x += 1) {
				let a = grid[y][x + 1]
				let b = grid[y][x]
				let c = grid[y + 1][x]
				let d = grid[y + 1][x + 1]

				if (y !== 0 || thetaStart > 0) indices.push(a, b, d)
				if (y !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d)
			}
		}

		return { 
            verticesUvsNormals: new Float32Array(verticesUvsNormals),
            indices: new Uint16Array(indices)
        }

    }

}