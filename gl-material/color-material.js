import { Material } from './material'

import { Vector3 } from '../gl-math'

export class ColorMaterial extends Material {
    constructor (colorHEX, opacity) {

        const r = ((colorHEX / 256 / 256) % 256) / 255
        const g = ((colorHEX / 256      ) % 256) / 255
        const b = ((colorHEX            ) % 256) / 255

        const uniforms = {
            u_color: { type: '3f', value: new Vector3(r, g, b) },
            u_opacity: { type: '1f', value: opacity ? opacity : 1 }
        }
        
        const vertexShader = `
            attribute vec3 a_position;

            void main () {
                gl_Position = u_projectionMatrix * 
                            u_viewMatrix *
                            u_modelMatrix * 
                            vec4(a_position, 1.0);
            }
        `
        const fragmentShader = `
            uniform vec3 u_color;
            uniform float u_opacity;

            void main () {
                gl_FragColor = vec4(u_color, 0.1);
            }
        `

        super({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: opacity ? true : false
        })

    }
}