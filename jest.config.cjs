/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    testMatch: ['**/*.test.ts'],
    modulePathIgnorePatterns: ["<rootDir>/src/render"],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                diagnostics: {
                    ignoreCodes: [1343]
                },
                astTransformers: {
                    before: [
                        {
                            path: 'node_modules/ts-jest-mock-import-meta',
                            options: { metaObjectReplacement: { url: 'https://www.url.com' } }
                        }
                    ]
                }
            }
        ],
    },
};