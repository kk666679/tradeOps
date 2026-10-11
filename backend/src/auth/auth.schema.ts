import { z } from 'zod';

const email = z.string().trim().toLowerCase().email();
const password = z.string().min(12, 'Password must be at least 12 characters.').max(128);

export const LoginInput = z.object({ email, password });
export type LoginInput = z.infer<typeof LoginInput>;

export const RegisterInput = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  password: password.regex(/[A-Z]/, 'Password must include an uppercase letter.').regex(/[a-z]/, 'Password must include a lowercase letter.').regex(/[0-9]/, 'Password must include a number.'),
  passwordConfirmation: z.string(),
}).refine((input) => input.password === input.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'Passwords do not match.',
});
export type RegisterInput = z.infer<typeof RegisterInput>;
