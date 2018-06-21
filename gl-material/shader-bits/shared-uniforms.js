export const shaderSharedUniformsVertexFragment = `
    uniform mat4 u_modelMatrix;
    // used for normals!
    uniform mat4 u_transposeModelMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
`