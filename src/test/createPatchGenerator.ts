import { Generator } from './Generator'
import { Patch, PatchType } from '../Patch'
import { createNumberGenerator } from './createNumberGenerator'

export function createPatchGenerator<T>(length: number, generator: Generator<T>): Generator<Patch<T>> {
  return (): Patch<T> => {
    const indexGenerator = createNumberGenerator(0, length)
    const typeGenerator = createNumberGenerator(0, 4)
    const type = typeGenerator()
    switch (type) {
      case 0:
        return { type: PatchType.Insert, index: indexGenerator(), value: generator() }
      case 1:
        return { type: PatchType.Remove, index: indexGenerator() }
      case 2:
        return { type: PatchType.Update, index: indexGenerator(), value: generator() }
      case 3:
        return { type: PatchType.NoOp }
      default:
        throw new Error('Unknown type')
    }
  }
}
