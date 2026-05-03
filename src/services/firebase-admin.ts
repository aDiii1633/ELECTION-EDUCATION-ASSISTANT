import * as admin from 'firebase-admin';

export function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0];
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  try {
    if (projectId && clientEmail && privateKey && privateKey.includes('PRIVATE KEY')) {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
    // DO NOT initialize during build if keys are missing
    return null;
  } catch (error) {
    console.error('Firebase Admin init error:', error);
    return null;
  }
}

export const getAdminAuth = () => {
  const app = getAdminApp();
  if (!app) {
    return {
      createSessionCookie: async () => 'mock-cookie',
      verifySessionCookie: async () => ({}),
    } as unknown as admin.auth.Auth;
  }
  return admin.auth(app);
};
