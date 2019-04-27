import { FT } from '../core'
import Component from './Component'

/**
 * A component for positioning display object according bounds of viewport.
 */
class HUD extends Component {
  /**
   * @param {Object} options
   * @param {number} options.left left position for bounds.
   * @param {number} options.right right position for bounds.
   * @param {number} options.top top position for bounds.
   * @param {number} options.bottom bottom position for bounds.
   * @param {number} options.percentage make left, right ,top, bottom represent percentage.
   */
  constructor({ left, right, top, bottom, percentage = false } = {}) {
    super()

    this.system = FT.systems.hud
    if (left !== undefined) this.meta.left = left
    if (right !== undefined) this.meta.right = right
    if (top !== undefined) this.meta.top = top
    if (bottom !== undefined) this.meta.bottom = bottom
    this.meta.percentage = percentage
  }

  // eslint-disable-next-line
  onAdded(displayObject) {
    this.system.addEntity(displayObject)
  }

  // eslint-disable-next-line
  onRemoved(displayObject) {
    this.system.removeEntity(displayObject)
  }
}

export default HUD