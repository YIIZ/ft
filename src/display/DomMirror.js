import { FT, Layer } from '#/core'
import { transformDOM } from '#/utils'
import PIXI from '#/pixi'

/**
 * Create a DOM element with same size of given displayObject.
 *
 * @example
 * const sprite = new Sprite()
 * const cover = FT.create(DomMirror, sprite, { tag: 'img'})
 * cover.dom.src = '<valid dataURL>'
 * this.addChild(cover)
 */
class DomMirror extends PIXI.Container {
  constructor(displayObject, { tag = 'div', debug = false } = {}) {
    super()

    const dom = document.createElement(tag)

    /**
     * @access private
     */
    this.$dom = dom

    /**
     * @access private
     */
    this.$displayObject = displayObject

    /**
     * @access private
     */
    this.$debug = debug
  }

  onAdded() {
    FT.container.appendChild(this.$dom)
  }

  onRemoved() {
    FT.container.removeChild(this.$dom)
  }

  onUpdate() {
    this.position()
  }

  get dom() {
    return this.$dom
  }

  transformDOM() {
    const dom = this.$dom
    const displayObject = this.$displayObject

    transformDOM(dom, displayObject)
  }

  /**
   * @ignore
   */
  position = () => {
    const dom = this.$dom

    dom.style.zIndex = Layer.DOM_INTERACTION
    this.transformDOM(dom)

    if (this.$debug) {
      dom.style.backgroundColor = '#ff0000'
      dom.style.opacity = 0.2
    } else {
      dom.style.opacity = 0.0001
    }
  }
}

export default DomMirror
