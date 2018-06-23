import { 
    RGBA,
    UNSIGNED_BYTE,
    NEAREST
} from '../gl-constants'

import { Texture } from './texture'

/**
 * @class Framebuffer
 * @param {WebGLRenderingContext} gl
 * @param {number} [width = 256] - framebuffer's width
 * @param {number} [height = 256] - framebuffer's height
 * @param {GLenum} [format = RGBA] - framebuffer's format
 * @param {GLenum} [internalFormat = RGBA] - framebuffer's internal format
 * @param {GLenum} [type = UNSIGNED_BYTE] - framebuffer's type
 * @param {GLenum} [filter = NEAREST] - framebuffer's filter
 */
export class Framebuffer {
    constructor (
        gl,
        width = 256,
        height = 256,
        format = RGBA,
        internalFormat = RGBA,
        type = UNSIGNED_BYTE,
        filter = NEAREST
    ) {
        this._gl = gl
        this._width = width
        this._height = height
        this._format = format
        this._internalFormat = internalFormat
        this._type = type
        this._filter = filter

        this._texture = this.makeTexture()
        this._framebuffer = this._gl.createFramebuffer()

        this.bind()
        this._gl.framebufferTexture2D(
            this._gl.FRAMEBUFFER,
            this._gl.COLOR_ATTACHMENT0,
            this._gl.TEXTURE_2D,
            this._texture.getTexture(),
            0
        )
        this.unbind()
    }

    /**
     * Makes a new empty texture with provided width and height, binds it, sets default filtering and wrapping and unbinds it
     * @return {Texture}
     */

    makeTexture () {
        let texture = new Texture(this._gl, this._internalFormat, this._format, this._type)
        texture
            .bind()
            .setFilter()
            .wrap()
            .fromSize(this._width, this._height)
            .unbind()
        
        return texture
    }

    /**
     * @return {Texture} The associated's framebuffer texture
     */

    getTexture () {
        return this._texture
    }

    /**
     * Sets framebuffer viewport
     * @param {number} width 
     * @param {number} height 
     */

    setSize (width, height) {
        this._width = width
        this._height = height
        this.texture.bind().fromSize(this._width, this._height)
    }

    /**
     * Updates framebuffer viewport
     */

    updateViewport () {
        this._gl.viewport(0, 0, this._width, this._height)
        return this
    }

    /**
     * Binds framebuffer for rendering
     */

    bind () {
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._framebuffer)
        return this
    }

    /**
     * Unbinds framebuffer
     */

    unbind () {
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null)
        return this
    }

    /**
     * Deletes framebuffer
     */

    delete () {
        this._texture.delete()
    }

}