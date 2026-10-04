import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Image, LogoLoader } from '@/components/Elements';

export type LabelCarouselItem = {
  title: string;
  count: number;
  image?: string;
};

type LabelCarouselProps = {
  data: LabelCarouselItem[];
  /** Title of the selected label (e.g. "All"). */
  selected: string;
  onSelect: (title: string) => void;
  /** Accessible name for the group of label buttons. */
  ariaLabel?: string;
};

/** Copy index that holds the real, accessible tiles; 0 and 2 are visual clones. */
const REAL = 1;

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
    />
  </svg>
);

/**
 * Label filter carousel with a seamless circular loop.
 *
 * It is a native horizontally scrolling row (trackpad, touch, wheel and
 * scroll-snap behave as users expect). When the labels overflow, the set is
 * rendered three times and, once scrolling settles, the position silently
 * jumps by exactly one set width — so the row never ends in either direction.
 * Only the middle copy is exposed to assistive tech and the tab order; the
 * clones are presentational but still clickable.
 *
 * Labels with no matching recipes stay visible but are disabled, so the row
 * doesn't jump around as the search changes.
 */
export const LabelCarousel = ({
  data,
  selected,
  onSelect,
  ariaLabel = 'Filter by label',
}: LabelCarouselProps) => {
  const scroller = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const setStarts = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [loop, setLoop] = useState(false);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  /** Width of one full set of tiles, including the gap after it. */
  const setWidth = useCallback(() => {
    const [first, second] = setStarts.current;
    return first && second ? second.offsetLeft - first.offsetLeft : 0;
  }, []);

  /** Instantly shift the scroll position without snapping or animating. */
  const jumpBy = useCallback((delta: number) => {
    const el = scroller.current;
    if (!el || delta === 0) return;
    const previousSnap = el.style.scrollSnapType;
    el.style.scrollSnapType = 'none';
    el.scrollLeft += delta;
    requestAnimationFrame(() => {
      el.style.scrollSnapType = previousSnap;
    });
  }, []);

  /** Keep the viewport inside the middle copy after scrolling settles. */
  const recentre = useCallback(() => {
    const el = scroller.current;
    const width = setWidth();
    if (!loop || !el || width <= 0) return;
    if (el.scrollLeft < width * 0.5) jumpBy(width);
    else if (el.scrollLeft > width * 1.5) jumpBy(-width);
  }, [loop, setWidth, jumpBy]);

  // Decide whether to loop: only when one set is wider than the viewport.
  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const single = loop ? setWidth() : el.scrollWidth;
    const shouldLoop = data.length > 1 && single > el.clientWidth + 8;
    if (shouldLoop !== loop) setLoop(shouldLoop);
    setCanScroll(
      shouldLoop
        ? { left: true, right: true }
        : {
            left: el.scrollLeft > 4,
            right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
          }
    );
  }, [data.length, loop, setWidth]);

  // Entering loop mode: start at the beginning of the real (middle) copy.
  useLayoutEffect(() => {
    const el = scroller.current;
    const start = setStarts.current[REAL];
    if (loop && el && start) {
      const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      jumpBy(start.offsetLeft - padding - el.scrollLeft);
    }
  }, [loop, jumpBy]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    let settle: ReturnType<typeof setTimeout> | undefined;
    const supportsScrollEnd = 'onscrollend' in window;
    const onScroll = () => {
      measure();
      if (!supportsScrollEnd) {
        clearTimeout(settle);
        settle = setTimeout(recentre, 140);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    if (supportsScrollEnd) el.addEventListener('scrollend', recentre);
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(el);
    return () => {
      clearTimeout(settle);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', recentre);
      observer?.disconnect();
    };
  }, [measure, recentre]);

  // Keep the selected label in view (e.g. when restored from the URL).
  useEffect(() => {
    itemRefs.current.get(selected)?.scrollIntoView?.({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [selected, reduceMotion, data.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const enabled = data.filter(
    (item) => item.count > 0 || item.title === selected
  );

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    title: string
  ) => {
    const index = enabled.findIndex((item) => item.title === title);
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: enabled.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    // Wraps around at both ends, matching the circular row.
    const next = enabled[(moves[event.key] + enabled.length) % enabled.length];
    if (!next) return;
    onSelect(next.title);
    itemRefs.current.get(next.title)?.focus();
  };

  if (data.length === 0) return null;

  const copies = loop ? [0, REAL, 2] : [REAL];

  return (
    <div className="relative -mx-1">
      <div
        ref={scroller}
        role="radiogroup"
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {copies.map((copy) =>
          data.map((item, index) => {
            const isReal = copy === REAL;
            const isSelected = item.title === selected;
            const isDisabled = item.count === 0 && !isSelected;
            return (
              <button
                key={`${copy}-${item.title}`}
                ref={(node) => {
                  if (index === 0) setStarts.current[copy] = node;
                  if (!isReal) return;
                  if (node) itemRefs.current.set(item.title, node);
                  else itemRefs.current.delete(item.title);
                }}
                type="button"
                role={isReal ? 'radio' : undefined}
                aria-checked={isReal ? isSelected : undefined}
                aria-hidden={isReal ? undefined : true}
                aria-label={
                  isReal
                    ? `${item.title}, ${item.count} ${
                        item.count === 1 ? 'recipe' : 'recipes'
                      }`
                    : undefined
                }
                disabled={isDisabled}
                tabIndex={isReal && isSelected ? 0 : -1}
                // Clones never take focus (they're hidden from assistive tech).
                onMouseDown={
                  isReal ? undefined : (event) => event.preventDefault()
                }
                onClick={() => {
                  // Clicking a clone: hop to its real twin at the same spot on
                  // screen first, so the selection lives in the real copy.
                  if (!isReal) jumpBy((REAL - copy) * setWidth());
                  onSelect(item.title);
                }}
                onKeyDown={
                  isReal
                    ? (event) => handleKeyDown(event, item.title)
                    : undefined
                }
                className={`group relative h-28 w-40 shrink-0 snap-start overflow-hidden rounded-2xl text-left transition-[opacity,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 sm:h-32 sm:w-48 ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-40 grayscale'
                    : 'hover:-translate-y-0.5'
                }`}
              >
                <span className="absolute inset-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      placeholder={<LogoLoader size={40} />}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-subtleAccent to-green-500/30">
                      <LogoLoader size={40} />
                    </span>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span className="absolute inset-x-3 bottom-2.5 flex items-end justify-between gap-2">
                  <span className="truncate text-sm font-bold text-white-500 drop-shadow">
                    {item.title}
                  </span>
                  <motion.span
                    key={item.count}
                    initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                      isSelected
                        ? 'bg-green-500 text-white-500'
                        : 'bg-white-500/90 text-black-500'
                    }`}
                  >
                    {item.count}
                  </motion.span>
                </span>
                {isSelected &&
                  (isReal ? (
                    <motion.span
                      layoutId="label-carousel-selected"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl ring-[3px] ring-inset ring-green-500"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 450, damping: 36 }
                      }
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl ring-[3px] ring-inset ring-green-500"
                    />
                  ))}
              </button>
            );
          })
        )}
      </div>

      {/* Edge fades + arrows (always both when looping) */}
      <AnimatePresence>
        {canScroll.left && (
          <motion.div
            key="left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center bg-gradient-to-r from-lightBg-500 to-transparent dark:from-slate-500"
          >
            <button
              type="button"
              aria-label="Scroll labels left"
              onClick={() => scrollByPage(-1)}
              className="pointer-events-auto ml-1 hidden h-9 w-9 items-center justify-center rounded-full bg-white-500 text-black-500 shadow-md transition-colors hover:bg-subtleAccent sm:flex dark:bg-slate-700 dark:text-white-500"
            >
              <ArrowIcon direction="left" />
            </button>
          </motion.div>
        )}
        {canScroll.right && (
          <motion.div
            key="right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-center justify-end bg-gradient-to-l from-lightBg-500 to-transparent dark:from-slate-500"
          >
            <button
              type="button"
              aria-label="Scroll labels right"
              onClick={() => scrollByPage(1)}
              className="pointer-events-auto mr-1 hidden h-9 w-9 items-center justify-center rounded-full bg-white-500 text-black-500 shadow-md transition-colors hover:bg-subtleAccent sm:flex dark:bg-slate-700 dark:text-white-500"
            >
              <ArrowIcon direction="right" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabelCarousel;
