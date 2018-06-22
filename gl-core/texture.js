import {
    RGBA,
    UNSIGNED_BYTE,
    LINEAR,
    CLAMP_TO_EDGE,
    NEAREST,
    UNPACK_FLIP_Y_WEBGL
} from '../gl-constants'

export class Texture {
    constructor (gl, format = RGBA, internalFormat = RGBA, type = UNSIGNED_BYTE) {
        this._gl = gl

        this._texture = gl.createTexture()
        this.setFormat(format, internalFormat, type)

    }

    // update data for texture with image

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

    // update texture's width and height and empty data

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

    // update texture from dataArray with Float32Array and Float64Array

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

    setPixelStore (name = UNPACK_FLIP_Y_WEBGL, param = true) {
        this._gl.pixelStorei(name, param)
        return this
    }

    setFormat (format, internalFormat, type) {
        if (format) this._format = format
        if (internalFormat) this._internalFormat = internalFormat
        if (type) this._type = type
        return this
    }

    setFilter (filter = LINEAR) {
        this.setMinFilter(filter)
		this.setMagFilter(filter)
        return this
    }

    setMinFilter (filter = LINEAR) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filter)
        return this
    }

    setMagFilter(filter = LINEAR) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filter)
        return this
    }

    wrap (wrap = CLAMP_TO_EDGE) {
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, wrap)
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, wrap)
        return this
    }

    generateMipmap () {
        this._gl.generateMipmap(this._gl.TEXTURE_2D)
        return this
    }

    activate (unit = 0) {
        this._unit = unit
        this._gl.activeTexture(this._gl[`TEXTURE${unit}`])
        return this
    }

    isActive (unit) {
        return this._unit === unit
    }

    bind () {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture)
        return this
    }

    unbind () {
        this._gl.bindTexture(this._gl.TEXTURE_2D, null)
        return this
    }

    getTexture () {
        return this._texture
    }

    delete () {
        this._gl.deleteTexture(this._texture)
        this._texture = null
    }

}