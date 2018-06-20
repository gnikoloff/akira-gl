export class CameraController {
    constructor (camera, $domElement) {
        this.camera = camera
        this.$el = $domElement

        const bbox = $domElement.getBoundingClientRect()

        this.offsetX = bbox.left
        this.offsetY = bbox.top
        this.elWidth = bbox.width
        this.elHeight = bbox.height

        this.rotateRate = -300     // How fast to rotate, degrees per dragging delta
        this.panRate = 5           // How fast to pan, max unit per dragging delta
        this.zoomRate = 200        // How fast to zoom or can be viewed as forward / backward movement

        this.initX = 0             // Starting x, y position on mouse down
        this.initY = 0
        this.prevX = 0             // Starting x, y position on mouse move
        this.prevY = 0
        this.lookAt = [ 0, 0, 0 ]

        this.isMouseDown = false

        this.$el.addEventListener('mousedown', this.onMouseDown.bind(this), false)
        this.$el.addEventListener('mousemove', this.onMouseMove.bind(this), false)
        this.$el.addEventListener('mouseup', this.onMouseUp.bind(this), false)
        
    }

    onMouseDown (e) {
        this.initX = this.prevX = e.pageX - this.offsetX
        this.initY = this.prevY = e.pageY - this.offsetY
        this.isMouseDown = true
    }

    onMouseMove (e) {
        if (!this.isMouseDown) return

        let x = e.pageX - this.offsetX
        let y = e.pageY - this.offsetY
        let dx = x - this.prevX
        let dy = y - this.prevY

        if (!e.shiftKey) {
            this.camera.translate(
                dx * (this.rotateRate / this.elWidth),
                dy * (this.rotateRate / this.elHeight),
                0
            )
            this.camera.update()
            this.camera.lookAt(this.lookAt)
        } else {
            this.camera.panX()
        }

        this.prevX = x
        this.prevY = y
    }

    onMouseUp (e) {
        this.isMouseDown = false
    }

}