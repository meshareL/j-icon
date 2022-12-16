'use strict';
/** @type {import('jest').Config} */
module.exports = {
    cacheDirectory: 'node_modules/.cache/jest',
    clearMocks: false,
    collectCoverage: false,
    testEnvironment: 'node',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    },
    testMatch: [
        '**/test/**/*.spec.[tj]s'
    ],
    transformIgnorePatterns: [
        '/node_modules/'
    ],
    moduleFileExtensions: ['js', 'ts', 'd.ts', 'json', 'node']
};
