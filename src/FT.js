import app from './app'

class FT {
  constructor() {
    this.app = app
  }

  create(...args) {
    this.app.init(...args)

    return this.app
  }
}

const ft = new FT()
window.ft = ft

export default ft
