import {
    FLOAT,
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../akira-constants'

import { ArrayBuffer } from '../akira-core'
import { InterleavedArrayBuffer } from '../akira-core'
import { IndexArrayBuffer } from '../akira-core'

/**
 * Base geometry class
 * @class
 * @param {Array} buffers - supply buffer and associated attribs to be bound to geometry's Vertex Array Object
 */
export class Geometry {
    
    constructor (buffers = []) {
        this.buffers = buffers
    }

    /**
     * Initialize geometry
     * @param {WebGLRenderingContext} gl 
     * @param {GLenum} drawOperation 
     * @returns {Array} - arrays of buffers
     */

    init (gl, drawOperation) {
        this._gl = gl
        this.drawOperation = drawOperation

        this.hasIndices = this.buffers.find(attrib => {
            if (attrib.type === ELEMENT_ARRAY_BUFFER) return true
        })
        if (this.hasIndices) {
            if (this._isCopied) {
                this.vertexCount = this._refGeometry.indices.length
            } else {
                this.vertexCount = this.indices.length
            }
        } else {
            let vertices
            if (this._isCopied) {
                vertices = this._refGeometry.buffers.find(attrib => {
                    return attrib.name === 'a_position'
                })
            } else {
                vertices = this.buffers.find(attrib => {
                    return attrib.name === 'a_position'
                })
            }
            this.vertexCount = vertices.count
        }

        return this.buffers
    }

    /**
     * Adds attribute and associated buffer with it
     * @param {string} name - attrib name
     * @param {Float32Array|Float64Array} array - associated array
     * @param {number} size - size per vertex
     * @param {GLenum} type 
     * @param {boolean} normalize 
     * @param {number} stride 
     * @param {number} offset 
     */

    addAttribute (
        name, 
        array, 
        size = 2, 
        type = FLOAT, 
        normalize = false, 
        stride = 0,
        offset = 0
    ) {
    this.buffers.push(new ArrayBuffer(
            name,
            array,
            size,
            type,
            normalize,
            stride,
            offset
        ))
    }

    addInterleavedAttribute (array, buffersInfo) {
        console.log(buffersInfo)
        this.buffers.push(new InterleavedArrayBuffer(array, buffersInfo))
    }

    /**
     * Add's indice attribute for reducing vertex redundancy
     * @param {Uint16Array|Uint32Array} array 
     */

    addIndiceAttribute (array) {
        this.buffers.push(new IndexArrayBuffer(array))
    }

    /**
     * Copies geometry to a new one
     * @param {Geometry} geometry 
     * @returns {Geometry} `this`
     */

    fromGeometry (geometry) {
        const indices = geometry.buffers.find(buffer => {
            return buffer.type === ELEMENT_ARRAY_BUFFER
        })
        if (indices) {
            this.indices = indices._array
            this.hasIndices = true
        }
        
        this.buffers = geometry.buffers
        this._isCopied = true 
        this._refGeometry = geometry
        return this
    }

    /**
     * Draw geometry 
     */

    draw () {
        if (this.hasIndices) {
            if (this.isInstanced) {
                this._ext.drawElementsInstancedANGLE(
                    this.drawOperation, 
                    this.vertexCount, 
                    this._gl.UNSIGNED_SHORT, 
                    0, 
                    this.instanceCount
                )
            } else {
                this._gl.drawElements(
                    this.drawOperation, 
                    this.vertexCount, 
                    this._gl.UNSIGNED_SHORT, 
                    0
                )
            }
        } else {
            if (this.isInstanced) {
                this._ext.drawArraysInstancedANGLE(
                    this.drawOperation, 
                    0, 
                    this.vertexCount, 
                    this.instanceCount
                )
            } else {
                this._gl.drawArrays(
                    this.drawOperation, 
                    0, 
                    this.vertexCount
                ) 
            }
        }
    }

}