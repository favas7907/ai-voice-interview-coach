import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInAnonymously, 
  signOut,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export const mapAuthCodeToMessage = (code: string): string => {
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in the Firebase Console. Please enable it in the Authentication > Sign-in method tab.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An unexpected authentication error occurred. Please try again.';
  }
};

export const authService = {
  async loginWithEmail(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(mapAuthCodeToMessage(authError.code));
    }
  },

  async signupWithEmail(email: string, password: string) {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(mapAuthCodeToMessage(authError.code));
    }
  },

  async loginWithGoogle() {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(mapAuthCodeToMessage(authError.code));
    }
  },

  async loginAsGuest() {
    try {
      return await signInAnonymously(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(mapAuthCodeToMessage(authError.code));
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out. Please try again.');
    }
  }
};
