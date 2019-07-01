export enum PatchType {
  InsertAt
}

export type PatchInsertAt<A> = Readonly<{
  type: PatchType.InsertAt
  index: number
  value: A
}>
