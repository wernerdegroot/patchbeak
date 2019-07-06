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
      const numberOfElems = 40
      const numberOfPatches = 500
      const maxElemExclusive = 100

      const numberGenerator = createNumberGenerator(0, maxElemExclusive)
      const arrayGenerator = createArrayGenerator(numberGenerator, numberOfElems)
      const patchesGenerator = createPatchesGenerator(numberOfElems, numberGenerator, numberOfPatches)

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
      expect({ array, patches, value: mappedArrayWithMappedPatches }).toEqual({ array, patches, value: consolidatedRegistry.mappedValues() })
    })
  )

  it(
    'should produce the same patch, whether the registry has been consolidated or not',
    repeat(100, () => {
      const numberOfElems = 40
      const numberOfPatches = 500
      const maxElemExclusive = 100

      const numberGenerator = createNumberGenerator(0, maxElemExclusive)
      const arrayGenerator = createArrayGenerator(numberGenerator, numberOfElems)
      const patchesGenerator = createPatchesGenerator(numberOfElems, numberGenerator, numberOfPatches)

      const array = arrayGenerator()
      const patches = patchesGenerator()
      const patchesToApply = patches.slice(0, -1)
      const patchToTest = patches[patches.length - 1]
      const fn = (n: number): string => String(n) + '!'

      const initialRegistry: Registry<string> = {
        mappedValues: Lazy.from(array.map(fn)),
        patches: []
      }
      const registry = patchesToApply.reduce((acc, curr) => {
        const [registry] = processPatch(acc, curr, fn)
        return registry
      }, initialRegistry)
      const consolidatedRegistry = consolidateRegistry(registry)

      const [, toVerify] = processPatch(registry, patchToTest, fn)
      const [, expected] = processPatch(consolidatedRegistry, patchToTest, fn)
      expect({ array, patches, value: toVerify }).toEqual({ array, patches, value: expected })
    })
  )
})
