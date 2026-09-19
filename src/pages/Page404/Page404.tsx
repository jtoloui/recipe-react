import { AxiosError } from 'axios';
import { useNavigate, useRouteError } from 'react-router-dom';

import Logo from '@/assets/Logo';
import { Button } from '@/components/Button';

export const Page404 = () => {
  const nav = useNavigate();

  const error = useRouteError() as AxiosError<{
    message: string;
  }>;

  const message =
    error?.response?.data?.message || "We couldn't find what you were after.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-lightBg-500 px-6 text-center dark:bg-slate-800">
      <Logo className="h-16 w-16" surface="light" />
      <p className="text-sm font-bold uppercase tracking-widest text-green-600">
        Page not found
      </p>
      <h2 className="text-3xl font-extrabold tracking-tight text-black-500 dark:text-white-500">
        Whoops! This is awkward
      </h2>
      <p className="max-w-md text-sm text-brownishGrey-600 dark:text-white-600">
        {message}
      </p>
      <div className="mt-2">
        <Button
          variant="primary"
          text="Back to home"
          type="button"
          buttonClassName="sm:w-auto"
          onClick={() => nav('/')}
        />
      </div>
    </div>
  );
};

export default Page404;
