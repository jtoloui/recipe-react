import axios from 'axios';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Card = ({ image, title }: { image: string; title: string }) => {
  return (
    <motion.div
      className="border-b rounded-lg max-w-[25.125rem] max-h-[11.688rem] relative overflow-hidden shadow-lg cursor-pointer transition-opacity duration-500 ease-in-out hover:opacity-100"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0.7 }}
    >
      <img src={image} alt={title} className="w-full h-2/3 object-cover" />
      <div className="bg-white w-full h-1/3 p-4">
        <h2 className="text-lg">{title}</h2>
      </div>
    </motion.div>
  );
};

const Carousel = ({
  data,
}: {
  data: {
    image: string;
    title: string;
  }[];
}) => {
  const [current, setCurrent] = useState(0);

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      {current > 0 && (
        <button
          onClick={() => setCurrent((old) => old - 1)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-24 h-24 p-6 transform rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5l7 7-7 7"
              className="stroke-charcoal"
            />
          </svg>
        </button>
      )}
      <div className="relative px-6 py-4">
        <AnimatePresence>
          <motion.div
            className="flex space-x-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
          >
            {data.slice(current, current + 8).map((card) => (
              <Card key={card.title} image={card.image} title={card.title} />
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-white to-transparent"></div>
      </div>
      {current < data.length - 8 && (
        <button
          onClick={() => setCurrent((old) => old + 1)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-24 h-24 p-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5l7 7-7 7"
              className="stroke-charcoal"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const data = [
  {
    image: 'https://source.unsplash.com/random/800x800?sig=1',
    title: 'Image 1',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=2',
    title: 'Image 2',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=3',
    title: 'Image 3',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=4',
    title: 'Image 4',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=5',
    title: 'Image 5',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=6',
    title: 'Image 6',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=7',
    title: 'Image 7',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=8',
    title: 'Image 8',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=9',
    title: 'Image 9',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=10',
    title: 'Image 10',
  },
];

export const Home = () => {
  return (
    <div className="py-4 mx-auto">
      <Carousel data={data} />
    </div>
  );
};
