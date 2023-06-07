import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';

import Logo from '@/assets/Logo';
import { BurgerMenu } from './BurgerMenu';
import { MenuLink } from './MenuLink';
import { Avatar } from './Avatar';

export const Menu = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const size = useWindowSize();
  const location = useLocation();

  useEffect(() => {
    if (size.width >= 768 && isBurgerMenuOpen) {
      setIsBurgerMenuOpen(false);
    }
  }, [size.width, isBurgerMenuOpen]);

  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white-500 shadow dark:shadow-white-500 dark:bg-slate-600 ">
      <div className="px-6 py-4 mx-auto">
        <div className="md:flex md:items-center">
          {/* // logo and burger menu */}
          <div className="flex items-center justify-between">
            <Link to="/" aria-label="toloui recipe menu logo">
              <Logo />
            </Link>
            <div className="flex md:hidden gap-3">
              <Avatar isOpen={isAvatarOpen} setIsOpen={setIsAvatarOpen} />
              <button
                onClick={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label="toggle menu"
              >
                <BurgerMenu isOpen={isBurgerMenuOpen} />
              </button>
            </div>
          </div>

          {/* // menu items */}
          <div
            className={`dark:bg-slate-600 absolute z-40 inset-x-0 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white-500  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto ${
              isBurgerMenuOpen
                ? ' z-[99] shadow translate-x-0 opacity-100 '
                : 'opacity-0 -translate-x-full z-20'
            } md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between`}
          >
            <div className="flex flex-col text-gray-600 capitalize md:flex md:px-16 md:-mx-4 md:flex-row md:items-center w-full">
              <MenuLink to="/" className="order-1 md:order-1">
                Home
              </MenuLink>
              <MenuLink to="/recipes" className="order-2 md:order-2">
                My Recipes
              </MenuLink>

              <div className="relative mt-4 md:mt-0 md:mx-4 w-full md:max-w-[16rem] lg:max-w-xs order-3 md:order-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dark:stroke-white-500"
                    ></path>
                  </svg>
                </span>

                {/* // Search bar */}
                <input
                  type="text"
                  className="text-ellipsis w-full py-1 pl-10 pr-4 text-black-500 dark:text-white-500 dark:placeholder-white-600 placeholder-black-600 bg-white-500  dark:bg-slate-600 border-b border-brownGrey-500 dark:border-white-500 focus:outline-none dark:focus:border-white-500 focus:border-gray-600"
                  placeholder="Search Recipe, Profile, or Ingredients"
                />
              </div>
            </div>

            {/* // profile circle icon */}
            <Avatar
              isOpen={isAvatarOpen}
              setIsOpen={setIsAvatarOpen}
              isSideMenuVersion
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
