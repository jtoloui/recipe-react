import { NavLink } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

import { Image } from '@/components/Elements';

type CardProps = {
  image: string;
  title: string;
  to: string;
};

export const Card = ({
  image = 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
  title = 'Cooked Coconut Mussels',
  to = '/hello',
}: CardProps) => {
  return (
    <div className=" flex-grow overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-80.0">
      <Image
        src={image}
        fallbackSrc={`https://source.unsplash.com/random/800x800/?${title}-food`}
        className="object-cover w-full h-64"
      />

      <div className="p-6">
        <div>
          <NavLink
            to={to}
            className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline"
            tabIndex={0}
            role="link"
          >
            {title}
          </NavLink>
        </div>

        <div className="mt-4 flex w-full">
          <div className="flex items-center w-2/4">
            <div className="flex items-center text-sm text-brownishGrey dark:text-white">
              ± 5 mins
            </div>
            <div className="mx-2 opacity-50 bg-brownishGrey max-w-xs w-1 h-1 rounded"></div>
            <span className="flex items-center text-sm text-brownishGrey dark:text-white">
              4 ingredients
            </span>
          </div>

          <NavLink to={to} className="flex justify-end items-center w-2/4">
            <div className=" border-green border py-1 px-[0.625rem] rounded">
              <span className="text-green text-sm font-semibold">+ Cook</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
