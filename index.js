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

class Line {
    constructor (gl, segmentsCount) {
        this.gl = gl
        const geometry = new Geometry()

        const vertices = new Float32Array(segmentsCount * 3)

        for (let i = 0; i < segmentsCount; i += 1) {
            vertices[i * 3 + 0] = i * 1.5 - segmentsCount * 1.5 / 2
            vertices[i * 3 + 1] = 0
            vertices[i * 3 + 2] = 0
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
                    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
                }
            `,
            fragmentShader: `
                void main () {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            `
        })

        this.mesh = new Mesh(gl, geometry, material, 2)

    }

    renderFrame (camera) {
        this.mesh.activate()

        // const a_position = this.mesh.geometry.attribs.find(attrib => {
        //     return attrib.name === 'a_position'
        // })
        // const positionArr = a_position.array
        // const count = positionArr.length / a_position.itemsPerVert
        // for (let i = 0; i < count; i += 1) {
        //     positionArr[i * 3 + 1] += 1
        // }

        // this.mesh.geometry.updateAttribute(gl, a_position.name, positionArr)

        this.mesh.renderFrame(camera)
        this.mesh.deactivate()
    }

}

class Box {
    constructor (geometry, position, scale) {
        const material = new Material({
            uniforms: {
                u_color: { type: '3f', value: new Vector3(Math.random(), Math.random(), Math.random()) },
                u_time: { type: '1f', value: 0 }
            },
            vertexShader: `
                uniform float u_time;

                attribute vec3 a_position;

                void main () {
                    vec3 position = a_position;
                    position.x += sin(u_time + position.y) * position.y;
                    position.y += cos(u_time + position.x) * position.y;
                    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(position, 1.0);
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

        this.mesh.setPosition(position[0], position[1] + scale[1] / 10, position[2])
        this.mesh.setScale(...scale)
        this.mesh.material.transform.updateMatrix()

    }
    renderFrame (camera, time) {
        this.mesh.activate()
        this.mesh.material.uniforms.u_time.setValue(time)
        this.mesh.renderFrame(camera)
        this.mesh.deactivate()
    }
}

const a = new CubeGeometry(0.2, 0.2, 0.2, 10, 10, 10)
const boxes = []
const boxesGrid = 6
const spread = 2

for (let y = 0; y <= boxesGrid; y += 1) {
    for (let x = 0; x <= boxesGrid; x += 1) {
        const tw = (boxesGrid * spread) * 0.5
        const pos = [ x * spread - tw, 0, y * spread - tw]
        const scale = [ 3, 1 + Math.random() * 10, 3 ]
        boxes.push(new Box(a, pos, scale))
    }
}

const line = new Line(gl, 10)

const camera = new PerspectiveCamera(w, h)
const cameraOriginalPos = [ 0, 3, 15 ]
const cameraLookAt = [ 0, 0, 0 ]

// const cameractrl = new CameraController(camera, $canvas)

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

    boxes.forEach(box => {
        box.renderFrame(camera, time)
    })

    // line.renderFrame(camera)
    

}