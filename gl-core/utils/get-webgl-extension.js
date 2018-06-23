import '../vendor/oes-vertex-array-object-polyfill'

/**
 * @param {WebGLRenderingContext}
 * @param {string} name - name of WebGL extension requested
 * @returns - Requested WebGL extension
 */

const webGLExtensions = []

export const getWebGLExtension = (gl, name) => {
    let ext = webGLExtensions.find(ext => ext.name === name)
    if (ext) return ext.extension

    let newExt = {
        name,
        extension: gl.getExtension(name)
    }
    webGLExtensions.push(newExt)
    
    console.log(`Enabled WebGL extension: ${name}`)
    return newExt.extension
}