import './vendor/oes-vertex-array-object-polyfill'

const webGLExtensions = []

export const getExtension = (gl, name) => {
    let ext = extensions.find(ext => ext.name === extName)
    if (ext) return ext.extension

    let newExt = {
        name: extName,
        extension: gl.getExtension(extName)
    }
    extensions.push(newExt)
    
    console.log(`Enabled WebGL extension: ${extName}`)

    return newExt.extension
}