'use strict';

/**
 * The SVG render function was not found
 */
class IconNotFoundError extends Error {
    constructor(iconName) {
        super();
        this.message = `JIcon: The SVG render function was not found, name: ${iconName}`;
    }
}

export default IconNotFoundError;
