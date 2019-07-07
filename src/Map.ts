import { Patch, PatchType } from './Patch'
import { Lazy } from './Lazy'
import { patchesToOffset } from './patchesToOffset'

export type Registry<T> = Readonly<{
  mappedValues: Lazy<T[]>
  patches: Patch<T>[]
}>

export function consolidateRegistry<T>(registry: Registry<T>): Registry<T> {
  const mappedValues = registry.mappedValues().slice(0)
  for (let i = 0, n = registry.patches.length; i < n; ++i) {
    const patch = registry.patches[i]
    switch (patch.type) {
      case PatchType.NoOp:
        break
      case PatchType.Insert:
        mappedValues.splice(patch.index, 0, patch.value)
        break
      case PatchType.Remove:
        mappedValues.splice(patch.index, 1)
        break
      case PatchType.Update:
        mappedValues[patch.index] = patch.value
        break
      default:
        const exhaustive: never = patch
        throw new Error(`Unknown patch ${exhaustive}`)
    }
  }
  return { mappedValues: Lazy.from(mappedValues), patches: [] }
}

export function map<T, U>(arr: T[], fn: (t: T) => U): Registry<U> {
  return {
    mappedValues: Lazy.create(() => arr.map(fn)),
    patches: []
  }
}

export function processPatch<From, To>(previousRegistry: Registry<To>, patch: Patch<From>, fn: (from: From) => To): [Registry<To>, Patch<To>] {
  switch (patch.type) {
    case PatchType.NoOp: {
      return [previousRegistry, patch]
    }
    case PatchType.Insert: {
      const mappedValues = previousRegistry.mappedValues
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const value = fn(patch.value)
      const nextPatch: Patch<To> = { type: PatchType.Insert, index, value }
      const patches = [...previousRegistry.patches, nextPatch]
      return [{ mappedValues, patches }, nextPatch]
    }
    case PatchType.Remove: {
      const mappedValues = previousRegistry.mappedValues
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const nextPatch: Patch<To> = { type: PatchType.Remove, index }
      const patches = [...previousRegistry.patches, nextPatch]
      return [{ mappedValues, patches }, nextPatch]
    }
    case PatchType.Update: {
      const mappedValues = previousRegistry.mappedValues
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const value = fn(patch.value)
      const nextPatch: Patch<To> = { type: PatchType.Update, index, value }
      const patches = [...previousRegistry.patches, nextPatch]
      return [{ mappedValues, patches }, nextPatch]
    }
    default:
      const exhaustive: never = patch
      throw new Error(`Unknown patch ${exhaustive}`)
  }
}
