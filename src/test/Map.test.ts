import { createArrayGenerator } from './createArrayGenerator'
import { createNumberGenerator } from './createNumberGenerator'
import { createPatchesGenerator } from './createPatchesGenerator'
import { Patch } from '../Patch'
import { processPatch, consolidateRegistry, map } from '../Map'
import { repeat } from './repeat'

describe('map', () => {
  const numberOfElems = 40
  const numberOfPatches = 500
  const maxElemExclusive = 100

  const numberGenerator = createNumberGenerator(0, maxElemExclusive)
  const arrayGenerator = createArrayGenerator(numberGenerator, numberOfElems)
  const patchesGenerator = createPatchesGenerator(numberOfElems, numberGenerator, numberOfPatches)

  it(
    'should result in the same array, regardless of the order in which we apply the patches',
    repeat(100, () => {
      const array = arrayGenerator()
      const patches = patchesGenerator()
      const arrayWithPatches = patches.reduce((acc, curr) => Patch.apply(acc, curr), array)
      const fn = (n: number): string => String(n) + '!'
      const mappedArrayWithPatches = arrayWithPatches.map(fn)

      const initialRegistry = map(array, fn)
      const registry = patches.reduce((acc, curr) => {
        const [registry] = processPatch(acc, curr, fn)
        return registry
      }, initialRegistry)
      const consolidatedRegistry = consolidateRegistry(registry)
      expect({ array, patches, value: mappedArrayWithPatches }).toEqual({ array, patches, value: consolidatedRegistry.mappedValues() })
    })
  )

  it(
    'should produce the same patch, whether the registry has been consolidated or not',
    repeat(100, () => {
      const array = arrayGenerator()
      const patches = patchesGenerator()
      const firstPatches = patches.slice(0, -1)
      const lastPatch = patches[patches.length - 1]
      const fn = (n: number): string => String(n) + '!'

      const initialRegistry = map(array, fn)
      const finalRegistry = firstPatches.reduce((acc, curr) => {
        const [registry] = processPatch(acc, curr, fn)
        return registry
      }, initialRegistry)
      const consolidatedFinalRegistry = consolidateRegistry(finalRegistry)

      const [, toVerify] = processPatch(finalRegistry, lastPatch, fn)
      const [, expected] = processPatch(consolidatedFinalRegistry, lastPatch, fn)
      expect({ array, patches, value: toVerify }).toEqual({ array, patches, value: expected })
    })
  )
})
