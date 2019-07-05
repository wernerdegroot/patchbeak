import { Generator } from './Generator'
import { Patch } from '../Patch'
import { patchesToOffset } from '../patchesToOffset'
import { createPatchGenerator } from './createPatchGenerator'

export function createPatchesGenerator<T>(length: number, generator: Generator<T>, numberOfElemsToGenerate: number): Generator<Patch<T>[]> {
  return () => {
    let n = length
    const result = new Array<Patch<T>>(numberOfElemsToGenerate)
    for (let i = 0; i < numberOfElemsToGenerate; ++i) {
      const pg = createPatchGenerator(n, generator)
      const patch = pg()
      result[i] = patch
      n += patchesToOffset([patch])
    }
    return result
  }
}
