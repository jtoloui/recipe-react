import { NavLink } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

import { Image } from '@/components/Elements';
import { useWindowSize } from 'usehooks-ts';

type CardProps = {
  image: string;
  title: string;
  to: string;
  totalTime: string;
  ingredientsCount: number;
};

export const Card = ({
  image = 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
  title = 'Cooked Coconut Mussels',
  to = '/hello',
  totalTime = '5 mins',
  ingredientsCount = 4,
}: CardProps) => {
  return (
    <div
      className=" flex-grow overflow-hidden basis-1/2 md:basis-2/6 xl:basis-1/5 bg-white-500 rounded-lg shadow-md dark:bg-slate-700"
      style={
        {
          // flexBasis: '22.3333% ',
        }
      }
    >
      <Image
        src={image}
        fallbackSrc={`https://source.unsplash.com/random/800x800/?${title}-food`}
        className="object-cover w-full h-64 "
      />

      <div className="p-6">
        <div>
          <NavLink
            to={to}
            className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white-500 hover:text-gray-600 hover:underline"
            tabIndex={0}
            role="link"
          >
            {title}
          </NavLink>
        </div>

        <div className="mt-4 flex w-full flex-col sm:flex-row">
          <div className="flex items-center w-full sm:w-2/3">
            <div className="flex items-center text-sm text-brownishGrey-500 dark:text-white-500">
              ± {totalTime}
            </div>
            <div className="mx-2 opacity-50 bg-brownishGrey-500 max-w-xs w-1 h-1 rounded"></div>
            <span className="flex items-center text-sm text-brownishGrey-500 dark:text-white-500">
              {ingredientsCount} ingredients
            </span>
          </div>

          <NavLink
            to={to}
            className="flex sm:justify-end items-center w-full sm:w-1/3 mt-4 sm:mt-0"
          >
            <div className="border-green-500 border py-1 px-[0.625rem] rounded">
              <span className="text-green-500 text-sm font-semibold">
                + Cook
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
