import { NavLink, NavLinkProps } from 'react-router-dom';

export const MenuLink = ({
  to,
  children,
  className,
  ...props
}: NavLinkProps) => {
  return (
    <div className="py-2 mt-2 ">
      <NavLink
        to={to}
        className={({ isActive }) =>
          ` transition-colors duration-300 transform md:mt-0 md:mx-4 text-black-500 dark:text-white-500 ${
            isActive
              ? 'border-b-2 border-green-500'
              : 'hover:border-b hover:border-green-500'
          } ${className}`
        }
        {...props}
      >
        {children}
      </NavLink>
    </div>
  );
};
