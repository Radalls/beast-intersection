import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],
};

export default config;
