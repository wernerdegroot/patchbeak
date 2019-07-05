export type Lazy<T> = () => T

export const Lazy = {
  create<T>(fn: () => T): Lazy<T> {
    type PreviousResult = { value: T } | null
    let previousResult: PreviousResult = null
    return () => {
      if (previousResult === null) {
        previousResult = { value: fn() }
      }
      return previousResult.value
    }
  },
  from<T>(value: T): Lazy<T> {
    return () => value
  }
}
