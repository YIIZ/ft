// delegate es6-tween
import { update, Tween } from 'es6-tween'

const TWEEN = { update }

if (!Tween.prototype.loop) {
  // candy for repeat forever
  Tween.prototype.loop = function loop() {
    this.repeat(Number.POSITIVE_INFINITY)
    return this
  }
}

export { Tween, Easing, Interpolation } from 'es6-tween'

/**
 * @external {TWEEN} https://github.com/tweenjs/es6-tween
 */
export default TWEEN
