import { useAuth0 } from '@auth0/auth0-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

type AvatarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSideMenuVersion?: boolean;
};

export const Avatar = ({
  isOpen,
  setIsOpen,
  isSideMenuVersion = false,
}: AvatarProps) => {
  const node = useRef<null | HTMLDivElement>(null);

  const { logout, user } = useAuth0();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('');

  type MenuItem = {
    to: string;
    text: string;
    onClick?: () => void;
  }[];

  const menuItems: MenuItem = [
    {
      to: '/profile',
      text: 'view profile',
      onClick: () => setIsOpen(false),
    },
    {
      to: '/settings',
      text: 'Settings',
      onClick: () => setIsOpen(false),
    },
    {
      to: '/',
      text: 'Sign Out',
      onClick: () => logout(),
    },
  ];

  const RenderMenuItems = () => {
    return (
      <>
        {menuItems.map((item) => (
          <Link
            to={item.to}
            key={item.text.replace(' ', '-')}
            onClick={item.onClick}
            className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform hover:bg-gray-100"
          >
            {item.text}
          </Link>
        ))}
      </>
    );
  };

  return (
    <>
      <div
        ref={node}
        className={`relative ${
          isSideMenuVersion ? 'hidden md:inline-block' : ' inline-block'
        }`}
      >
        <div
          className="flex justify-center md:flex md:mt-0 md:-mx-2 flex-col md:flex-row"
          onClick={() => setIsOpen(!isOpen)}
        >
          <button
            type="button"
            className="flex items-center focus:outline-none"
            aria-label="toggle profile dropdown"
          >
            <div className="w-10 h-10 overflow-hidden border-2 border-white rounded-full bg-green max-w-xs">
              <p className="flex justify-center items-center h-full text-white font-bold uppercase">
                {initials}
              </p>
            </div>
          </button>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className={`absolute right-0 z-20 w-48 py-2 mt-2 origin-top-right bg-white rounded-md shadow-xl `}
          >
            <RenderMenuItems />
          </div>
        )}
      </div>
    </>
  );
};
