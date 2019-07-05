import { Patch, PatchType } from './Patch'

export function patchesToOffset<T>(patches: Patch<T>[]) {
  let offset = 0
  for (let i = 0, n = patches.length; i < n; ++i) {
    const previousPatch = patches[i]
    switch (previousPatch.type) {
      case PatchType.Insert:
        if (previousPatch.index < offset) {
          ++offset
        }
        break
      case PatchType.Remove:
        if (previousPatch.index < offset) {
          --offset
        }
        break
      case PatchType.NoOp:
      case PatchType.Update:
        break
      default:
        const exhaustive: never = previousPatch
        throw new Error(`Unknown patch ${exhaustive}`)
    }
  }
  return offset
}
