import { Generator } from './Generator'
import { Patch } from '../Patch'
import { patchesToOffset } from '../patchesToOffset'
import { createPatchGenerator } from './createPatchGenerator'

export function createPatchesGenerator<T>(length: number, generator: Generator<T>, numberOfPatchesToGenerate: number): Generator<Patch<T>[]> {
  return () => {
    // What to do if `length` is 0?
    let n = length
    const result = new Array<Patch<T>>(numberOfPatchesToGenerate)
    for (let i = 0; i < numberOfPatchesToGenerate; ++i) {
      const pg = createPatchGenerator(n, generator)
      const patch = pg()
      result[i] = patch
      n += patchesToOffset([patch])
    }
    return result
  }
}
