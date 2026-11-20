import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppDispatch } from '../../app/hooks.ts';
import { setAdminSession } from '../../features/admin/adminSlice.ts';
import {
  type AdminSession,
  authenticateAdmin,
  DEMO_ADMIN_ACCOUNT,
} from '../../services/adminAuthService.ts';

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Studio email is required.')
    .email('Enter a valid studio email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean(),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

interface AdminLoginFormProps {
  onSuccess: (session: AdminSession) => void;
  idPrefix?: string;
}

export function AdminLoginForm({
  onSuccess,
  idPrefix = 'admin-login',
}: AdminLoginFormProps) {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const handleFillDemo = () => {
    setAuthError(null);
    clearErrors();
    setValue('email', DEMO_ADMIN_ACCOUNT.email, { shouldValidate: true });
    setValue('password', DEMO_ADMIN_ACCOUNT.password, { shouldValidate: true });
  };

  const onSubmit = async (values: AdminLoginFormValues) => {
    setAuthError(null);
    const result = authenticateAdmin(
      values.email,
      values.password,
      values.rememberMe,
    );

    if (!result.ok) {
      setAuthError(result.error);
      return;
    }

    dispatch(setAdminSession(result.session));
    onSuccess(result.session);
  };

  const emailId = `${idPrefix}-email`;
  const passwordId = `${idPrefix}-password`;
  const rememberId = `${idPrefix}-remember`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {authError && (
        <div
          role="alert"
          className="p-4 bg-[#632B37]/10 border border-[#632B37]/40 text-sm text-[#632B37] flex items-start gap-3"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor={emailId}
            className="block text-[11px] uppercase tracking-[0.16em] text-[#101010]/70 mb-2"
          >
            Studio Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#101010]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id={emailId}
              type="email"
              autoComplete="username"
              placeholder="admin@houseoffashionnepal.com.np"
              {...register('email', {
                onChange: () => {
                  if (authError) setAuthError(null);
                },
              })}
              className="w-full pl-10 pr-4 py-3 bg-[#F5F1EA] border border-[#101010]/20 text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#101010] transition-colors"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-[#632B37]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="block text-[11px] uppercase tracking-[0.16em] text-[#101010]/70 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#101010]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter studio password"
              {...register('password', {
                onChange: () => {
                  if (authError) setAuthError(null);
                },
              })}
              className="w-full pl-10 pr-11 py-3 bg-[#F5F1EA] border border-[#101010]/20 text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#101010] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#101010]/55 hover:text-[#101010] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-[#632B37]">{errors.password.message}</p>
          )}
        </div>

        <label
          htmlFor={rememberId}
          className="inline-flex items-center gap-2.5 text-xs text-[#101010]/75 cursor-pointer select-none"
        >
          <input
            id={rememberId}
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 accent-[#632B37] border border-[#101010]/30"
          />
          <span>Keep me signed in on this device</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
      >
        <span>{isSubmitting ? 'Signing In...' : 'Sign In to Admin'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Studio Demo Access Helper */}
      <div className="pt-5 border-t border-[#101010]/12 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#101010]/55">
            Demo Studio Credentials
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-[#632B37] hover:text-[#101010] transition-colors underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fill Credentials</span>
          </button>
        </div>

        <div className="text-xs text-[#101010]/70 space-y-1 font-mono">
          <p className="truncate">
            <span className="text-[#101010]/45">Email: </span>
            {DEMO_ADMIN_ACCOUNT.email}
          </p>
          <p>
            <span className="text-[#101010]/45">Pass: </span>
            {DEMO_ADMIN_ACCOUNT.password}
          </p>
        </div>
      </div>
    </form>
  );
}
