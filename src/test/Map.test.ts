import { createArrayGenerator } from './createArrayGenerator'
import { createNumberGenerator } from './createNumberGenerator'
import { createPatchesGenerator } from './createPatchesGenerator'
import { Patch } from '../Patch'
import { Registry, processPatch, consolidateRegistry } from '../Map'
import { Lazy } from '../Lazy'
import { repeat } from './repeat'

describe('map', () => {
  it(
    'should result in the same array, regardless of the order in which we apply the patches',
    repeat(100, () => {
      const numberOfElems = 1000
      const numberOfPatches = 100

      const numberGenerator = createNumberGenerator(0, numberOfPatches)
      const arrayGenerator = createArrayGenerator(numberGenerator, numberOfElems)
      const patchesGenerator = createPatchesGenerator(numberOfElems, numberGenerator, 500)

      const array = arrayGenerator()
      const patches = patchesGenerator()
      const fn = (n: number): string => String(n) + '!'

      const mappedArray = array.map(fn)
      const mappedPatches = patches.map(patch => Patch.map(patch, fn))
      const mappedArrayWithMappedPatches = mappedPatches.reduce((acc, curr) => Patch.apply(acc, curr), mappedArray)

      const initialRegistry: Registry<string> = {
        mappedValues: Lazy.from(array.map(fn)),
        patches: []
      }
      const registry = patches.reduce((acc, curr) => {
        const [registry] = processPatch(acc, curr, fn)
        return registry
      }, initialRegistry)
      const consolidatedRegistry = consolidateRegistry(registry)
      expect(mappedArrayWithMappedPatches).toEqual(consolidatedRegistry.mappedValues())
    })
  )
})
