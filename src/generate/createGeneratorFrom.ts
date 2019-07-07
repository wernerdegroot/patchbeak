import { Generator } from './Generator'
import { createNumberGenerator } from './createNumberGenerator'

export function createGeneratorFrom<T>(options: T[]): Generator<T> {
  const indexGenerator = createNumberGenerator(0, options.length)
  return () => {
    return options[indexGenerator()]
  }
}
