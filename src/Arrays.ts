export const Arrays = {
  immutableSplice<A>(toSplice: A[], index: number, numberOfElemsToDelete: number, ...toInsert: A[]): A[] {
    const lengthOfToSplice = toSplice.length
    const numberOfElemsToInsert = toInsert.length
    const splicedLength = lengthOfToSplice - numberOfElemsToDelete + numberOfElemsToInsert
    const spliced = new Array<A>(splicedLength)
    let splicedIndex = 0
    for (let n = index; splicedIndex < n; ++splicedIndex) {
      spliced[splicedIndex] = toSplice[splicedIndex]
    }
    splicedIndex += numberOfElemsToDelete
    for (let elemsToInsertIndex = 0; elemsToInsertIndex < numberOfElemsToInsert; ++elemsToInsertIndex, ++splicedIndex) {
      spliced[splicedIndex] = toInsert[elemsToInsertIndex]
    }
    for (let toSpliceIndex = 0; toSpliceIndex < lengthOfToSplice; ++toSpliceIndex, ++splicedIndex) {
      spliced[splicedIndex] = toSplice[toSpliceIndex]
    }
    return spliced
  }
}
