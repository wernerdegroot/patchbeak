import { Generator } from './Generator'

export function createArrayGenerator<T>(generator: Generator<T>, numberOfElemsToGenerate: number): Generator<T[]> {
  return () => {
    const result = new Array<T>(numberOfElemsToGenerate)
    for (let i = 0; i < numberOfElemsToGenerate; ++i) {
      result[i] = generator()
    }
    return result
  }
}
