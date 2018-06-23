import { ARRAY_BUFFER } from '../akira-constants'

export class InterleavedArrayBuffers {
    constructor (buffersInfo = []) {
        this._type = ARRAY_BUFFE
    
        this.buffersInfo = buffersInfo
    }
    init (gl, program) {
        this._gl = gl
        this._program = program
        
    }
}