'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { setAuthToken } from '@/lib/trpc';
import { trpc } from '@/providers/TRPCProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'login' | 'register';

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({ name: '', email: '', password: '', passwordConfirmation: '' });
  const login = trpc.auth.login.useMutation();
  const register = trpc.auth.register.useMutation();
  const pending = login.isPending || register.isPending;

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
    setError('');
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (isRegister && form.name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 12) nextErrors.password = 'Use at least 12 characters.';
    if (isRegister && form.password !== form.passwordConfirmation) nextErrors.passwordConfirmation = 'Passwords do not match.';
    if (Object.keys(nextErrors).length) { setFieldErrors(nextErrors); return; }

    try {
      const result = isRegister
        ? await register.mutateAsync({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, passwordConfirmation: form.passwordConfirmation })
        : await login.mutateAsync({ email: form.email.trim().toLowerCase(), password: form.password });
      setAuthToken(result.access);
      window.location.assign('/app');
    } catch {
      setError(isRegister ? 'We could not create your account. Check your details and try again.' : 'We could not sign you in. Check your email and password.');
    }
  }

  return (
    <Card className="border-border/70 shadow-xl shadow-primary/5">
      <CardHeader className="gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><LockKeyhole aria-hidden="true" /></div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-2xl tracking-tight">{isRegister ? 'Create your workspace' : 'Welcome back'}</CardTitle>
          <CardDescription>{isRegister ? 'Start running a more predictable warehouse operation.' : 'Sign in to continue to your operations workspace.'}</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={submit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
          {isRegister && <Field id="name" label="Full name" icon={<UserRound aria-hidden="true" />} error={fieldErrors.name}><Input id="name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={!!fieldErrors.name} placeholder="Alex Morgan" /></Field>}
          <Field id="email" label="Work email" icon={<Mail aria-hidden="true" />} error={fieldErrors.email}><Input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={!!fieldErrors.email} placeholder="you@company.com" /></Field>
          <Field id="password" label="Password" icon={<LockKeyhole aria-hidden="true" />} error={fieldErrors.password}><div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => update('password', event.target.value)} aria-invalid={!!fieldErrors.password} className="pr-11" placeholder={isRegister ? '12+ characters' : 'Enter your password'} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-0 top-0 flex size-10 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></Field>
          {isRegister && <Field id="passwordConfirmation" label="Confirm password" icon={<LockKeyhole aria-hidden="true" />} error={fieldErrors.passwordConfirmation}><Input id="passwordConfirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.passwordConfirmation} onChange={(event) => update('passwordConfirmation', event.target.value)} aria-invalid={!!fieldErrors.passwordConfirmation} placeholder="Repeat your password" /></Field>}
          {!isRegister && <div className="flex justify-end"><Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link></div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden="true" />}{isRegister ? 'Create account' : 'Sign in'}</Button>
          <p className="text-center text-sm text-muted-foreground">{isRegister ? 'Already have an account?' : 'New to TradeOps?'}{' '}<Link href={isRegister ? '/login' : '/register'} className="font-semibold text-foreground underline-offset-4 hover:underline">{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
        </CardFooter>
      </form>
    </Card>
  );
}

function Field({ id, label, icon, error, children }: { id: string; label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id} className="flex items-center gap-2">{icon}{label}</Label>{children}{error && <p className="text-sm text-destructive" role="alert">{error}</p>}</div>;
}
