import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { CarouselProps } from '.';
import { Card } from './Card';

export const Carousel = ({ data, onCardClick }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(6); // default value
  const [selected, setSelected] = useState(0); // Add this line

  const size = useWindowSize();

  const centerCard = (index: number) => {
    setSelected(index); // Add this line
    // unsure about centering the card
    // let newIndex = index - Math.floor(cardsToShow / 2);

    // if (newIndex < 0) {
    //   newIndex = 0;
    // }

    // if (newIndex > data.length - cardsToShow) {
    //   newIndex = data.length - cardsToShow;
    // }

    // setCurrent(newIndex);
  };

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    if (size.width <= 640) {
      setCardsToShow(2);
    }
    if (size.width >= 768) {
      setCardsToShow(4);
    }
    if (size.width >= 1024) {
      setCardsToShow(6);
    }
  }, [size.width]);

  // display: flex;
  //  flex-wrap: nowrap;
  //  overflow-x: auto;
  return (
    <div
      className={`relative w-full sm:overflow-x-hidden z-10 ${
        size.width <= 640 ? 'flex flex-nowrap overflow-x-auto' : ''
      }`}
    >
      {current > 0 && size.width > 640 && (
        <button
          onClick={() => setCurrent((old) => old - 1)}
          className="absolute left-[-2rem] md:left-0 top-1/2 transform -translate-y-1/2 z-50 p-2"
          aria-label="Carousel left arrow"
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
              className="stroke-charcoal-500 dark:stroke-white-500"
            />

            {/* // if the selected card is not the first card and not in view, show the green line */}
            {selected > 0 && selected < current && (
              <line
                x1="4"
                y1="1"
                x2="20"
                y2="1"
                className="stroke-green-500"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* // if the selected card is the first card and not in view, show the green line */}
            {selected === 0 &&
              current > 0 &&
              current + cardsToShow <= data.length && (
                <line
                  x1="4"
                  y1="1"
                  x2="20"
                  y2="1"
                  className="stroke-green-500"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
          </svg>
        </button>
      )}
      <div className="relative py-4">
        <motion.div
          className="flex space-x-4"
          // initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          {data.map((card, index) => (
            <Card
              key={`${card.title}-${index}`}
              image={card.image}
              title={`${card.title} (${card.count})`}
              onClick={() => {
                centerCard(index);
                onCardClick(card.title);
              }}
              isSelected={index === selected}
              offset={index - current}
              cardsToShow={cardsToShow}
            />
          ))}
        </motion.div>
        {/* // if selected is the current card, don't show the gradient or else show the gradient */}
        {size.width > 640 && (
          <>
            <div
              className={
                current === 0 && selected === 0
                  ? ''
                  : 'absolute inset-y-0 left-[-2rem] md:left-0 w-48 bg-gradient-to-r from-lightBg-500 dark:from-slate-500 to-transparent'
              }
              style={{ pointerEvents: 'none' }}
            ></div>
            <div
              className={
                selected === data.length - 1 &&
                current === data.length - cardsToShow
                  ? ''
                  : 'absolute inset-y-0 right-[-2rem] md:right-0 w-48 bg-gradient-to-l from-lightBg-500 dark:from-slate-500 to-transparent'
              }
              style={{ pointerEvents: 'none' }}
            ></div>
          </>
        )}
      </div>
      {size.width > 640 && (
        <button
          onClick={() =>
            current < data.length - cardsToShow
              ? setCurrent((old) => old + 1)
              : setCurrent(0)
          }
          className="absolute right-[-2rem] md:right-0 top-1/2 transform -translate-y-1/2 z-50 p-2"
          aria-label="Carousel right arrow"
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
              className="stroke-charcoal-500 dark:stroke-white-500"
            />

            {/* // if the selected card is or is not the last card and not in view, show the green line */}
            {selected !== data.length + 1 &&
              selected >= current + cardsToShow && (
                <line
                  x1="4"
                  y1="23"
                  x2="20"
                  y2="23"
                  className="stroke-green-500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  onClick={() => centerCard(selected)}
                />
              )}
          </svg>
        </button>
      )}
    </div>
  );
};
