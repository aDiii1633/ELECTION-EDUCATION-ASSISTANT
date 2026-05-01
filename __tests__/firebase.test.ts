jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({}))
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn()
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn()
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(true)
}));

jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(true)
}));

describe('Firebase initialization', () => {
  it('initializes app without crashing', async () => {
    const app = await import('../lib/firebase');
    expect(app.default).toBeDefined();
  });
});
