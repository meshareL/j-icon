'use strict';

function startWith(str: string, search: string, pos: number = 0): boolean {
    pos = !pos || pos < 0 ? 0 : +pos;
    return str.substring(pos, pos + search.length) === search;
}

/**
 * lower case with dashes
 *
 * @example
 * kebabCase ---> kebab-case
 * KebabCase ---> kebab-case
 * kebabcase ---> kebabcase
 *
 * @param str 字符串
 * @return {string} KebabCase
 */
function kebabCase(str: string): string {
    // /(?!^)([A-Z])/g
    const delimiter = (index: number) => index === 0 ? '' : '-';
    return str.replace(/([A-Z])/g, (_, c, i) => `${delimiter(i)}${c.toLowerCase()}`);
}

export { startWith, kebabCase };
