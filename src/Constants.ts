const CONSOLIDATE_AFTER = 20

export function numberOfElemsToConsolidateAfter(totalNumberOfElems: number): number {
  return Math.floor(totalNumberOfElems / CONSOLIDATE_AFTER)
}
