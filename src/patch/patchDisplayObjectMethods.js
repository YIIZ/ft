function setOrigin(originX, originY) {
  if (originX !== undefined) this.anchor.x = originX
  if (originY !== undefined) this.anchor.y = originY

  if (originY === undefined) {
    this.anchor.x = this.anchor.y = originX
  }

  return this
}

function setSize(width, height) {
  if (width !== undefined) this.width = width
  if (height !== undefined) this.height = height

  return this
}

function setWidth(width) {
  this.width = width

  return this
}

function setHeight(height) {
  this.height = height

  return this
}

function setPosition(x, y) {
  if (x !== undefined) this.x = x
  if (y !== undefined) this.y = y

  return this
}

function setPositionX(x) {
  this.x = x

  return this
}

function setPositionY(y) {
  this.y = y

  return this
}

function setScale(scaleX, scaleY) {
  if (scaleX !== undefined) this.scale.x = scaleX
  if (scaleY !== undefined) this.scale.y = scaleY

  if (scaleY === undefined) {
    this.scale.set(scaleX)
  }

  return this
}

function setScaleX(scaleX) {
  this.scale.x = scaleX

  return this
}

function setScaleY(scaleY) {
  this.scale.y = scaleY

  return this
}

function setAlpha(alpha) {
  this.alpha = alpha

  return this
}

function setInteractive(value = true) {
  this.interactive = value

  return this
}

function removeSelf() {
  this.parent.removeChild(this)
}

export default function patchDisplayObjectMethods(instance) {
  instance.setOrigin = setOrigin
  instance.setSize = setSize
  instance.setWidth = setWidth
  instance.setHeight = setHeight
  instance.setPosition = setPosition
  instance.setPositionX = setPositionX
  instance.setPositionY = setPositionY
  instance.setScale = setScale
  instance.setScaleX = setScaleX
  instance.setScaleY = setScaleY
  instance.setAlpha = setAlpha
  instance.setInteractive = setInteractive

  instance.removeSelf = removeSelf
}