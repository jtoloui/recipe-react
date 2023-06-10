import { motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

import { Image } from '@/components/Elements';

type CardProps = {
  image: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
  offset: number;
  cardsToShow: number;
};

export const Card = ({
  image,
  title,
  onClick,
  isSelected,
  offset,
  cardsToShow,
}: CardProps) => {
  const hidden = offset < 0 || offset >= cardsToShow;

  const { width } = useWindowSize();

  return (
    <motion.div
      className={`rounded-lg h-60 max-w-[25.125rem] max-h-[11.688rem] relative overflow-hidden shadow-lg cursor-pointer transition-opacity duration-500 ease-in-out hover:opacity-100 ${
        isSelected ? 'border-4  border-green-500 ' : ''
      } ${hidden && width > 640 ? 'hidden' : ''} ${
        width <= 640 ? ' w-52' : 'flex-1'
      }`}
      whileHover={{ scale: 1.05 }}
      // initial={{ opacity: 0.7 }}
      onClick={onClick} // Add onClick function to the Card component
      tabIndex={0}
    >
      <Image
        src={image}
        fallbackSrc={`https://source.unsplash.com/random/800x800/?${title}-food`}
        className="w-full h-2/3 object-cover"
        alt={title}
      />
      <div className="bg-white-500 w-full h-1/3 p-4 dark:bg-gray-800">
        <h2 className="leading-tight text-center text-black-500 text-base font-thin dark:text-white-500">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};
