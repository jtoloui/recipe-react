import { useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/assets/LogoWithText';
import cookieImg from '@/assets/images/joanie-simon-2r8BzVYZIeo-unsplash.jpg';
import { Button } from '@/components/Button/Button';

export const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string };

  return (
    <div className="relative dark:bg-slate-700 min-h-screen">
      <div className="lg:mx-20 md:mx-16 sm:mx-8 mx-4  pt-16 z-10 relative flex flex-col lg:absolute lg:left-0 lg:top-0 lg:w-1/2">
        <div className="Logo">
          <Logo />
        </div>
        <div className="max-w-lg mb-10 mt-24">
          <p className="text-4xl font-semibold text-black-500 dark:text-white-500 mb-2.5">
            Welcome to JustCooking, don't say I never created it
          </p>
          <p className="text-brownishGrey-500 text-sm leading-relaxed">
            Never run out of ideas again. Try new foods, ingredients, cooking
            style, and more
          </p>
        </div>
        <div className="flex gap-5 flex-wrap">
          <Button
            text="Log in"
            variant="primary"
            buttonClassName="sm:w-auto h-12"
            textClassName="px-20 font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl"
            onClick={() =>
              navigate('/login#signin', {
                state: { isSignUp: false, from: state?.from },
              })
            }
          />
          <Button
            text="Sign Up"
            variant="secondary"
            buttonClassName="sm:w-auto h-12"
            textClassName="px-20 font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl"
            onClick={() =>
              navigate('/login#signup', {
                state: { isSignUp: true, from: state?.from },
              })
            }
          />
        </div>
      </div>
      <div className="relative overflow-hidden lg:ml-auto lg:w-3/5 opacity-30 mt-8 lg:mt-0 max-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white-500 dark:to-slate-700 via-transparent"></div>
        <img
          src={cookieImg}
          alt="Description of Image"
          className="object-cover w-full h-96 lg:h-full"
          style={{ objectPosition: 'left' }}
        />
      </div>
    </div>
  );
};
