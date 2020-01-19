/**
 * Returns the first child element that matches the specified group of selectors.
 * If `baseElement` is not specified, the entire document is searched.
 */
export function QuerySelector<T extends keyof HTMLElementTagNameMap>
    (name: T, otherSelectors: string, baseElement: HTMLElement | Document = document): HTMLElementTagNameMap[T] | null
{
    return baseElement.querySelector(name + otherSelectors);
}