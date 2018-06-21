import { vec3 } from 'gl-matrix'

import { Geometry } from '../geometry'
import { generateWireframeIndices } from '../utils'

export class SphereGeometry extends Geometry {
    constructor (
        radius = 2,
        widthSegments = 20,
        heightSegments = 20,
        phiStart = 0,
        phiLength = Math.PI * 2,
        thetaStart = 0,
        thetaLength = Math.PI * 2,
        isWire = false
    ) {
        super()

        this.isWire = isWire

        let {
            vertices,
            uvs,
            normals,
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

        if (this.isWire) {
            this.indices = generateWireframeIndices(indices)
        } else {
            this.indices = indices
        }

        this.addAttribute('a_position', vertices, 3)
        this.addAttribute('a_uv', uvs, 2)
        this.addAttribute('a_normal', normals, 3)
        this.addIndiceAttribute(indices)

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
		let vertices = []
		let normals = []
		let uvs = []
		let index = 0
		let normalVec3 = vec3.create()

		for (let y = 0; y <= heightSegments; y += 1) {

			let verticeRow = []
			let v = y / heightSegments

			for (let x = 0; x <= widthSegments; x += 1) {
				var u = x / widthSegments
				let phi = phiStart + phiLength * u
				let theta = thetaStart + thetaLength * v

				let vertex = [
					-radius * Math.cos(phi) * Math.sin(theta),
					radius * Math.cos(theta),
					radius * Math.sin(phi) * Math.sin(theta)
				]

				vertices.push(vertex[0], vertex[1], vertex[2])

				vec3.normalize(normalVec3, vertex)
				normals.push(normalVec3[0], normalVec3[1], normalVec3[2])

				uvs.push(u, 1 - v)

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
            vertices: new Float32Array(vertices), 
            uvs: new Float32Array(uvs), 
            normals: new Float32Array(normals), 
            indices: new Uint16Array(indices)
        }

    }

}