export interface AdminSession {
  email: string;
  name: string;
  role: string;
  signedInAt: string;
  rememberMe: boolean;
}

interface AdminCredentialAccount {
  email: string;
  password: string;
  name: string;
  role: string;
}

const STORAGE_KEY = 'hof_nepal_admin_session_v1';

export const DEMO_ADMIN_ACCOUNT = {
  email: 'admin@houseoffashionnepal.com.np',
  password: 'hofnepal2026',
  name: 'Kiran Shrestha',
  role: 'Managing Director',
} as const;

const ADMIN_ACCOUNTS: readonly AdminCredentialAccount[] = [
  DEMO_ADMIN_ACCOUNT,
  {
    email: 'casting@houseoffashionnepal.com.np',
    password: 'casting2026',
    name: 'Anjali Gurung',
    role: 'Head of Scouting & Casting',
  },
];

function parseSession(raw: string | null): AdminSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (
      typeof parsed.email === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.role === 'string' &&
      typeof parsed.signedInAt === 'string'
    ) {
      return {
        email: parsed.email,
        name: parsed.name,
        role: parsed.role,
        signedInAt: parsed.signedInAt,
        rememberMe: Boolean(parsed.rememberMe),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const localSession = parseSession(window.localStorage.getItem(STORAGE_KEY));
    if (localSession) return localSession;
    return parseSession(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(session);
    if (session.rememberMe) {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, serialized);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable in restricted browser context; in-memory Redux state remains active.
  }
}

export function clearStoredAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage removal failures.
  }
}

export function authenticateAdmin(
  email: string,
  password: string,
  rememberMe: boolean,
): { ok: true; session: AdminSession } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const matched = ADMIN_ACCOUNTS.find(
    (account) =>
      account.email.toLowerCase() === normalizedEmail &&
      account.password === password,
  );

  if (!matched) {
    return {
      ok: false,
      error:
        'Invalid studio email or password. Please check your credentials and try again.',
    };
  }

  const session: AdminSession = {
    email: matched.email,
    name: matched.name,
    role: matched.role,
    signedInAt: new Date().toISOString(),
    rememberMe,
  };

  persistAdminSession(session);
  return { ok: true, session };
}
