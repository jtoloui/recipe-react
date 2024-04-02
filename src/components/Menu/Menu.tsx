import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';

import Logo from '@/assets/LogoWithText';

import { Avatar } from './Avatar';
import { BurgerMenu } from './BurgerMenu';
import { MenuLink } from './MenuLink';
import { SearchBar } from './SearchBar';

export const Menu = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const size = useWindowSize();
  const location = useLocation();

  const handleSearch = (search: string) => {
    setSearchTriggered(true);
    setSearchParams((params) => {
      if (!search) {
        params.delete('search');
        if (search === '') setSearchTriggered(false);
      } else {
        params.set('search', search);
      }
      window.dispatchEvent(
        new CustomEvent('homeSearch', { detail: { search } })
      );
      return params;
    });
    if (isBurgerMenuOpen) setIsBurgerMenuOpen(false);
  };

  useEffect(() => {
    if (size.width >= 768 && isBurgerMenuOpen) {
      setIsBurgerMenuOpen(false);
    }
  }, [size.width, isBurgerMenuOpen]);

  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white-500 shadow-md dark:shadow-white-500 dark:bg-slate-600 rounded-b-lg fixed w-full z-[99]">
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
                ? ' shadow translate-x-0 opacity-100 '
                : 'opacity-0 -translate-x-full z-20'
            } md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between`}
          >
            <div className="flex flex-col text-gray-600 capitalize md:flex md:px-16 md:-mx-4 md:flex-row md:items-center w-full">
              <MenuLink to="/" className="order-1 md:order-1">
                Home
              </MenuLink>
              <MenuLink
                to="/recipes"
                className="order-2 md:order-2 whitespace-nowrap"
              >
                My Recipes
              </MenuLink>

              <div className="relative mt-4 md:mt-0 md:mx-4 w-full order-3 md:order-3">
                <SearchBar
                  handleSearch={handleSearch}
                  showRemoveSearch={searchTriggered}
                  setRemoveSearch={setSearchTriggered}
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
