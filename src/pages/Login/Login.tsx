import Logo from '@/assets/Logo';
import { Button } from '@/components/Button/Button';
import cookieImg from '@/assets/images/joanie-simon-2r8BzVYZIeo-unsplash.jpg';

export const Login = () => {
  // Call an endpoint on the server that checks if the jwt cookie is present
  const login = () => {
    window.location.href = 'http://localhost:3001/auth/login';
  };

  return (
    <div className="relative">
      <div className="lg:mx-20 md:mx-16 sm:mx-8 mx-4 mt-16 z-10 relative flex flex-col lg:absolute lg:left-0 lg:top-0 lg:w-1/2">
        <div className="Logo">
          <Logo />
        </div>
        <div className="max-w-lg mb-10 mt-24">
          <p className="text-4xl font-semibold text-black mb-2.5">
            Welcome to toloui recipes, don't say I never created it
          </p>
          <p className="text-brownishGrey text-sm leading-relaxed">
            Never run out of ideas again. Try new foods, ingredients, cooking
            style, and more
          </p>
        </div>
        <div className="flex gap-5 flex-wrap">
          <Button text="Login" variant="primary" onClick={() => login()} />
          <Button text="Sign Up" variant="secondary" onClick={() => login()} />
        </div>
      </div>
      <div className="relative overflow-hidden lg:ml-auto lg:w-3/5 lg:-mr-16 opacity-30 mt-8 lg:mt-0 max-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white via-transparent"></div>
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
