import { FT } from '#/core'
import { Tween } from '#/animation'
import { classname, qs } from '#/utils'

/**
 * Manager of Scenes.
 *
 * @example
 * // default instance of SceneManager.
 * const { default: sceneManager } = SceneManager
 *
 * class Preloader extends Scene {
 *   onAdded() {
 *     // ...
 *     sceneManager.load('playground')
 *   }
 * }
 *
 * class Playground extends Scene {
 *   onAdded() {
 *     // ...
 *   }
 * }
 *
 * // register scenes
 * sceneManager.register('preloader', Preloader)
 * sceneManager.register('playground', Playground)
 *
 * // load scene
 * sceneManager.load('preloader')
 */
class SceneManager {
  constructor() {
    /**
     * Store all registered scenes.
     * @access private
     */
    this.availableScenes = []

    /**
     * Store all loaded scenes.
     * @access private
     */
    this.activeScenes = []
  }

  /**
   * Register a scene.
   * @param {string} name name of scene
   * @param {Scene} Class subclass of {@link Scene}
   */
  register(name, Class) {
    this.availableScenes.push({
      name,
      Class,
    })
  }

  /**
   * Load scene which is already registered. This method will remove all scenes
   * which aren't sticky.
   *
   * @param {string} name name of scene
   * @param {Object} [options]
   * @param {boolean} [options.sticky=false] scene will not be removed unless
   *                                         you unload it explicitly
   * @param {boolean} [options.transition=false] enable transition when switching
   *                                            scene
   * @param {number} [options.transitionTime=500] transition's duration, unit in
   *                                            seconds
   * @return {boolean} load is done or not
   */
  load(name, { sticky = false, transition = false, duration = 500 } = {}) {
    this.cleanup()
    const scene = this.availableScenes.find(s => s.name === name)
    if (!scene) {
      if (name) {
        // eslint-disable-next-line
        console.error(
          `[${classname(this)}] failed to load unregistered scene - ${name}`
        )
      }
      return false
    }

    const { Class, name: $name } = scene
    const activeScene = FT.create(Class, $name)
    activeScene.sticky = sticky

    this.activeScenes.push(activeScene)

    if (transition) {
      // a simple transition
      activeScene.alpha = 0
      const tween = new Tween(activeScene).to({ alpha: 1 }, duration)
      tween.start()
    }

    FT.internal.stage.addChild(activeScene)
    return true
  }

  /**
   * Load scene according `scene` field in querystring
   */
  qsload() {
    const qo = qs.parse()
    const { scene: name } = qo
    return this.load(name)
  }

  /**
   * Cleanup useless actived scenes
   * @access private
   */
  cleanup() {
    this.activeScenes = this.activeScenes.filter(scene => {
      if (scene.sticky) {
        return true
      } else {
        FT.internal.stage.removeChild(scene)
        scene.destroy({ children: true })
        return false
      }
    })
  }

  /**
   * Unload a scene by name explicitly.
   * @param {string} name name of scene
   */
  unload(name) {
    const index = this.activeScenes.findIndex(s => s.name === name)
    if (index >= 0) {
      const scene = this.activeScenes[index]
      FT.internal.stage.removeChild(scene)
      scene.destroy({ children: true })
      this.activeScenes.splice(index, 1)
    }
  }

  /**
   * Find a loaded scene by name.
   * @param {string} name name of a loaded scene
   */
  find(name) {
    const scene = this.activeScenes.find(s => s.name === name)
    return scene
  }
}

SceneManager.default = new SceneManager()

export default SceneManager
