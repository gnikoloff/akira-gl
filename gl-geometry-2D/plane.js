import {
    FLOAT,
    ELEMENT_ARRAY_BUFFER,
    ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

import { Geometry } from '../gl-core'

export class PlaneGeometry extends Geometry {
    constructor (width, height, widthSegments, heightSegments) {
        super()
        
        this.vertices = this.makeVertices(widthSegments, heightSegments, width, height)
        this.uvs = this.makeUvs(widthSegments, heightSegments)
        this.indices = this.makeIndices(widthSegments, heightSegments)   

        this.attribs.push(
            {
                name: 'a_position',
                bufferType: ARRAY_BUFFER,
                array: this.vertices,
                attribType: FLOAT,
                itemsPerVert: 2,
                mode: STATIC_DRAW
            },
            {
                bufferType: ELEMENT_ARRAY_BUFFER,
                array: this.indices,
                mode: STATIC_DRAW
            }
        )
    }

    makeVertices (widthSegments, heightSegments, width, height) {
        let verticesArr = []
        let ratex = 1 / widthSegments
        let ratey = 1 / heightSegments

        for (let y = 0; y <= heightSegments; y += 1) {
            let posy = (-0.5 + ratey * y) * height

            for (let x = 0; x <= widthSegments; x += 1) {
                let posx = (-0.5 + ratex * x) * width

                verticesArr.push(posx, posy)
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
        console.log(uvsArr)
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

		indices = new Uint16Array(indices);

		return indices;
    }

}