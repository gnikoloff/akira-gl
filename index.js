import { PlaneGeometry } from './gl-geometry-2D'

const $canvas = document.createElement('canvas')
const gl = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl')

const planeGeometry = new PlaneGeometry(1, 1, 1, 1)

console.log(planeGeometry)

let w = 512
let h = 512

$canvas.width  = w
$canvas.height = h

document.body.appendChild($canvas)

window.requestAnimationFrame(renderFrame)

function renderFrame () {
    window.requestAnimationFrame(renderFrame)
    gl.viewport(0, 0, w, h)
    gl.clearColor(0.2, 0.2, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
}