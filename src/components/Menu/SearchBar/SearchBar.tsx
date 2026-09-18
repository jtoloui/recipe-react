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
    const value = e.target.value;
    debounce(value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('search') || '';
    }
  }, [inputRef, searchParams]);

  return (
    <Fragment>
      {/*
       * One contained pill: border + bg container, magnifier icon inset-left,
       * input fills the space, clear-X inset-right. No stray bare <button>.
       */}
      <div className="relative flex items-center w-full rounded-lg border border-brownishGrey-300 dark:border-slate-500 bg-white-500 dark:bg-slate-700 shadow-sm focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
        {/* Magnifier — purely decorative, not a button */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 flex items-center"
        >
          <svg
            className="w-4 h-4 text-brownishGrey-600 dark:text-white-700"
            viewBox="0 0 24 24"
            fill="none"
          >
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
          className="w-full py-2 pl-9 pr-9 text-sm text-black-500 dark:text-white-500 placeholder:text-brownishGrey-500 dark:placeholder:text-white-700 bg-transparent focus:outline-none"
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

        {/* Clear-X — only shown when there is a search value */}
        {showRemoveSearch && inputRef.current?.value !== '' && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2 flex items-center justify-center w-5 h-5 rounded-full text-brownishGrey-600 hover:text-white-500 hover:bg-green-500 transition-colors"
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
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24">
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
