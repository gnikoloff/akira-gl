import { PerspectiveCamera, CameraController } from './gl-camera'
import { Geometry, Material, Mesh } from './gl-core'
import { Vector3 } from './gl-math'
import { PlaneGeometry, CubeGeometry } from './gl-geometry'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')


let w = window.innerWidth
let h = window.innerHeight
let elapsedTime = 0

$canvas.width  = w
$canvas.height = h
document.body.appendChild($canvas)

class Box {
    constructor (geometry, position, scale) {
        const material = new Material({
            uniforms: {
                u_color: { type: '3f', value: new Vector3(Math.random(), Math.random(), Math.random()) }
            },
            vertexShader: `
                attribute vec3 a_position;

                void main () {
                    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;

                void main () {
                    gl_FragColor = vec4(u_color, 1.0);
                }
            `
        })
        this.mesh = new Mesh(gl, geometry, material)

        this.mesh.setPosition(...position)
        this.mesh.setScale(...scale)
        this.mesh.material.transform.updateMatrix()

    }
    renderFrame (camera) {
        this.mesh.activate()
        this.mesh.renderFrame(camera)
        this.mesh.deactivate()
    }
}

const a = new CubeGeometry(0.2, 0.2, 0.2, 1, 1, 1)
const boxes = []
const boxesGrid = 5
const spread = 2

for (let y = 0; y <= boxesGrid; y += 1) {
    for (let x = 0; x <= boxesGrid; x += 1) {
        const tw = (boxesGrid * spread) * 0.5
        const pos = [ x * spread - tw, 0, y * spread - tw]
        const scale = [ 3, 1 + Math.random() * 10, 3 ]
        boxes.push(new Box(a, pos, scale))
    }
}

const camera = new PerspectiveCamera(w, h)
const cameraOriginalPos = [ 0, 3, 15 ]
const cameraLookAt = [ 0, 0, 0 ]
camera.setPosition(...cameraOriginalPos)
camera.lookAt(cameraLookAt)
camera.update()

const cameractrl = new CameraController(camera, $canvas)


window.onresize = () => {
    w = window.innerWidth
    h = window.innerHeight

    $canvas.width = w
    $canvas.height = w

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
    
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)

    boxes.forEach(box => box.renderFrame(camera))
    

}