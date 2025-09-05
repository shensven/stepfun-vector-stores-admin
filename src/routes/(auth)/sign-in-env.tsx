import { createFileRoute } from '@tanstack/react-router'
import { SignInEnv } from '@/features/auth/sign-in/sign-in-env'

export const Route = createFileRoute('/(auth)/sign-in-env')({
  component: SignInEnv,
})
