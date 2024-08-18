import 'jest-extended';
import 'jest-chain';
import '@testing-library/jest-dom';

jest.mock('./src/render/events/event.ts', () => ({
    event: jest.fn(),
}));
