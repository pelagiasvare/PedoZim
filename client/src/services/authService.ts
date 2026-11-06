/**
 * authService — client-side authentication
 *
 * Passwords are stored as SHA-256 hashes (browser SubtleCrypto).
 * In production, replace with a real backend JWT auth endpoint.
 *
 * Demo credentials (all use the password  "Pedo@2026"):
 *   admin@school.ac.zw      ADMIN
 *   head@school.ac.zw       HEAD
 *   deputy@school.ac.zw     DEPUTY_HEAD
 *   t.moyo@school.ac.zw     TEACHER
 *   bursar@school.ac.zw     STAFF/BURSAR
 *   library@school.ac.zw    STAFF/LIBRARIAN
 *   hostel@school.ac.zw     STAFF/HOSTEL
 *   secretary@school.ac.zw  STAFF/SECRETARY
 *   t.mutasa@student.ac.zw  STUDENT
 *   gmutasa@gmail.com        PARENT
 *   director@pedozim.ac.zw  ORG
 */

import { User } from '../types';

const USERS_KEY    = 'pedo_users_v1';
const SESSION_KEY  = 'pedo_session_v1';

// ── Hashing ────────────────────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_pedozim_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Stored user record (includes hash) ────────────────────────────────
interface StoredUser extends User {
  passwordHash: string;
}

// ── Seed default accounts ──────────────────────────────────────────────
export async function seedDefaultUsers(mockUsers: User[]): Promise<void> {
  const existing = getStoredUsers();
  if (existing.length > 0) return; // already seeded

  const defaultHash = await hashPassword('Pedo@2026');

  const stored: StoredUser[] = mockUsers.map((u) => ({
    ...u,
    passwordHash: defaultHash,
  }));

  localStorage.setItem(USERS_KEY, JSON.stringify(stored));
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Login ──────────────────────────────────────────────────────────────
export async function login(
  email: string,
  password: string
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  const users = getStoredUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!found) {
    return { success: false, error: 'No account found with that email address.' };
  }

  const hash = await hashPassword(password);
  if (hash !== found.passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // Persist session
  const { passwordHash: _, ...userWithoutHash } = found;
  localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutHash));
  return { success: true, user: userWithoutHash };
}

// ── Sign Up ────────────────────────────────────────────────────────────
export async function signUp(
  name: string,
  email: string,
  password: string,
  role: User['role']
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getStoredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const hash = await hashPassword(password);
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    role,
    passwordHash: hash,
  };

  users.push(newUser);
  saveStoredUsers(users);

  const { passwordHash: _, ...userWithoutHash } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutHash));
  return { success: true, user: userWithoutHash };
}

// ── Get current session ────────────────────────────────────────────────
export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Logout ─────────────────────────────────────────────────────────────
export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Get all users (admin only) ─────────────────────────────────────────
export function getAllUsers(): User[] {
  return getStoredUsers().map(({ passwordHash: _, ...u }) => u);
}
