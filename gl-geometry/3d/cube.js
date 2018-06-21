import { Geometry } from '../geometry'

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
        

    }

    
}