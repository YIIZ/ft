import { FT } from '#/core'

/**
 * @ignore
 * @see https://github.com/pixijs/pixi-spine/blob/d864473ca6f86c2f2075388ee8da656f18e9e67a/src/loaders.ts#L96
 */
export function imageLoader(loader, namePrefix, baseUrl, imageOptions) {
  return (name, callback) => {
    const cachedResource = loader.resources[name]
    if (cachedResource) {
      // eslint-disable-next-line
      function done() {
        callback(cachedResource.texture.baseTexture)
      }

      if (cachedResource.texture) {
        done()
      } else {
        cachedResource.onAfterMiddleware.add(done)
      }
    } else {
      const url = FT.rm.url(name, { basename: true })
      loader.add(name, url, imageOptions, resource => {
        callback(resource.texture.baseTexture)
      })
    }
  }
}