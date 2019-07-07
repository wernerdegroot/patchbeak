import { Patch, PatchType } from './Patch'
import { Lazy } from './Lazy'
import { patchesToOffset } from './patchesToOffset'
import { numberOfElemsToConsolidateAfter } from './Constants'

export type Registry<T, U> = Readonly<{
  fn: (t: T) => U
  mappedValues: Lazy<U[]>
  patches: Patch<U>[]
  consolidateAfter: number
}>

export function consolidateRegistry<T, U>(registry: Registry<T, U>): Registry<T, U> {
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
  return {
    consolidateAfter: numberOfElemsToConsolidateAfter(mappedValues.length),
    fn: registry.fn,
    mappedValues: Lazy.from(mappedValues),
    patches: []
  }
}

export function map<T, U>(arr: T[], fn: (t: T) => U): Registry<T, U> {
  return {
    consolidateAfter: numberOfElemsToConsolidateAfter(arr.length),
    fn,
    mappedValues: Lazy.create(() => arr.map(fn)),
    patches: []
  }
}

export function processPatch<From, To>(previousRegistry: Registry<From, To>, patch: Patch<From>): [Registry<From, To>, Patch<To>] {
  switch (patch.type) {
    case PatchType.NoOp: {
      return [previousRegistry, patch]
    }
    case PatchType.Insert: {
      const { fn, mappedValues, consolidateAfter } = previousRegistry
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const value = fn(patch.value)
      const nextPatch: Patch<To> = { type: PatchType.Insert, index, value }
      const patches = [...previousRegistry.patches, nextPatch]
      let nextRegistry = { consolidateAfter, fn, mappedValues, patches }
      if (patches.length > consolidateAfter) {
        nextRegistry = consolidateRegistry(nextRegistry)
      }
      return [nextRegistry, nextPatch]
    }
    case PatchType.Remove: {
      const { fn, mappedValues, consolidateAfter } = previousRegistry
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const nextPatch: Patch<To> = { type: PatchType.Remove, index }
      const patches = [...previousRegistry.patches, nextPatch]
      let nextRegistry = { consolidateAfter, fn, mappedValues, patches }
      if (patches.length > consolidateAfter) {
        nextRegistry = consolidateRegistry(nextRegistry)
      }
      return [nextRegistry, nextPatch]
    }
    case PatchType.Update: {
      const { fn, mappedValues, consolidateAfter } = previousRegistry
      const index = patch.index + patchesToOffset(previousRegistry.patches)
      const value = fn(patch.value)
      const nextPatch: Patch<To> = { type: PatchType.Update, index, value }
      const patches = [...previousRegistry.patches, nextPatch]
      let nextRegistry = { consolidateAfter, fn, mappedValues, patches }
      if (patches.length > consolidateAfter) {
        nextRegistry = consolidateRegistry(nextRegistry)
      }
      return [nextRegistry, nextPatch]
    }
    default:
      const exhaustive: never = patch
      throw new Error(`Unknown patch ${exhaustive}`)
  }
}
