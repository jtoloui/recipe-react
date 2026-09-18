import { faLightbulb, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { useWakeLock } from '@/hooks/useWakeLock';
import type { Ingredient } from '@/queries/types';

type CookModeProps = {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  onClose: () => void;
};

/**
 * Full-viewport, in-page focus overlay for cooking — NOT OS fullscreen, so the
 * browser back gesture and multitasking still work. Strips all chrome to just
 * ingredients + large numbered steps, lets you tick steps off as you go, and
 * holds a screen wake lock so a phone/iPad won't sleep mid-recipe.
 */
export const CookMode = ({
  title,
  ingredients,
  steps,
  onClose,
}: CookModeProps) => {
  const { isSupported: wakeSupported } = useWakeLock(true);
  const [done, setDone] = useState<Set<number>>(() => new Set());

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll behind the overlay.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const toggleStep = (index: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });

  return (
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto bg-white-500 dark:bg-slate-800"
      role="dialog"
      aria-modal="true"
      aria-label={`Cook mode: ${title}`}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray2-400 bg-white-500/95 px-5 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-green-600">
            Cook mode
          </p>
          <h1 className="truncate text-xl font-extrabold text-black-500 dark:text-white-500">
            {title}
          </h1>
        </div>
        <button
          onClick={onClose}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white-500 transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/40"
        >
          <FontAwesomeIcon icon={faXmark} />
          Exit
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-6">
        {/* Keep-awake note */}
        {wakeSupported && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-subtleAccent px-3 py-1.5 text-sm font-medium text-green-600 dark:bg-slate-700 dark:text-white-500">
            <FontAwesomeIcon icon={faLightbulb} />
            Screen stays awake while cooking
          </p>
        )}

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
            Ingredients
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ingredients.map((ing, i) => (
              <li
                key={ing._id ?? i}
                className="rounded-lg bg-lightBg-500 px-4 py-3 text-lg text-black-500 dark:bg-slate-700 dark:text-white-500"
              >
                <span className="font-semibold">{ing.item}</span>
                <span className="text-brownishGrey-600 dark:text-white-600">
                  {' '}
                  — {ing.quantity} {ing.measurement}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps — large, tap to mark done */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
            Method — tap a step to mark it done
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => {
              const isDone = done.has(i);
              return (
                <li key={i}>
                  <button
                    onClick={() => toggleStep(i)}
                    className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                      isDone
                        ? 'border-green-500/40 bg-subtleAccent dark:bg-slate-700'
                        : 'border-gray2-400 bg-white-500 hover:border-green-500/40 dark:border-slate-700 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                        isDone
                          ? 'bg-green-500 text-white-500'
                          : 'bg-subtleAccent text-green-600 dark:bg-slate-600 dark:text-white-500'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`pt-1 text-lg leading-relaxed ${
                        isDone
                          ? 'text-brownishGrey-600 line-through dark:text-white-600'
                          : 'text-black-500 dark:text-white-500'
                      }`}
                    >
                      {step}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default CookMode;
