import { Dispatch, Fragment, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounceCallback } from 'usehooks-ts';

type Props = {
  handleSearch: (search: string) => void;
  showRemoveSearch: boolean;
  setRemoveSearch: Dispatch<React.SetStateAction<boolean>>;
  setIsBurgerMenuOpen: Dispatch<React.SetStateAction<boolean>>;
};

export const SearchBar = ({
  handleSearch,
  showRemoveSearch,
  setRemoveSearch,
  setIsBurgerMenuOpen,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('search') && searchParams.get('search') !== '') {
      setRemoveSearch(true);
    } else {
      setRemoveSearch(false);
    }
  }, [searchParams, setRemoveSearch]);

  const inputRef = useRef<HTMLInputElement>(null);

  const debounce = useDebounceCallback((value: string) => {
    setSearchParams((initial) => {
      const nextParams = new URLSearchParams(initial);
      if (value === '') {
        nextParams.delete('search');
      } else {
        nextParams.set('search', value);
      }
      return nextParams;
    });
  }, 250);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('search') || '';
    }
  }, [inputRef, searchParams]);

  return (
    <Fragment>
      {/*
       * One rounded search pill. Icon inset-left, input fills the space,
       * clear-X inset-right. The input carries its OWN focus styling and
       * `shadow-none`/`ring-0` to override @tailwindcss/forms' default blue
       * focus ring — the whole pill glows green on focus via focus-within.
       */}
      <div className="group relative flex items-center w-full h-10 rounded-full border border-gray2-500 dark:border-slate-600 bg-gray2-100 dark:bg-slate-700/60 transition-colors duration-150 focus-within:border-green-500 focus-within:bg-white-500 dark:focus-within:bg-slate-700 focus-within:ring-2 focus-within:ring-green-500/25">
        {/* Magnifier — decorative */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 flex items-center text-brownishGrey-500 group-focus-within:text-green-500 transition-colors"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="peer w-full h-full rounded-full border-0 bg-transparent pl-10 pr-9 text-sm text-black-500 dark:text-white-500 placeholder:text-brownishGrey-500 dark:placeholder:text-white-700 shadow-none ring-0 outline-none focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none"
          placeholder="Search recipes, ingredients…"
          defaultValue={searchParams.get('search') || ''}
          onChange={handleInputChange}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setIsBurgerMenuOpen(false);
              if (e.target instanceof HTMLInputElement) {
                e.target.blur();
              }
            }
          }}
        />

        {/* Clear-X — only when there is a value */}
        {showRemoveSearch && inputRef.current?.value !== '' && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2.5 flex items-center justify-center w-6 h-6 rounded-full text-brownishGrey-600 hover:text-white-500 hover:bg-green-500 transition-colors"
            onClick={() => {
              setSearchParams((initial) => {
                handleSearch('');
                setRemoveSearch(false);
                const nextParams = new URLSearchParams(initial);
                nextParams.delete('search');
                return nextParams;
              });
              if (inputRef.current) inputRef.current.value = '';
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </Fragment>
  );
};
