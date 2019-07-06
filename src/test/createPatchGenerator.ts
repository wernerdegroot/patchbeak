import { Generator } from './Generator'
import { Patch, PatchType } from '../Patch'
import { createNumberGenerator } from './createNumberGenerator'
import { createGeneratorFrom } from './createGeneratorFrom'

export function createPatchGenerator<T>(length: number, generator: Generator<T>): Generator<Patch<T>> {
  return (): Patch<T> => {
    const indexGenerator = createNumberGenerator(0, length)
    const typeGenerator =
      length <= 0
        ? createGeneratorFrom<PatchType>([PatchType.NoOp, PatchType.Insert])
        : createGeneratorFrom<PatchType>([PatchType.NoOp, PatchType.Insert, PatchType.Remove, PatchType.Update])
    const type = typeGenerator()
    switch (type) {
      case PatchType.Insert:
        return { type: PatchType.Insert, index: indexGenerator(), value: generator() }
      case PatchType.Remove:
        return { type: PatchType.Remove, index: indexGenerator() }
      case PatchType.Update:
        return { type: PatchType.Update, index: indexGenerator(), value: generator() }
      case PatchType.NoOp:
        return { type: PatchType.NoOp }
      default:
        const exhaustive: never = type
        throw new Error(`Unknown type ${exhaustive}`)
    }
  }
}
