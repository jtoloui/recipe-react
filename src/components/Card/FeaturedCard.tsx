import { NavLink } from 'react-router-dom';

import { Image, LogoLoader } from '@/components/Elements';

import { formatCookTime } from './cookTime';

type FeaturedCardProps = {
  image: string;
  title: string;
  to: string;
  totalTime: string;
  ingredientsCount: number;
};

/** Large hero card for the first recipe — image fills the tile, title + meta
 *  overlaid on a gradient scrim. Spans 2×2 in the bento grid so the listing
 *  reads as an editorial layout rather than a wall of identical cards. */
export const FeaturedCard = ({
  image,
  title,
  to,
  totalTime,
  ingredientsCount,
}: FeaturedCardProps) => {
  return (
    <NavLink
      to={to}
      className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-gray2-400 shadow-sm transition-all duration-200 hover:shadow-lg dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 sm:col-span-2 sm:row-span-2 sm:min-h-full"
    >
      {/* Image / placeholder fills the whole tile */}
      <div className="absolute inset-0">
        <Image
          src={image}
          placeholder={<LogoLoader size={96} />}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={title}
        />
      </div>

      {/* Gradient scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Featured badge */}
      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white-500 shadow">
        ★ Featured
      </span>

      {/* Overlaid content */}
      <div className="relative z-10 p-5">
        <h3 className="line-clamp-2 text-xl font-extrabold text-white-500 drop-shadow">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white-500/90">
          <span>{formatCookTime(totalTime)}</span>
          <span className="h-1 w-1 rounded-full bg-white-500/70" />
          <span>
            {ingredientsCount}{' '}
            {ingredientsCount === 1 ? 'ingredient' : 'ingredients'}
          </span>
        </div>
      </div>
    </NavLink>
  );
};
