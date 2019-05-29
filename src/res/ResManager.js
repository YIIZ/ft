import PIXI from '../pixi'
import fontLoader from './loader/font'
import { generateImageLoader as generateSpineImageLoader } from './loader/spine'
import { patch as patchSpritesheetLoader } from './loader/spritesheet'
import { classname } from '../utils'

patchSpritesheetLoader()

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
 * // Above code should be placed in a standalone file,
 * // Then, import `register-resources.js` after importing FT.
 * import { FT } from 'ft'
 * import './register-resources'
 */
class ResManager extends PIXI.Loader {
  constructor(...args) {
    super(...args)

    this.use(fontLoader)

    this.spineImageLoader = generateSpineImageLoader(name =>
      this.url(name, { basename: true })
    )
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
    if (!this.resources[name]) {
      this.add(...$res.nu(name))
    }

    return name
  }

  /**
   * Add a spritesheet to loading queue.
   */
  addSpritesheet(name) {
    if (!this.resources[name]) {
      const json = this.url(name, { type: 'json' })
      const image = this.url(name, { type: 'image' })

      this.add(name, json, {
        data: {
          meta: { image },
        },
        metadata: { image },
      })
    }

    return name
  }

  /**
   * Add a font to loading queue.
   */
  addFont(name) {
    if (!this.resources[name]) {
      this.add(...$res.nu(name))
    }

    return name
  }

  /**
   * Add a sound to loading queue.
   */
  addSound(name) {
    if (!this.resources[name]) {
      this.add(...$res.nu(name))
    }

    return name
  }

  /**
   * Add a spine into loading queue.
   */
  addSpine(name) {
    if (!this.resources[name]) {
      const { spineImageLoader } = this
      const json = $res.url(name, { type: 'json' })
      const atlas = $res.url(name, { type: 'atlas' })
      this.add(name, json, {
        metadata: {
          spineAtlasFile: atlas,
          imageLoader: spineImageLoader,
        },
      })
    }

    return name
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
   * Get textures from spritesheets.
   */
  spritesheetTextures(names) {
    let _names = []

    if (Array.isArray(names)) {
      _names = names
    } else {
      const name = names
      _names.push(name)
    }

    let texturesMap = []

    for (const name of _names) {
      const spritesheet = this.resources[name]?.spritesheet

      if (!spritesheet) {
        throw new Error(`[${classname(this)}] missing spritesheet - ${name}`)
      }

      for (const [name, texture] of Object.entries(spritesheet.textures)) {
        texturesMap.push({ name, texture })
      }
    }

    const textures = texturesMap
      .sort((a, b) => {
        if (a.name > b.name) {
          return 1
        }

        if (a.name < b.name) {
          return -1
        }

        return 0
      })
      .map(i => i.texture)

    return textures
  }

  /**
   * Get a sound by name.
   */
  sound(name) {
    const resource = this.resources[name]
    if (!resource) {
      throw new Error(`[${classname(this)}] missing sound - ${name}`)
    } else {
      return resource.sound
    }
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
