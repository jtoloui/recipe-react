import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';

import { useRecipes } from '@/queries';

type Props = {
  children: React.ReactNode;
};

export const SearchWrapper = ({ children }: Props) => {
  const [urlParams] = useSearchParams();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const search = urlParams.get('search') || '';
  const labels = urlParams.get('label') || '';

  const location = useLocation();

  const { refetch: searchRecipeRefetch } = useRecipes(search, labels);

  useEventListener('homeSearch', () => {
    if (location.pathname === '/') {
      setTriggerRefetch(true);
    }
  });

  useEffect(() => {
    if (triggerRefetch) {
      setTriggerRefetch(false);
      searchRecipeRefetch();
    }
  }, [triggerRefetch, searchRecipeRefetch]);

  return <Fragment>{children}</Fragment>;
};
