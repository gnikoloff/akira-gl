import { Transform } from './gl-math'
import { PerspectiveCamera } from './gl-camera'
import { Geometry, Material, Mesh } from './gl-core'
import { PlaneGeometry } from './gl-geometry-2D'

new Transform()


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
                gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 0.0, 1.0);

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
                    gl_FragColor = vec4(vec3(0.25), 1.0);
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

class Points {
    constructor (gl, count) {
        const geometry = new Geometry()

        const step = (Math.PI * 3) / count

        const vertices = new Float32Array(count * 3)

        for (let i = 0; i < count; i += 1) {
            vertices[i * 3 + 0] = Math.sin(i * step) * 1
            vertices[i * 3 + 1] = Math.cos(i * step) * 1
            vertices[i * 3 + 2] = i * 0.1 - count / 2 * 0.1
        }
        
        geometry.addAttribute(
            'a_position',
            vertices,
            3
        )

        const material = new Material({
            uniforms: {},
            vertexShader: `
                attribute vec3 a_position;

                void main () {
                    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
                    gl_PointSize = 10.0;
                }
            `,
            fragmentShader: `
                void main () {
                    gl_FragColor = vec4(vec3(0.5), 1.0);
                }
            `
        })

        this.mesh = new Mesh(gl, geometry, material, 0)
        this.mesh2 = new Mesh(gl, geometry, material, 1)

    }
    
    renderFrame (camera, time) {
        this.mesh.activate()

        this.mesh.renderFrame(camera)
        this.mesh2.renderFrame(camera)

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
const triangle = new Triangle(gl)
const points = new Points(gl, 22)

const camera = new PerspectiveCamera(w, h)
const cameraLookAt = [ 0, 0, 0 ]

window.onresize = () => {
    w = window.innerWidth
    h = window.innerHeight

    $canvas.width = w
    $canvas.height = w

    console.log(camera)
}
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
    
    const x = Math.sin(time) * 4
    const y = Math.cos(time) * 4
    camera.setPosition(x, y, y)
    camera.lookAt(cameraLookAt)
    camera.update()

    // plane.mesh.setScale(Math.sin(time) * 20, Math.sin(time) * 20)
    plane.mesh.setPosition(Math.sin(-time) * 2, Math.cos(-time) * 2, Math.cos(time) * 2)
    plane.mesh.setRotate(time, time)
    plane.mesh.material.transform.updateMatrix()

    plane.renderFrame(camera, time)

    triangle.renderFrame(camera, time)
    points.renderFrame(camera, time)
    

}