import Stats from 'stats-js'

import { PerspectiveCamera, CameraController } from './gl-camera'
import { Mesh, Framebuffer, Texture } from './gl-core'
import { Geometry, PlaneGeometry, InstancedGeometry, CubeGeometry, SphereGeometry, CylinderGeometry } from './gl-geometry'
import { Material, ColorMaterial } from './gl-material'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')

const dpr = window.devicePixelRatio || 1
let w = window.innerWidth
let h = window.innerHeight
let wdpr = w * dpr
let hdpr = h * dpr
let elapsedTime = 0

$canvas.width  = wdpr
$canvas.height = hdpr
$canvas.style.width = `${w}px`
$canvas.style.height = `${h}px`
document.body.appendChild($canvas)

const stats = new Stats()

stats.domElement.style.position = 'fixed'
stats.domElement.style.left = stats.domElement.style.top = '1rem'
document.body.appendChild(stats.domElement)

const camera = new PerspectiveCamera(w, h)
camera.setPosition(0, 0, 50)
const ctrls = new CameraController(camera)

const a = new PlaneGeometry(5, 5, 3, 3)

const count = 100
const refgeo = new CubeGeometry()
const geo = new InstancedGeometry(count).fromGeometry(refgeo)

const offsets = new Float32Array(count * 3)

for (let i = 0; i < count; i += 1) {
    offsets[i * 3 + 0] = (Math.random() * 2 - 1) * 100
    offsets[i * 3 + 1] = (Math.random() * 2 - 1) * 100
    offsets[i * 3 + 2] = (Math.random() * 2 - 1) * 100
}

geo.addInstancedAttribute('a_offsetPos', offsets, 3)

const mat = new Material({
    uniforms: {},
    vertexShader: `
        attribute vec3 a_position;
        attribute vec3 a_offsetPos;

        void main () {
            gl_Position = 
                u_projectionMatrix *
                u_viewMatrix *
                u_modelMatrix *
                vec4(a_position + a_offsetPos, 1.0);
            
            gl_PointSize = 10.0;

        }
    `,
    fragmentShader: `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `
})
const mesh = new Mesh(gl, geo, mat, gl.LINE_LOOP)

window.onresize = () => {
    w = window.innerWidth
    h = window.innerHeight
    wdpr = w * dpr
    hdpr = h * dpr

    $canvas.width = wdpr
    $canvas.height = hdpr
    $canvas.style.width = `${w}px`
    $canvas.style.height = `${h}px`

}

window.requestAnimationFrame(renderFrame)

function renderFrame () {
    window.requestAnimationFrame(renderFrame)

    stats.begin()

    let time = window.performance.now() / 1000
    let delta = time - elapsedTime
    elapsedTime = time

    gl.viewport(0, 0, wdpr, hdpr)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)

    mesh.activate()
    mesh.renderFrame(camera)
    mesh.deactivate()

    stats.end()

}