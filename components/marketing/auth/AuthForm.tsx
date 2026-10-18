'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { setAuthToken } from '@/lib/trpc';
import { trpc } from '@/providers/TRPCProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type AuthMode = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters.')
    .max(128, 'Password is too long.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/[0-9]/, 'Password must include a number.'),
  passwordConfirmation: z.string(),
}).refine((input) => input.password === input.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'Passwords do not match.',
});

type RegisterForm = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = trpc.auth.login.useMutation();
  const register = trpc.auth.register.useMutation();
  const pending = login.isPending || register.isPending;

  const methods = useForm<RegisterForm & LoginForm>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? { name: '', email: '', password: '', passwordConfirmation: '' }
      : { email: '', password: '', rememberMe: false },
  });

  async function submit(values: RegisterForm & LoginForm) {
    setError(null);

    try {
      if (isRegister) {
        const result = await register.mutateAsync({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        });
        setAuthToken(result.access);
        await router.push('/dashboard');
      } else {
        const result = await login.mutateAsync({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
        setAuthToken(result.access);
        if (values.rememberMe) {
          // Persist preference for long-lived session; token remains in memory/localStorage
          localStorage.setItem('cfs.remember_me', '1');
        }
        await router.push('/dashboard');
      }
    } catch (err: any) {
      const message = err?.message ?? err?.data?.message ?? 'Authentication failed.';
      const field = err?.data?.path?.[0];

      if (field && field !== 'passwordConfirmation') {
        methods.setError(field as any, { type: 'server', message });
      } else if (field === 'passwordConfirmation') {
        methods.setError('passwordConfirmation', { type: 'server', message });
      } else {
        setError(message);
      }
    }
  }

  return (
    <Card className="border-border/70 shadow-xl shadow-primary/5">
      <CardHeader className="gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LockKeyhole aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-2xl tracking-tight">{isRegister ? 'Create your workspace' : 'Welcome back'}</CardTitle>
          <CardDescription>{isRegister ? 'Start running a more predictable warehouse operation.' : 'Sign in to continue to your operations workspace.'}</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={methods.handleSubmit(submit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isRegister && (
            <Field
              id="name"
              label="Full name"
              icon={<UserRound aria-hidden="true" />}
              error={methods.formState.errors.name?.message}
            >
              <Input
                id="name"
                autoComplete="name"
                {...methods.register('name')}
                aria-invalid={!!methods.formState.errors.name?.message}
                placeholder="Alex Morgan"
              />
            </Field>
          )}
          <Field
            id="email"
            label="Work email"
            icon={<Mail aria-hidden="true" />}
            error={methods.formState.errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...methods.register('email')}
              aria-invalid={!!methods.formState.errors.email?.message}
              placeholder="you@company.com"
            />
          </Field>
          <Field
            id="password"
            label="Password"
            icon={<LockKeyhole aria-hidden="true" />}
            error={methods.formState.errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                {...methods.register('password')}
                aria-invalid={!!methods.formState.errors.password?.message}
                className="pr-11"
                placeholder={isRegister ? '12+ characters' : 'Enter your password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-0 top-0 flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
          </Field>
          {isRegister && (
            <Field
              id="passwordConfirmation"
              label="Confirm password"
              icon={<LockKeyhole aria-hidden="true" />}
              error={methods.formState.errors.passwordConfirmation?.message}
            >
              <Input
                id="passwordConfirmation"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...methods.register('passwordConfirmation')}
                aria-invalid={!!methods.formState.errors.passwordConfirmation?.message}
                placeholder="Repeat your password"
              />
            </Field>
          )}
          {!isRegister && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                {...methods.register('rememberMe')}
                defaultChecked={false}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
          )}
          {!isRegister && (
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}
            aria-busy={pending}
          >
            {pending && <Loader2 className="animate-spin mr-2" data-icon="inline-start" aria-hidden="true" />}
            {isRegister ? 'Create account' : 'Sign in'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? 'Already have an account?' : 'New to TradeOps?'}{' '}
            <Link href={isRegister ? '/login' : '/register'} className="font-semibold text-foreground underline-offset-4 hover:underline">
              {isRegister ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        {icon}{label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
