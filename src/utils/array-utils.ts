export function hasDuplicates(array: Array<unknown>): boolean {
    return array.some((value, index) => array.indexOf(value, index + 1) !== -1);
}
