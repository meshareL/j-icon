'use strict';

/**
 * The SVG render function was not found
 */
class IconNotFoundError extends Error {
    constructor(name: string) {
        super(`JIcon: The SVG render function was not found, name: ${name}`);
    }
}

export default IconNotFoundError;
