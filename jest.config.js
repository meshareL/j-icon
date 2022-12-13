/** @type {import('jest').Config} */
module.exports = {
    cacheDirectory: 'node_modules/.cache/jest',
    clearMocks: true,
    collectCoverage: false,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    },
    testMatch: [
        "**/test/**/*.spec.[tj]s"
    ]
};
