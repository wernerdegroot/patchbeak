import { Generator } from './Generator'

export function createNumberGenerator(min: number, max: number): Generator<number> {
  return () => Math.floor(Math.random() * (max - min) + min)
}
