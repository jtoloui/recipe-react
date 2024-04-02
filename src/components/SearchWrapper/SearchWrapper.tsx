import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';

import { useMyRecipes, useRecipes } from '@/queries';

type Props = {
  children: React.ReactNode;
};

export const SearchWrapper = ({ children }: Props) => {
  const [urlParams] = useSearchParams();
  const [triggerRefetch, setTriggerRefetch] = useState(true);
  const [searchValue, setSearchValue] = useState(urlParams.get('search') || '');
  const [label, setLabel] = useState(urlParams.get('label') || '');
  const { pathname } = useLocation();

  const { refetch: searchRecipeRefetch } = useRecipes(
    false,
    searchValue,
    label
  );
  const { refetch: searchMyRecipeRefetch } = useMyRecipes(
    false,
    searchValue,
    label
  );

  useEventListener('homeSearch', (e) => {
    setSearchValue(e.detail.search);
    setLabel(e.detail.label);
    setTriggerRefetch(true);
  });

  useEffect(() => {
    if (pathname) {
      setTriggerRefetch(true);
      setSearchValue('');
      setLabel('');
    }
  }, [pathname]);

  // TODO: Refactor this
  const decideWithRefetch = useCallback(() => {
    switch (pathname) {
      case '/':
        searchRecipeRefetch();
        break;
      case '/my-recipes':
        searchMyRecipeRefetch();
        break;

      default:
        break;
    }
  }, [pathname, searchMyRecipeRefetch, searchRecipeRefetch]);

  useEffect(() => {
    if (triggerRefetch) {
      setTriggerRefetch(false);
      decideWithRefetch();
    }
  }, [triggerRefetch, decideWithRefetch]);

  return <Fragment>{children}</Fragment>;
};
