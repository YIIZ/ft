import app from '../app'

/**
 * Transform DOMElement's position and size according given DisplayObject.
 *
 * @param {DOMElement} dom the DOM to be transformed.
 * @param {DisplayObject} displayObject the display object which provides position and size.
 */
function transformDOM(dom, displayObject, layer) {
  const { width, height, worldAlpha: alpha, angle, visible } = displayObject

  const { x: $x, y: $y } = displayObject.getGlobalPosition()

  let pivotX, pivotY
  if (displayObject.anchor) {
    const { x: anchorX, y: anchorY } = displayObject.anchor
    pivotX = width * anchorX
    pivotY = height * anchorY
  } else {
    pivotX = displayObject.pivot.x
    pivotY = displayObject.pivot.y
  }

  const stagePosition = app.stage.getGlobalPosition()
  const x = $x - stagePosition.x - pivotX
  const y = $y - stagePosition.y - pivotY

  dom.style.position = 'absolute'
  dom.style.display = visible ? '' : 'none'
  dom.style.width = `${width}px`
  dom.style.height = `${height}px`
  dom.style.left = `${x}px`
  dom.style.top = `${y}px`
  dom.style.zIndex = layer
  dom.style.opacity = alpha
  dom.style.transformOrigin = `${pivotX}px ${pivotY}px`
  dom.style.transform = `rotate(${angle}deg)`
}

export default transformDOM
