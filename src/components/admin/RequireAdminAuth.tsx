import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.ts';

export function RequireAdminAuth() {
  const authSession = useAppSelector((s) => s.admin.authSession);
  const location = useLocation();

  if (!authSession) {
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: requestedPath }}
      />
    );
  }

  return <Outlet />;
}
