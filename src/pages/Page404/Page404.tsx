import { AxiosError } from 'axios';
import { useNavigate, useRouteError } from 'react-router-dom';

import { Button } from '@/components/Button';

export const Page404 = () => {
  const nav = useNavigate();

  const error = useRouteError() as AxiosError<{
    message: string;
  }>;

  return (
    <div className="flex text-center flex-col min-h-screen justify-center ">
      <h2 className="text-3xl">Whoops! This is awkward</h2>
      <div>
        <h3 className="text-2xl">
          {error.response?.data.message}
          <div className="flex justify-center">
            <Button
              variant="primary"
              text="Home"
              type="submit"
              buttonClassName="sm:w-auto"
              onClick={() => nav('/')}
            />
          </div>
        </h3>
      </div>
    </div>
  );
};
