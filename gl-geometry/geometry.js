import {
    FLOAT,
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} from '../gl-constants'

import { ArrayBuffer } from '../gl-core'
import { IndexArrayBuffer } from '../gl-core'

export class Geometry {
    
    constructor (buffers = []) {
        this.buffers = buffers
    }

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
                    if (attrib.name === 'a_position') return attrib
                })
            } else {
                vertices = this.buffers.find(attrib => {
                    if (attrib.name === 'a_position') return attrib
                })
            }
            this.vertexCount = vertices.count
        }

        return this.buffers
    }

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

    addIndiceAttribute (array) {
        this.buffers.push(new IndexArrayBuffer(array))
    }

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