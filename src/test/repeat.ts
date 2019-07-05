export function repeat(times: number, fn: () => void) {
  return () => {
    for (let i = 0; i < times; ++i) {
      fn()
    }
  }
}
