'use strict';

function startWith(str, search, pos = 0) {
    pos = !pos || pos < 0 ? 0 : +pos;
    return str.substring(pos, pos + search.length) === search;
}

export { startWith };
