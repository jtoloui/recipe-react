import cn from 'classnames';
import { motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

import { Image, LogoLoader } from '@/components/Elements';

type CardProps = {
  image: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
  offset: number;
  cardsToShow: number;
  disabled?: boolean;
};

export const Card = ({
  image,
  title,
  onClick,
  isSelected,
  offset,
  cardsToShow,
  disabled = false,
}: CardProps) => {
  const hidden = offset < 0 || offset >= cardsToShow;

  const { width } = useWindowSize();

  return (
    <motion.div
      className={cn(
        'group relative h-60 max-h-[11.688rem] cursor-pointer overflow-hidden rounded-lg shadow-lg transition-opacity duration-500 ease-in-out',
        isSelected && 'ring-4 ring-green-500',
        hidden && width > 640 && 'hidden',
        width <= 640 ? 'w-52' : 'flex-1',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-100'
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      tabIndex={0}
    >
      {/* Image / branded placeholder fills the whole tile */}
      <div className="absolute inset-0">
        <Image
          src={image}
          placeholder={<LogoLoader size={44} />}
          className="h-full w-full object-cover"
          alt={title}
        />
      </div>

      {/* Gradient scrim so the label always reads over any image */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Label caption overlaid on the bottom of the image */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h2 className="line-clamp-2 text-center text-sm font-semibold leading-tight text-white-500 drop-shadow">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};
