import {
    RGBA,
    UNSIGNED_BYTE,
    LINEAR,
    CLAMP_TO_EDGE,
    NEAREST,
    UNPACK_FLIP_Y_WEBGL
} from '../akira-constants'

/**
 * @class Texture
 * @param {GLenum} [format = RGBA]
 * @param {GLenum} [internalFormat = RGBA]
 * @param {GLenum} [type = UNSIGNED_BYTE]
 */
export class Texture {
    constructor (gl, format = RGBA, internalFormat = RGBA, type = UNSIGNED_BYTE) {
        this._gl = gl

        this._texture = gl.createTexture()
        this.setFormat(format, internalFormat, type)

    }

    /**
     * Update data for texture with image, canvas or video and set it's size
     * @param {HTMLImageElement|CanvasRenderingContext2D|HTMLVideoElement} image
     * @param {number} width 
     * @param {number} height 
     * @returns {Texture} `this`
     */

    fromImage (image, width, height) {
        this._width = width ? width : image.width
        this._height = height ? height : image.height
        this._gl.texImage2D(
            this._gl.TEXTURE_2D, 
            0, 
            this._internalFormat,
            this._format,
            this._type,
            image
        )
        return this
    }

    /**
     * Sets texture size with empty data and set its size
     * @param {number} width 
     * @param {number} height 
     * @returns {Texture} `this`
     */

    fromSize (width, height) {
        if (width) this._width = width
        if (height) this._height = height
        this._gl.texImage2D(
			this._gl.TEXTURE_2D,
			0,
			this._internalFormat,
			this._width,
			this._height,
			0,
			this._format,
			this._type,
			null
        )
        return this
    }

    /**
     * Update texture from dataArray with Float32Array and Float64Array and set its size
     * @param {number} width 
     * @param {number} height 
     * @param {Float32Array|Float64Array} dataArray 
     */

    fromData (width, height, dataArray) {
        if (width) this._width = width
        if (height) this._height = height
        this._gl.texImage2D(
            this._gl.TEXTURE_2D,
            0,
            this._internalFormat,
            this._width,
            this._height,
            0,
            this._format,
            this._type,
            dataArray
        )
    }

    /**
     * Set texture's pixel store
     * @param {GLenum} name 
     * @param {boolean} param 
     * @returns {Texture} `this`
     */

    setPixelStore (name = UNPACK_FLIP_Y_WEBGL, param = true) {
        this._gl.pixelStorei(name, param)
        return this
    }

    /**
     * Set's texture format
     * @param {GLenum} format 
     * @param {GLenum} internalFormat 
     * @param {GLenum} type 
     * @returns {Texture} `this`
     */

    setFormat (format, internalFormat, type) {
        if (format) this._format = format
        if (internalFormat) this._internalFormat = internalFormat
        if (type) this._type = type
        return this
    }

    /**
     * Sets texture filtering
     * @param {GLenum} filter 
     * @returns {Texture} `this`
     */

    setFilter (filter = LINEAR) {
        this.setMinFilter(filter)
		this.setMagFilter(filter)
        return this
    }

    /**
     * Sets texture min filtering
     * @param {GLenum} filter 
     * @returns {Texture} `this`
     */

    setMinFilter (filter = LINEAR) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filter)
        return this
    }

    /**
     * Sets texture mag filtering
     * @param {GLenum} filter 
     * @returns {Texture} `this`
     */

    setMagFilter (filter = LINEAR) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filter)
        return this
    }

    /**
     * Sets texture wrapping
     * @param {GLenum} wrap 
     * @returns {Texture} `this`
     */

    wrap (wrap = CLAMP_TO_EDGE) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, wrap)
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, wrap)
        return this
    }

    /**
     * Generate mipmaps for texture
     * @returns {Texture} `this`
     */

    generateMipmap () {
        this._gl.generateMipmap(this._gl.TEXTURE_2D)
        return this
    }

    /**
     * Activate texture to corresponding unit
     * @param {number} unit 
     * @returns {Texture} `this`
     */

    activate (unit = 0) {
        this._unit = unit
        this._gl.activeTexture(this._gl[`TEXTURE${unit}`])
        return this
    }

    /**
     * check if texture is active according to supplied unit
     * @param {number} unit 
     * @return {boolean}
     */

    isActive (unit) {
        return this._unit === unit
    }

    /**
     * Binds texture
     * @returns {Texture} `this`
     */

    bind () {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture)
        return this
    }

    /**
     * Unbinds texture
     * @returns {Texture} `this`
     */

    unbind () {
        this._gl.bindTexture(this._gl.TEXTURE_2D, null)
        return this
    }

    /**
     * @returns {WebGLTexture}
     */

    getTexture () {
        return this._texture
    }

    /**
     * Delete texture
     */

    delete () {
        this._gl.deleteTexture(this._texture)
        this._texture = null
    }

}