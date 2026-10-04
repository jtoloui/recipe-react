import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from 'framer-motion';
import { useState } from 'react';

import { useFavouriteIds, useToggleFavourite } from '@/queries/useFavourites';

type FavouriteButtonProps = {
  recipeId: string;
  recipeName?: string;
  /** "overlay" floats on images (cards); "inline" sits in page headers. */
  variant?: 'overlay' | 'inline';
  className?: string;
};

const HEART_PATH =
  'M12 21s-6.716-4.35-9.192-8.4C.92 9.512 2.03 5.75 5.6 4.8c2.06-.55 4.03.3 5.25 1.95L12 8.1l1.15-1.35C14.37 5.1 16.34 4.25 18.4 4.8c3.57.95 4.68 4.712 2.792 7.8C18.716 16.65 12 21 12 21Z';

const BURST = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 18,
    y: Math.sin(angle) * 18,
    delay: (i % 2) * 0.03,
  };
});

/**
 * Heart toggle. On click: a spring "pop" + particle burst when saving, a soft
 * shrink when removing. Animations only run in response to the user's click
 * (never on mount or data refresh), honour prefers-reduced-motion, and the
 * state is exposed via aria-pressed with a stable label.
 *
 * Render it as a sibling of any card link (not inside it) — see Card.
 */
export const FavouriteButton = ({
  recipeId,
  recipeName,
  variant = 'overlay',
  className = '',
}: FavouriteButtonProps) => {
  const { data: favouriteIds } = useFavouriteIds();
  const { mutate } = useToggleFavourite(recipeId);
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [burstKey, setBurstKey] = useState(0);

  const isFavourite = favouriteIds?.has(recipeId) ?? false;
  const label = recipeName ? `Favourite “${recipeName}”` : 'Favourite recipe';

  const handleClick = () => {
    const next = !isFavourite;
    mutate({ recipeId, favourite: next });
    if (reduceMotion) return;
    if (next) {
      setBurstKey((key) => key + 1);
      animate(
        scope.current,
        { scale: [1, 1.35, 0.92, 1] },
        { duration: 0.45, ease: 'easeOut' }
      );
    } else {
      animate(
        scope.current,
        { scale: [1, 0.8, 1] },
        { duration: 0.25, ease: 'easeOut' }
      );
    }
  };

  // `relative` anchors the burst; skip it if the caller positions the button,
  // otherwise the two position utilities fight and `relative` wins.
  const position = /\b(absolute|fixed|sticky)\b/.test(className)
    ? ''
    : 'relative';
  const base =
    variant === 'overlay'
      ? 'h-10 w-10 bg-white-500/90 shadow-md backdrop-blur-sm hover:bg-white-500 dark:bg-slate-800/85'
      : 'h-11 w-11 border border-gray2-500 bg-white-500 hover:border-rose-300 dark:border-slate-600 dark:bg-slate-700';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavourite}
      aria-label={label}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`${position} inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 ${base} ${className}`}
    >
      {/* Particle burst + ring, only after a click that saves */}
      <AnimatePresence>
        {!reduceMotion && burstKey > 0 && isFavourite && (
          <motion.span
            key={burstKey}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            exit={{ opacity: 0 }}
          >
            {BURST.map((p, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-rose-500"
                initial={{ x: '-50%', y: '-50%', scale: 0.4, opacity: 1 }}
                animate={{
                  x: `calc(-50% + ${p.x}px)`,
                  y: `calc(-50% + ${p.y}px)`,
                  scale: 1,
                  opacity: 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: p.delay }}
              />
            ))}
            <motion.span
              className="absolute inset-1 rounded-full border-2 border-rose-400"
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </motion.span>
        )}
      </AnimatePresence>

      <svg
        ref={scope}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="relative h-5 w-5"
      >
        <motion.path
          d={HEART_PATH}
          strokeWidth={2}
          strokeLinejoin="round"
          initial={false}
          animate={{
            fill: isFavourite ? '#F43F5E' : 'rgba(244,63,94,0)',
            stroke: isFavourite
              ? '#F43F5E'
              : variant === 'overlay'
              ? '#3D5246'
              : '#6B7C72',
          }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        />
      </svg>
    </motion.button>
  );
};

export default FavouriteButton;
