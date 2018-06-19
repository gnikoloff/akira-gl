import { PerspectiveCamera } from './gl-camera'
import { Geometry, Material, Mesh } from './gl-core'
import { PlaneGeometry } from './gl-geometry-2D'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')

class Plane {
    constructor (gl, width, height, widthSegment, heightSegment) {

        this.geometry = new PlaneGeometry(width, height, widthSegment, heightSegment)

        this.material = new Material({
            uniforms: {
                u_time: { type: '1f', value: 0.5 },
                u_radius: { type: '1f', value: 0.5 }
            },
            vertexShader: `
                uniform float u_time;
                uniform float u_radius;
                
                attribute vec2 a_position;
                attribute vec2 a_uv;

                varying vec2 v_uv;

                void main () {
                    vec2 position = vec2(
                        a_position.x + sin(u_time) * u_radius,
                        a_position.y + cos(u_time) * u_radius
                    );
                    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(position, 
                        cos(u_time + (a_position.x + a_position.y)) * u_radius
                    , 1.0);

                    v_uv = a_uv;
                }
            `, 
            fragmentShader: `
                varying vec2 v_uv;

                void main () {
                    gl_FragColor = vec4(v_uv, 0.0, 1.0);
                }
            `
        })

        this.mesh = new Mesh(gl, this.geometry, this.material, 2)

    }

    renderFrame (camera, time) {

        this.mesh.activate()
        this.mesh.material.uniforms.u_time.value = time
        this.mesh.material.updateUniform(this.mesh.material.uniforms.u_time)

        this.mesh.renderFrame(camera)

        this.mesh.deactivate()
    }

}

class Triangle {
    constructor (gl) {
        this.geometry = new Geometry()
        const radius = 1 / 3
        this.geometry.addAttribute(
            'a_position',
            new Float32Array([
                -radius / 2 , -radius / 2, 1.0,
                radius / 2, -radius / 2, -1,
                radius / 2, radius, 0.0
            ]),
            3
        )

        this.material = new Material({
            uniforms: {},
            vertexShader: `
                attribute vec3 a_position;

                void main () {
                    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
                }
            `,
            fragmentShader: `
                void main () {
                    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
                }
            `
        })

        this.mesh = new Mesh(gl, this.geometry, this.material)
    }     

    renderFrame (camera, time) {
        this.mesh.activate()

        this.mesh.renderFrame(camera)

        this.mesh.deactivate()
    }

}


let w = window.innerWidth
let h = window.innerHeight
let elapsedTime = 0

$canvas.width  = w
$canvas.height = h
document.body.appendChild($canvas)

const plane = new Plane(gl, 1, 1, 1, 1)
const triangle = new Triangle(gl, 5)

const camera = new PerspectiveCamera(w, h)
const cameraLookAt = [ 0, 0, 0 ]
camera.translate(4, 0, 4)
camera.lookAt(cameraLookAt)  
camera.update()

window.requestAnimationFrame(renderFrame)

function renderFrame () {
    window.requestAnimationFrame(renderFrame)

    let time = window.performance.now() / 1000
    let delta = time - elapsedTime
    elapsedTime = time

    gl.viewport(0, 0, w, h)
    gl.clearColor(0.2, 0.2, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    
    const x = Math.sin(time) * 3
    const y = Math.cos(time) * 3
    camera.setPosition(x, y, y)
    camera.lookAt(cameraLookAt)
    camera.update()

    plane.renderFrame(camera, time)
    triangle.renderFrame(camera, time)
    

}