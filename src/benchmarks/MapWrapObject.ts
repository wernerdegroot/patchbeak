import { map, processPatch } from '../Map'
import { createNumberGenerator } from '../generate/createNumberGenerator'
import { createArrayGenerator } from '../generate/createArrayGenerator'
import { createPatchesGenerator } from '../generate/createPatchesGenerator'
import { Patch } from '../Patch'

const arrayLength = 100

const numberGenerator = createNumberGenerator(0, 20)
const arrayGenerator = createArrayGenerator(numberGenerator, arrayLength)
const patchesGenerator = createPatchesGenerator(arrayLength, numberGenerator, 1000 * 1000)

const array = arrayGenerator()
const patches = patchesGenerator()

const fn = (n: number) => ({ value: n })

const startNaive = Date.now()
let accNaive = array
patches.forEach(patch => {
  accNaive = Patch.applyImmutable(accNaive, patch)
  accNaive.map(fn)
})
const endNaive = Date.now()
const durationNaive = endNaive - startNaive

const startPatched = Date.now()
let accPatched = map(array, fn)
patches.forEach(patch => {
  const [updatedAccPatched] = processPatch(accPatched, patch)
  accPatched = updatedAccPatched
})
const endPatched = Date.now()
const durationPatched = endPatched - startPatched

console.log(`Naive: 100%`)
console.log(`Patch: ${((durationPatched * 100) / durationNaive).toFixed(0)}%`)
