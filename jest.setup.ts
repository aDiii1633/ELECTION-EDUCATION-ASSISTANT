// jest.setup.ts
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock SpeechRecognition
Object.defineProperty(window, 'SpeechRecognition', { value: jest.fn() });
Object.defineProperty(window, 'webkitSpeechRecognition', { value: jest.fn() });
Object.defineProperty(window, 'speechSynthesis', {
  value: { speak: jest.fn(), cancel: jest.fn() },
});
