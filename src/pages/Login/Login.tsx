import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/assets/Logo';
import LogoWithText from '@/assets/LogoWithText';
import { LoginForm, SignInSchema, SignUpSchema } from '@/components/Forms';
import { SigninGoogle } from '@/components/SigninGoogle/SigninGoogle';

import './login.scss';

type FormData = {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [signInErrorField, setSignInErrorField] = useState<{
    username: boolean;
    password: boolean;
  }>({
    username: false,
    password: false,
  });

  const useFormSignIn = useForm<FormData>({
    resolver: zodResolver(SignInSchema),
  });
  const useFormSignUp = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const { setValue } = isSignUp ? useFormSignUp : useFormSignIn;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      navigate('/login#signin', {
        state: { isSignUp: false },
      });
    }
  }, [location.hash, navigate]);

  useEffect(() => {
    if (location.hash === '#signup') {
      setValue('username', '');
      setValue('password', '');
      setValue('email', '');
      setIsSignUp(true);
      setSignInErrorField({
        username: false,
        password: false,
      });
      setError(undefined);
      useFormSignUp.reset();
    } else if (location.hash === '#signin') {
      setIsSignUp(false);
      setSignInErrorField({
        username: false,
        password: false,
      });
      setError(undefined);
      useFormSignIn.reset();
    }
  }, [location.hash, setValue, useFormSignIn, useFormSignUp]);

  const signIn = (data: FormData) => {
    setSignInErrorField({
      username: false,
      password: false,
    });
    setError(undefined);
    axios
      .post(
        `${import.meta.env.VITE_API_URI}/auth/login`,
        {
          username: data.username,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        navigate('/');
      })
      .catch(() => {
        setError('Invalid username or password');
        setSignInErrorField({
          username: true,
          password: true,
        });
      });
  };

  const signUp = (data: FormData) => {
    setError(undefined);
    axios
      .post(
        `${import.meta.env.VITE_API_URI}/auth/register`,
        {
          username: data.username,
          password: data.password,
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setIsSignUp(false);
        navigate('/login#signin');
      })
      .catch(() => {
        setError('Error while signing up');
      });
  };

  const socialLogin = () => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/auth/login-social?type=Google`, {
        withCredentials: true,
      })
      .then((response) => {
        // Redirect the user to the received redirect URL
        window.location.href = response.data.redirectUrl;
      })
      .catch(() => {
        setError('Error while logging in');
      });
  };
  return (
    <div className="relative dark:bg-slate-700 min-h-screen background">
      <div className="min-h-screen flex items-center">
        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
          <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">
            <Logo
              className={`transform scale-[2.0] absolute ${
                isSignUp ? 'top-[24.6%]' : 'top-[11%]'
              } left-[-30%] opacity-50`}
            />
            <LogoWithText className="absolute top-1/2 z-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3" />

            <div className="absolute top-0 left-0 w-full h-full z-10 gradient"></div>
          </div>

          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 bg-white-500">
            <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
              {isSignUp ? "Let's get you started!" : 'Welcome back!'}
            </p>

            <SigninGoogle onClick={() => socialLogin()} isSignUp={isSignUp} />

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                or {isSignUp ? 'signup' : 'login'} with email
              </div>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>

            {isSignUp ? (
              <FormProvider {...useFormSignUp}>
                <LoginForm
                  onSubmit={signUp}
                  schema={SignUpSchema}
                  fields={{
                    username: true,
                    password: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                  }}
                  onSubmitErrorMessage={error}
                />
              </FormProvider>
            ) : (
              <FormProvider {...useFormSignIn}>
                <LoginForm
                  onSubmit={signIn}
                  schema={SignUpSchema}
                  fields={{
                    username: true,
                    password: true,
                    forgotPassword: true,
                  }}
                  overrideFieldErrors={signInErrorField}
                  onSubmitErrorMessage={error}
                />
              </FormProvider>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <Link
                to={`/login#${
                  location.hash === '#signup' ? 'signin' : 'signup'
                }`}
                className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
              >
                {isSignUp ? 'or sign in' : 'or sign up'}
              </Link>

              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
