import app from '../app'
import classname from '../util/classname'

/**
 * A timer via
 *
 * @example
 * const timer = new Timer(500, callback)
 *
 * // start timer
 * timer.start()
 *
 * // stop timer
 * timer.stop()
 *
 * // reset timer
 * timer.reset()
 *
 */
class Timer {
  /**
   * @param {number} timeout timeout in milliseconds.
   */
  constructor(timeout, callback) {
    if (typeof timeout !== 'number') {
      throw new Error(`[${classname(this)}] timeout is required`)
    }

    this.timeout = timeout
    this.callback = callback
    this.ticker = app.ticker
    this.isTickerStopped = true

    this.startTime = 0
  }

  start() {
    this.startTime = performance.now()
    this.startTick()
  }

  stop() {
    this.stopTick()
  }

  reset() {
    if (this.isTickerStopped) {
      this.start()
    } else {
      this.startTime = performance.now()
    }
  }

  check() {
    if (this.duration > this.timeout) {
      this.stopTick()

      if (this.callback) {
        this.callback()
      }
    }
  }

  get duration() {
    const now = performance.now()
    return now - this.startTime
  }

  startTick() {
    this.isTickerStopped = false
    this.ticker.add(this.check, this)
  }

  stopTick() {
    this.isTickerStopped = true
    this.ticker.remove(this.check, this)
  }
}

function timeout(time, callback) {
  return new Timer(time, callback)
}

export default timeout
