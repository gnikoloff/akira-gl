import { PerspectiveCamera, CameraController } from './gl-camera'
import { Mesh, Texture } from './gl-core'
import { CubeGeometry } from './gl-geometry'
import { Material } from './gl-material'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')

let w = window.innerWidth
let h = window.innerHeight
let elapsedTime = 0

$canvas.width  = w
$canvas.height = h
document.body.appendChild($canvas)

const camera = new PerspectiveCamera(w, h)
const cameraOriginalPos = [ 0, 3, 25 ]
const cameraLookAt = [ 0, 0, 0 ]

const a = document.createElement('canvas')
const ctx = a.getContext('2d')

a.width = 512
a.height = 512
document.body.appendChild(a)

ctx.fillStyle = '#fff'
ctx.fillRect(0, 0, a.width, a.height)
ctx.fillStyle = 'red'
ctx.strokeStyle = 'green'
ctx.lineWidth = 20
ctx.beginPath()
ctx.arc(a.width / 2, a.height / 2, 100, 0, Math.PI * 2, true)
ctx.closePath()
ctx.fill()
ctx.stroke()

const tex = new Texture(gl)
tex
    .bind()
    .setFilter()
    .wrap()
    .fromImage(a)


const geo = new CubeGeometry(3, 3, 3, 10, 10, 10)
const mat = new Material({
    uniforms: {
        u_sampler: { type: 't', value: tex }
    },
    vertexShader: `
        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_uv;

        varying vec2 v_uv;
        varying vec3 v_normal;

        void main () {

            vec3 n = a_normal * 2.0 + a_position;
            gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
            
            v_uv = a_uv;
            v_normal = mat3(u_transposeModelMatrix) * a_normal;
        }
    `,
    fragmentShader: `
        uniform sampler2D u_sampler;

        varying vec2 v_uv;
        varying vec3 v_normal;

        const vec3 lightPosition = vec3(-0.5, 0.5, 20.0);

        void main () {
            vec3 normal = normalize(v_normal);
            float light = dot(normal, lightPosition);
            gl_FragColor = texture2D(u_sampler, v_uv);
            gl_FragColor.rgb *= light;
        }
    `
})
const mesh = new Mesh(gl, geo, mat)

$canvas.addEventListener('mousemove', e => {
    const mousex = (e.pageX - window.innerWidth / 2) / window.innerWidth
    const mousey = (e.pageY - window.innerHeight / 2) / window.innerHeight

    const camerax = cameraOriginalPos[0] + mousex * 20
    const cameray = cameraOriginalPos[1] + mousey * 20
    
    camera.setPosition(camerax, cameray, cameraOriginalPos[2])
    camera.lookAt(cameraLookAt)
    camera.update()
}, false)

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
    // gl.enable(gl.CULL_FACE)

    mesh
        .activate()
        .renderFrame(camera)
        .deactivate()
    

}