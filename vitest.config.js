import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [ '**/test/**/*.spec.[jt]s' ],
        environment: 'jsdom',
        clearMocks: true,
        mockReset: true,
        restoreMocks: true,
        reporters: 'basic',
        cacheDir: 'node_modules/.cache/.vitest',
        coverage: {
            enabled: true,
            include: [
                'src/index.ts',
                'src/j-icon.ts',
                'src/not-found-error.ts'
            ]
        }
    }
});
