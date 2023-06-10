import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/Logo';
import LogoWithText from '@/assets/LogoWithText';
import { SigninGoogle } from '@/components/SigninGoogle/SigninGoogle';

import './login.scss';

type FormData = {
  username: string;
  password: string;
};
export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    axios
      .post('/auth/login', {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        navigate('/');
      })
      .catch((err) => {
        setError('username', {
          type: 'manual',
          message: 'Invalid username or password',
        });
        setError('password', {
          type: 'manual',
          message: 'Invalid username or password',
        });
      });
  });

  const socialLogin = () => {
    axios
      .get('/auth/login-social?type=Google')
      .then((response) => {
        // Redirect the user to the received redirect URL
        window.location.href = response.data.redirectUrl;
      })
      .catch(() => {
        setError('username', {
          type: 'manual',
          message: 'Invalid username or password',
        });
        setError('password', {
          type: 'manual',
          message: 'Invalid username or password',
        });
      });
  };
  return (
    <div className="relative dark:bg-slate-700 min-h-screen background">
      <div className="min-h-screen flex items-center">
        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
          <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">
            <Logo className="transform scale-[2.0] absolute top-[11%] left-[-30%] opacity-50" />
            <LogoWithText className="absolute top-1/2 z-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3" />

            <div className="absolute top-0 left-0 w-full h-full z-10 gradient"></div>
          </div>

          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 bg-white-500">
            <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
              Welcome back!
            </p>

            <SigninGoogle onClick={() => socialLogin()} />

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
              >
                or login with email
              </a>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>

            <form onSubmit={onSubmit}>
              <div className="mt-4">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                  htmlFor="loggingUsername"
                >
                  Username
                </label>
                <input
                  id="loggingUsername"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="text"
                  placeholder="Username"
                  {...register('username', { required: true })}
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                    htmlFor="loggingPassword"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
                  >
                    Forget Password?
                  </a>
                </div>

                <input
                  id="loggingPassword"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: true })}
                />
              </div>

              <div className="mt-6">
                {errors.username || errors.password ? (
                  <p className="text-red-500 text-xs italic">
                    {errors.username?.message || errors.password?.message}
                  </p>
                ) : null}
                <button
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white-500 capitalize transition-colors duration-300 transform bg-green-500 rounded-lg hover:text-black-500 hover:bg-white-500 hover:border-green-500 hover:border focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

              <a
                href="#"
                className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
              >
                or sign up
              </a>

              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
