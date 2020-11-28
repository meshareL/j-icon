'use strict';
/**
 * The SVG was not found
 */
class IconNotFoundError extends Error {
    constructor(name) {
        super();
        this.message = `JIcon: The SVG was not found, icon: ${name}`;
    }
}

export default IconNotFoundError;
