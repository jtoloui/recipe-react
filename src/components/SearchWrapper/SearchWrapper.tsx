import React, { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';

import { useRecipes } from '@/queries';

type Props = {
  children: React.ReactNode;
};

export const SearchWrapper = ({ children }: Props) => {
  const [urlParams] = useSearchParams();
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [searchValue, setSearchValue] = useState(urlParams.get('search') || '');

  const labels = urlParams.get('label') || '';

  const { refetch: searchRecipeRefetch } = useRecipes(searchValue, labels);

  useEventListener('homeSearch', (e) => {
    setSearchValue(e.detail.search);
    setTriggerRefetch(true);
  });

  useEffect(() => {
    if (triggerRefetch) {
      setTriggerRefetch(false);
      searchRecipeRefetch();
    }
  }, [triggerRefetch, searchRecipeRefetch]);

  return <Fragment>{children}</Fragment>;
};
