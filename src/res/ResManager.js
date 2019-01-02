import PIXI from '#/pixi'
import 'pixi-sound'
import 'pixi-spine'
import { classname } from '#/utils'
import { imageLoader as spineImageLoader } from './loader/spine'
import fontLoader from './loader/font'

let $res

/**
 * Resource manager built on the loader provided by PIXI.
 *
 * In FT, resources for `ResManager` must be registered in advance.
 * Because of that, you need to create a standalone module for `ResManager` in
 * order to achieve this.
 *
 * @example
 * // register-resources.js
 * import { ResManager } from 'ft'
 * import resources from '!val-loader?basedir=./res!ft/res/scan.val'
 * ResManager.register(resources)
 *
 * // Above code should be placed in a standalone file.
 * // Then, import `register-resources` at first line of the entry file.
 */
class ResManager extends PIXI.loaders.Loader {
  constructor(...args) {
    super(...args)

    this.use(fontLoader)
  }

  /**
   * Register metadata of resources generated by res/scan.val.js
   */
  static register(res) {
    $res = res
  }

  get res() {
    return $res
  }

  /**
   * Add an image to loading queue.
   */
  addImage(name) {
    if (this.resources[name]) return
    this.add(...$res.nu(name))
  }

  /**
   * Add a font to loading queue.
   */
  addFont(name) {
    if (this.resources[name]) return
    this.add(...$res.nu(name))
  }

  /**
   * Add a sound to loading queue.
   */
  addSound(name) {
    if (this.resources[name]) return
    this.add(...$res.nu(name))
  }

  /**
   * Add a spine into loading queue.
   */
  addSpine(name) {
    if (this.resources[name]) return

    const json = $res.url(name, { type: 'json' })
    const atlas = $res.url(name, { type: 'atlas' })
    this.add(name, json, {
      metadata: {
        spineAtlasFile: atlas,
        imageLoader: spineImageLoader,
      },
    })
  }

  /**
   * Get url of resource.
   */
  url(...args) {
    return $res.url(...args)
  }

  /**
   * Get a texture by name.
   */
  texture(name) {
    const resource = this.resources[name]
    if (!resource) {
      throw new Error(`[${classname(this)}] missing texture - ${name}`)
    } else {
      return resource.texture
    }
  }

  /**
   * Get a sound by name.
   */
  sound(name) {
    const resource = this.resources[name]
    return resource.sound
  }

  /**
   * Get a spine by name.
   */
  spine(name) {
    const resource = this.resources[name]
    if (!resource) {
      throw new Error(`[${classname(this)}] missing spine - ${name}`)
    } else {
      return resource.spineData
    }
  }
}

ResManager.default = new ResManager()

export default ResManager
