import 'react-loading-skeleton/dist/skeleton.css';
import { NavLink } from 'react-router-dom';

import { Image, LogoLoader } from '@/components/Elements';

import { formatCookTime } from './cookTime';

type CardProps = {
  image: string;
  title: string;
  to: string;
  totalTime: string;
  ingredientsCount: number;
};

export const Card = ({
  image,
  title = 'Cooked Coconut Mussels',
  to = '/hello',
  totalTime = '5 mins',
  ingredientsCount = 4,
}: CardProps) => {
  return (
    <NavLink
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray2-400 bg-white-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Image
          src={image}
          placeholder={<LogoLoader size={56} />}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          alt={title}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold text-black-500 transition-colors group-hover:text-green-600 dark:text-white-500">
          {title}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-3 text-xs font-medium text-brownishGrey-600 dark:text-white-600">
          <span className="inline-flex items-center gap-1">{formatCookTime(totalTime)}</span>
          <span className="h-1 w-1 rounded-full bg-brownishGrey-400" />
          <span>
            {ingredientsCount} {ingredientsCount === 1 ? 'ingredient' : 'ingredients'}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-subtleAccent px-2.5 py-1 text-sm font-semibold text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white-500">
            Cook
          </span>
        </div>
      </div>
    </NavLink>
  );
};
