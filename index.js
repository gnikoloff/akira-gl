import { PerspectiveCamera, CameraController } from './gl-camera'
import { Material, Mesh, Texture } from './gl-core'
import { Vector3 } from './gl-math'
import { PlaneGeometry } from './gl-geometry'

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


class Plane {
    constructor (gl, width, height) {

        this.videoLoad = false

        const img = document.createElement('img')
        const texture = new Texture(gl)

        const video = document.createElement('video')
        video.src = '12943877.mp4'
        video.onloadedmetadata = () => {
            document.body.appendChild(video)
            video.muted = true
            video.loop = true

            this.canvas = document.createElement('canvas')
            this.ctx = this.canvas.getContext('2d')
            this.canvas.width = video.videoWidth
            this.canvas.height = video.videoHeight

            document.body.appendChild(this.canvas)
            document.body.appendChild(video)

            this.video = video
            video.play()

            texture
                .bind()
                .setFilter()
                .wrap()
                .unbind()

            this.texture = texture

            this.geometry = new PlaneGeometry(width, height, 50, 50)
            this.material = new Material({
                uniforms: {
                    u_time: { type: '1f', value: 0 },
                    u_sampler: { type: 't', value: texture }
                },
                vertexShader: `
                    uniform float u_time;

                    attribute vec2 a_position;
                    attribute vec2 a_uv;

                    varying vec2 v_uv;

                    void main () {
                        float dist = distance(vec2(0.0), vec2(a_position.x, a_position.y));
                        float z = sin(u_time * 5.0 - dist * 2.0) * 1.25;
                        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, z, 1.0);

                        v_uv = a_uv;
                    }
                `,
                fragmentShader: `
                    uniform sampler2D u_sampler;

                    varying vec2 v_uv;

                    void main () {
                        gl_FragColor = texture2D(u_sampler, v_uv);
                        // gl_FragColor = vec4(v_uv, 0.0, 1.0);
                    }
                `
            })

            this.mesh = new Mesh(gl, this.geometry, this.material)
            this.mesh.setPosition(0, 0, 0)
            this.mesh.material.transform.updateMatrix()

            this.videoLoad = true
        }

    }

    renderFrame (camera, time) {       
        if (!this.videoLoad) return

        this.ctx.drawImage(this.video, 0, 0)
        this.texture
            .bind()
            .fromImage(this.video)
            .unbind()

        this.mesh.activate()
        this.mesh.material.uniforms.u_time.setValue(time)
        this.mesh.renderFrame(camera)
        this.mesh.deactivate()
    }

}

const plane = new Plane(gl, 16, 9)

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
    gl.enable(gl.CULL_FACE)

    plane.renderFrame(camera, time)
    

}