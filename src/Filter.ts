// import { Predicate } from './Predicate'
// import { Patch, PatchType } from './Patch'

// type Registry<A> = Readonly<{
//   numberOfElementsInFiltered: number
//   mapping: Array<boolean>
//   previousValues: A[]
// }>

// export function processPatch<A>(previousRegistry: Registry<A>, predicate: Predicate<A>, patch: Patch<A>): [A[], Registry<A>] {
//   switch (patch.type) {
//     case PatchType.Insert: {
//       const satisfiesPredicate = predicate(patch.value)

//       const previousNumberOfElements = previousRegistry.mapping.length
//       const previousNumberOfElementsInFiltered = previousRegistry.numberOfElementsInFiltered
//       const nextNumberOfElementsInFiltered = satisfiesPredicate ? previousNumberOfElementsInFiltered + 1 : previousNumberOfElementsInFiltered
//       const nextFiltered = new Array<A>(previousNumberOfElementsInFiltered)
//       const nextMapping = previousRegistry.mapping.slice(0)
//       const nextPreviousValues = previousRegistry.previousValues.slice(0)
//       if (patch.index === null) {
//         nextMapping.push(satisfiesPredicate)
//         nextPreviousValues.push(patch.value)
//       } else {
//         nextMapping.splice(patch.index, 0, satisfiesPredicate)
//         nextPreviousValues.splice(patch.index, 0, patch.value)
//       }
//       let i = 0 // For `previousRegistry.mapping`
//       let j = 0 // For `filtered`
//       const n = patch.index === null ? previousNumberOfElementsInFiltered : patch.index
//       while (i < n) {
//         if (previousRegistry.mapping[i]) {
//           nextFiltered[j] = previousRegistry.previousValues[i]
//           j += 1
//         }
//         i += 1
//       }
//       if (satisfiesPredicate) {
//         nextFiltered[j] = patch.value
//         j += 1
//       }
//       i += 1
//       while (i < previousNumberOfElements) {
//         if (previousRegistry.mapping[i]) {
//           nextFiltered[j] = previousRegistry.previousValues[i]
//           j += 1
//         }
//         i += 1
//       }
//       const nextRegistry: Registry<A> = {
//         numberOfElementsInFiltered: nextNumberOfElementsInFiltered,
//         previousValues: nextPreviousValues,
//         mapping: nextMapping
//       }
//       return [nextFiltered, nextRegistry]
//     }
//     case PatchType.Remove: {
//       const satisfiesPredicate = predicate(previousRegistry.previousValues[patch.index])

//       const previousNumberOfElements = previousRegistry.mapping.length
//       const previousNumberOfElementsInFiltered = previousRegistry.numberOfElementsInFiltered
//       const nextNumberOfElementsInFiltered = satisfiesPredicate ? previousNumberOfElementsInFiltered - 1 : previousNumberOfElementsInFiltered
//       const nextFiltered = new Array<A>(previousNumberOfElementsInFiltered)
//       const nextMapping = previousRegistry.mapping.slice(0)
//       nextMapping.splice(patch.index, 1)
//       const nextPreviousValues = previousRegistry.previousValues.slice(0)
//       nextPreviousValues.splice(patch.index, 1)
//       let i = 0 // For `previousRegistry.mapping`
//       let j = 0 // For `filtered`
//       const n = patch.index
//       while (i < n) {
//         if (previousRegistry.mapping[i]) {
//           nextFiltered[j] = previousRegistry.previousValues[i]
//           j += 1
//         }
//         i += 1
//       }
//       i += 1
//       while (i < previousNumberOfElements) {
//         if (previousRegistry.mapping[i]) {
//           nextFiltered[j] = previousRegistry.previousValues[i]
//           j += 1
//         }
//         i += 1
//       }
//       const nextRegistry: Registry<A> = {
//         numberOfElementsInFiltered: nextNumberOfElementsInFiltered,
//         previousValues: nextPreviousValues,
//         mapping: nextMapping
//       }
//       return [nextFiltered, nextRegistry]
//     }
//   }
// }
