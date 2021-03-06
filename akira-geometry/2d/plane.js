import { Geometry } from '../geometry'
import { FLOAT } from '../../akira-constants'

/**
 * Plane geometry wrapper with vertices, uvs and indices
 * @constructor 
 * @param {number} width - plane's width
 * @param {number} height - plane's height
 * @param {number} widthSegments - plane's x segments
 * @param {number} heightSegments - plane's y segments
 */

export class PlaneGeometry extends Geometry {
    constructor (width, height, widthSegments = 1, heightSegments = 1) {
        super()
        
        // this.vertices = this.makeVertices(widthSegments, heightSegments, width, height)
        // this.uvs = this.makeUvs(widthSegments, heightSegments)
        this.indices = this.makeIndices(widthSegments, heightSegments)   
        // this.addAttribute('a_position', this.vertices, 2)
        // this.addAttribute('a_uv', this.uvs, 2)

        const verticesUvs = this.makeVertices(widthSegments, heightSegments, width, height)
        this.addInterleavedAttribute(verticesUvs, [
            {
                name: 'a_position',
                size: 2,
                type: FLOAT,
                normalize: false
            },
            {
                name: 'a_uv',
                size: 2,
                type: FLOAT,
                normalize: false
            }
        ])
        this.addIndiceAttribute(this.indices)

    }

    makeVertices (widthSegments, heightSegments, width, height) {
        let verticesArr = []
        let ratex = 1 / widthSegments
        let ratey = 1 / heightSegments

        for (let y = 0; y <= heightSegments; y += 1) {
            let posy = (-0.5 + ratey * y) * height
            let uvy = 1.0 - ratey * y
            for (let x = 0; x <= widthSegments; x += 1) {
                let posx = (-0.5 + ratex * x) * width
                let uvx = 1.0 - ratex * x
                verticesArr.push(posx, posy, uvx, uvy)
            }
        }
        return new Float32Array(verticesArr)
    }

    makeUvs (widthSegments, heightSegments) {
        let uvsArr = []
        let ratex = 1 / widthSegments
        let ratey = 1 / heightSegments
        for (let y = 0; y <= heightSegments; y += 1) {
            let uvy = 1.0 - ratey * y
            for (let x = 0; x <= widthSegments; x += 1) {
                let uvx = 1.0 - ratex * x
                uvsArr.push(uvx, uvy)
            }
        }
        return new Float32Array(uvsArr)
    }

    makeIndices (widthSegment, heightSegment) {
        let indices = []

		for (let yy = 0; yy < heightSegment; yy++) {
			for (let xx = 0; xx < widthSegment; xx++) {
				let rowStartNum = yy * (widthSegment + 1);
				let nextRowStartNum = (yy + 1) * (widthSegment + 1);

				indices.push(rowStartNum + xx);
				indices.push(rowStartNum + xx + 1);
				indices.push(nextRowStartNum + xx);

				indices.push(rowStartNum + xx + 1);
				indices.push(nextRowStartNum + xx + 1);
				indices.push(nextRowStartNum + xx);
			}
		}

		return new Uint16Array(indices)
    }

}