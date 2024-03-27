import { z } from 'zod';

export const SignUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(8, 'Minimum password length is 8 characters')
    .max(256, 'Maximum password length is 256 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      (password) => /[!@#$%^&*()_+=\\[\]{};:"\\|,.<>\\/?]+/.test(password),
      'Password must contain at least one special character'
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const SignInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const VerificationCodeSchema = z.object({
  verificationCode: z.number().min(1, 'Verification code is required'),
  username: z.string().min(1, 'Username is required'),
});

export const ResendVerificationCodeSchema = z.object({
  username: z.string().min(1, 'Username is required'),
});

export const RequestPasswordResetSchema = z.object({
  username: z.string().min(1, 'Username is required'),
});

export const ForgotPasswordSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(8, 'Minimum password length is 8 characters')
    .max(256, 'Maximum password length is 256 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      (password) => /[!@#$%^&*()_+=\\[\]{};:"\\|,.<>\\/?]+/.test(password),
      'Password must contain at least one special character'
    ),
  verificationCode: z.number().min(1, 'Verification code is required'),
});
