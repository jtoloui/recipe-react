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
    debounce(value); // Debounce side effects, not the input value update
  };

  useEffect(() => {
    if (inputRef.current) {
      // allows us to use debounce without losing the input value
      inputRef.current.value = searchParams.get('search') || '';
    }
  }, [inputRef, searchParams]);

  return (
    <Fragment>
      <button>
        <span
          className="absolute inset-y-0 left-0 flex items-center pl-3"
          // onClick={() => handleSearch(inputRef.current?.value || '')}
        >
          <svg
            className="w-4 h-4 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-white-500"
            ></path>
          </svg>
        </span>
      </button>

      {/* // Search bar */}
      <input
        ref={inputRef}
        type="text"
        className="text-ellipsis w-full py-1 pl-10 pr-4 text-black-500 dark:text-white-500 dark:placeholder-white-600 placeholder-black-600 bg-white-500  dark:bg-slate-600 border-b border-brownGrey-500 dark:border-white-500 focus:outline-none dark:focus:border-white-500 focus:border-gray-600"
        placeholder="Search Recipe, Profile, or Ingredients"
        defaultValue={searchParams.get('search') || ''}
        onChange={handleInputChange}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            console.log('Enter key pressed');
            setIsBurgerMenuOpen(false);
            //     handleSearch(inputRef.current?.value || '');
            if (e.target instanceof HTMLInputElement) {
              e.target.blur();
            }
          }
        }}
      />
      {showRemoveSearch && inputRef.current?.value !== '' && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => {
            setSearchParams((initial) => {
              handleSearch('');
              setRemoveSearch(false);
              const nextParams = new URLSearchParams(initial);
              nextParams.delete('search');
              return nextParams;
            });
          }}
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      )}
    </Fragment>
  );
};
