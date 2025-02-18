'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/components/providers/NotificationProvider'
import Link from 'next/link'

interface LoginForm {
  email: string
  password: string
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const notifications = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      notifications.addNotification({
        type: 'info',
        title: 'Signing in...',
        message: 'Please wait while we verify your credentials',
        duration: 2000,
      })

      await signIn(data.email, data.password)
      
      notifications.addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Sign in error:', error)
      notifications.addNotification({
        type: 'error',
        title: 'Sign in failed',
        message: error.message || 'Invalid credentials. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-lg border border-white/10">
        <div>
          <h2 className="text-3xl font-bold text-center">Welcome back</h2>
          <p className="mt-2 text-center text-gray-400">Please sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-white/10 rounded-md 
                    text-white bg-white/5 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#00FF84] focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-white/10 rounded-md 
                    text-white bg-white/5 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#00FF84] focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#00FF84] focus:ring-[#00FF84]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-sm text-[#00FF84] hover:text-[#00FF84]/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
              text-black bg-[#00FF84] hover:bg-[#00FF84]/90 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-[#00FF84] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-[#00FF84] hover:text-[#00FF84]/80"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
