export enum PatchType {
  Insert,
  Remove,
  NoOp,
  Update
}

export type PatchInsert<A> = Readonly<{
  type: PatchType.Insert
  index: number
  value: A
}>

export type PatchRemove = Readonly<{
  type: PatchType.Remove
  index: number
}>

export type PatchNoOp = Readonly<{
  type: PatchType.NoOp
}>

export type PatchUpdate<A> = Readonly<{
  type: PatchType.Update
  index: number
  value: A
}>

export type Patch<T> = PatchInsert<T> | PatchRemove | PatchNoOp | PatchUpdate<T>

export const Patch = {
  map<T, U>(patch: Patch<T>, fn: (t: T) => U): Patch<U> {
    switch (patch.type) {
      case PatchType.Insert:
        return { type: PatchType.Insert, index: patch.index, value: fn(patch.value) }
      case PatchType.Remove:
        return patch
      case PatchType.Update:
        return { type: PatchType.Update, index: patch.index, value: fn(patch.value) }
      case PatchType.NoOp:
        return patch
      default:
        const exhaustive: never = patch
        throw new Error(`Unknown patch ${exhaustive}`)
    }
  },
  applyMutable<T>(arr: T[], patch: Patch<T>): T[] {
    switch (patch.type) {
      case PatchType.Insert:
        arr.splice(patch.index, 0, patch.value)
        break
      case PatchType.Remove:
        arr.splice(patch.index, 1)
        break
      case PatchType.Update:
        arr[patch.index] = patch.value
        break
      case PatchType.NoOp:
        break
      default:
        const exhaustive: never = patch
        throw new Error(`Unknown patch ${exhaustive}`)
    }
    return arr
  },
  applyImmutable<T>(arr: T[], patch: Patch<T>): T[] {
    const result = arr.slice(0)
    Patch.applyMutable(arr, patch)
    return result
  }
}
