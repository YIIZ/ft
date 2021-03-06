import Component from './Component'

/**
 * Make a display object draggable.
 *
 * @example
 * const displayObject = FT.create(Text, 'Hello World')
 * const draggable = new Draggable()
 * displayObject.addComponent(draggable)
 */
class Draggable extends Component {
  constructor({ enableX = true, enableY = true, onStart, onMove, onEnd } = {}) {
    super()

    this.name = 'draggable'

    /**
     * @access private
     */
    this.$dragging = false

    /**
     * @access private
     */
    this.$eventData = null

    /**
     * @access private
     */
    this.$pointerdownPosition = null

    this.enableX = enableX
    this.enableY = enableY
    this.onStart = onStart
    this.onMove = onMove
    this.onEnd = onEnd
  }

  onAdded(displayObject) {
    displayObject.interactive = true
    displayObject.on('pointerdown', this.onDragStart, this)
    displayObject.on('pointerup', this.onDragEnd, this)
    displayObject.on('pointerupoutside', this.onDragEnd, this)
    displayObject.on('pointermove', this.onDragMove, this)
  }

  onRemoved(displayObject) {
    displayObject.interactive = false
    displayObject.off('pointerdown', this.onDragStart, this)
    displayObject.off('pointerup', this.onDragEnd, this)
    displayObject.off('pointerupoutside', this.onDragEnd, this)
    displayObject.off('pointermove', this.onDragMove, this)
  }

  /**
   * @access private
   */
  onDragStart(event) {
    const component = this
    const { displayObject } = this

    this.$dragging = true
    this.$eventData = event.data

    // click position relative to current displayObject
    this.$pointerdownPosition = this.$eventData.getLocalPosition(displayObject)

    component.onStart?.(displayObject)
  }

  /**
   * @access private
   */
  onDragEnd() {
    const component = this
    const { displayObject } = this

    this.$dragging = false
    this.$eventData = null

    component.onEnd?.(displayObject)
  }

  /**
   * @access private
   */
  onDragMove() {
    if (!this.$dragging) return
    const component = this
    const { displayObject } = this

    // click position relative to the parent of current displayObject
    const currentPosition = this.$eventData.getLocalPosition(
      displayObject.parent
    )

    const nextX = currentPosition.x - this.$pointerdownPosition.x
    const nextY = currentPosition.y - this.$pointerdownPosition.y

    if (component.onMove) {
      component.onMove(displayObject, nextX, nextY)
    } else {
      this.positionDisplayObject(nextX, nextY)
    }
  }

  positionDisplayObject(x, y) {
    const { displayObject, enableX, enableY } = this

    if (enableX) {
      displayObject.position.x = x
    }

    if (enableY) {
      displayObject.position.y = y
    }
  }
}

export default Draggable
