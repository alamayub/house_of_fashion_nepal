import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { AdminSession } from '../../services/adminAuthService.ts';
import { handleLocalApiRequest } from '../../services/agencyDataService.ts';
import { clearAdminSession } from '../admin/adminSlice.ts';

const LOCAL_API_PREFIX = '/api';

const REMOTE_API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)
  ?.trim()
  .replace(/\/+$/, '');

export const API_BASE_URL = REMOTE_API_BASE_URL || LOCAL_API_PREFIX;
export const IS_REMOTE_API_ENABLED = Boolean(REMOTE_API_BASE_URL);

interface AdminAuthStateSlice {
  admin?: {
    authSession?: AdminSession | null;
  };
}

function getStatusText(status: number): string {
  switch (status) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 204:
      return 'No Content';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Unprocessable Entity';
    case 500:
      return 'Internal Server Error';
    default:
      return '';
  }
}

async function extractRequestBody(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<unknown> {
  if (init?.body !== undefined && init.body !== null) {
    if (typeof init.body === 'string') {
      if (!init.body.trim()) return undefined;
      try {
        return JSON.parse(init.body);
      } catch {
        return init.body;
      }
    }
    return init.body;
  }

  if (typeof Request !== 'undefined' && input instanceof Request) {
    const method = input.method.toUpperCase();
    if (method === 'GET' || method === 'HEAD') return undefined;
    try {
      const rawText = await input.clone().text();
      if (!rawText.trim()) return undefined;
      try {
        return JSON.parse(rawText);
      } catch {
        return rawText;
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function resolveLocalPathWithQuery(input: RequestInfo | URL): string {
  const rawUrl =
    typeof Request !== 'undefined' && input instanceof Request
      ? input.url
      : input instanceof URL
        ? input.toString()
        : String(input);

  const fallbackOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:3000';

  const parsed = new URL(rawUrl, fallbackOrigin);
  let pathname = parsed.pathname;

  if (pathname === LOCAL_API_PREFIX) {
    pathname = '/';
  } else if (pathname.startsWith(`${LOCAL_API_PREFIX}/`)) {
    pathname = pathname.slice(LOCAL_API_PREFIX.length);
  }

  return `${pathname}${parsed.search}`;
}

/**
 * Fetch adapter passed to RTK Query's `fetchBaseQuery`.
 * - When `VITE_API_BASE_URL` is configured, delegates directly to the browser's `fetch`.
 * - Otherwise executes against the local client-side agency store and wraps the result
 *   in a standard Fetch API `Response` so `fetchBaseQuery` handles headers, query params,
 *   JSON parsing, and `FetchBaseQueryError` formatting identically in both modes.
 */
const agencyFetchFn: typeof fetch = async (input, init) => {
  if (IS_REMOTE_API_ENABLED) {
    return fetch(input, init);
  }

  const method = (
    init?.method ||
    (typeof Request !== 'undefined' && input instanceof Request
      ? input.method
      : 'GET')
  ).toUpperCase();

  const relativeUrlWithQuery = resolveLocalPathWithQuery(input);
  const parsedBody = await extractRequestBody(input, init);
  const result = handleLocalApiRequest(relativeUrlWithQuery, method, parsedBody);

  return new Response(JSON.stringify(result.data), {
    status: result.status,
    statusText: getStatusText(result.status),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const rawFetchBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: 15000,
  fetchFn: agencyFetchFn,
  prepareHeaders: (headers, { getState }) => {
    headers.set('Accept', 'application/json');

    const state = getState() as AdminAuthStateSlice;
    const session = state.admin?.authSession;
    if (session) {
      headers.set('X-Admin-Email', session.email);
      headers.set('X-Admin-Role', session.role);
    }

    return headers;
  },
});

const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawFetchBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearAdminSession());
  }

  return result;
};

export function getRtkErrorMessage(
  error: unknown,
  fallback = 'Something went wrong while communicating with the studio API.',
): string {
  if (!error || typeof error !== 'object') return fallback;

  if ('status' in error) {
    const fetchErr = error as FetchBaseQueryError;
    if (
      fetchErr.data &&
      typeof fetchErr.data === 'object' &&
      'message' in fetchErr.data &&
      typeof (fetchErr.data as { message?: unknown }).message === 'string'
    ) {
      return (fetchErr.data as { message: string }).message;
    }
    if ('error' in fetchErr && typeof fetchErr.error === 'string') {
      return fetchErr.error;
    }
  }

  if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthHandling,
  refetchOnReconnect: true,
  tagTypes: [
    'Models',
    'FeaturedModels',
    'Categories',
    'Services',
    'Clients',
    'Projects',
    'Testimonials',
    'Events',
    'EventRegistrations',
    'AdminOverview',
  ],
  endpoints: () => ({}),
});
