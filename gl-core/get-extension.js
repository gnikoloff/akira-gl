import './vendor/oes-vertex-array-object-polyfill'

const webGLExtensions = []

export const getExtension = (gl, name) => {
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