import { PerspectiveCamera } from './gl-camera'
import { PlaneGeometry } from './gl-geometry-2D'
import { Material, Mesh } from './gl-core'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')

const camera = new PerspectiveCamera()
camera.translate(10, 0, 10)
camera.lookAt(0, 0, 0)  
camera.update()

class Plane {
    constructor (gl, width, height, widthSegment, heightSegment) {
        this.gl = gl

        this.geometry = new PlaneGeometry(width, height, widthSegment, heightSegment)

        this.material = new Material({
                u_time: { type: '1f', value: 0 },
                u_radius: { type: '1f', value: 0.5 },
                u_viewMatrix: { type: 'Matrix4fv', value: camera.viewMatrix },
                u_projectionMatrix: { type: 'Matrix4fv', value: camera.projectionMatrix } 
            },
            `
                uniform float u_time;
                uniform float u_radius;
                uniform mat4 u_viewMatrix;
                uniform mat4 u_projectionMatrix;
                
                attribute vec2 a_position;

                void main () {
                    vec2 position = vec2(
                        a_position.x + sin(u_time) * u_radius,
                        a_position.y + cos(u_time) * u_radius
                    );
                    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0, 1.0);
                }
            `, 
            `
                void main () {
                    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
                }
            `
        )

        this.mesh = new Mesh(gl, this.geometry, this.material)

    }

    renderFrame (time) {

        this.mesh.activate()

        this.mesh.material.uniforms.u_time.value = time
        this.mesh.material.updateUniform(this.mesh.material.uniforms.u_time)

        this.mesh.renderFrame()

        this.mesh.deactivate()
    }

}


let w = 512
let h = 512
let elapsedTime = 0


$canvas.width  = w
$canvas.height = h

document.body.appendChild($canvas)

const plane = new Plane(gl, 1, 1, 1, 1)

window.requestAnimationFrame(renderFrame)

function renderFrame () {
    window.requestAnimationFrame(renderFrame)

    let time = window.performance.now() / 1000
    let delta = time - elapsedTime
    elapsedTime = time

    gl.viewport(0, 0, w, h)
    gl.clearColor(0.2, 0.2, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    plane.renderFrame(time)
    

}