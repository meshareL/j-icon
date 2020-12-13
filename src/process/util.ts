'use strict';
import camelcase from 'camelcase';
import {ISVGElement} from './processor';

function exportation(elements: Record<string, ISVGElement>): string {
    const names = Object.keys(elements).map(name => [name, camelcase(name, {pascalCase: true})]);

    return `export default {${names.map(([name, pascalCase]) => `'${name}': ${pascalCase}`).join(',')}};
            export {${names.map(([, name]) => name).join(',')}};`;
}

export { exportation };
