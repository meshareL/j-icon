import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [ '**/test/**/*.spec.[jt]s' ],
        environment: 'happy-dom',
        clearMocks: true,
        mockReset: true,
        restoreMocks: true,
        reporters: 'basic',
        cacheDir: 'node_modules/.cache/.vitest',
        coverage: {
            enabled: true,
            include: [
                'src/component/index.ts',
                'src/cli/parse.ts',
                'src/cli/generate.ts',
                'src/cli/index.ts'
            ]
        }
    }
});
