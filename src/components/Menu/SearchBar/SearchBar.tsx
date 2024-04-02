import { Dispatch, Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Props = {
  handleSearch: (search: string) => void;
  showRemoveSearch: boolean;
  setRemoveSearch: Dispatch<React.SetStateAction<boolean>>;
};
export const SearchBar = ({
  handleSearch,
  showRemoveSearch,
  setRemoveSearch,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    if (searchParams.has('search')) {
      setRemoveSearch(true);
    } else {
      setRemoveSearch(false);
    }
  }, [searchParams, setRemoveSearch]);

  return (
    <Fragment>
      <button>
        <span
          className="absolute inset-y-0 left-0 flex items-center pl-3"
          onClick={() => handleSearch(search)}
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
        type="text"
        className="text-ellipsis w-full py-1 pl-10 pr-4 text-black-500 dark:text-white-500 dark:placeholder-white-600 placeholder-black-600 bg-white-500  dark:bg-slate-600 border-b border-brownGrey-500 dark:border-white-500 focus:outline-none dark:focus:border-white-500 focus:border-gray-600"
        placeholder="Search Recipe, Profile, or Ingredients"
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchParams((initial) => {
            const nextParams = new URLSearchParams(initial);
            if (e.target.value === '') {
              nextParams.delete('search');
              return nextParams;
            }
            nextParams.set('search', e.target.value);
            return nextParams;
          });
        }}
        value={searchParams.get('search') || ''}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSearch(search);
          }
        }}
      />
      {showRemoveSearch && search !== '' && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => {
            setSearchParams((initial) => {
              initial.delete('search');
              return initial;
            });
            setSearch('');
            handleSearch('');
            setRemoveSearch(false);
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
