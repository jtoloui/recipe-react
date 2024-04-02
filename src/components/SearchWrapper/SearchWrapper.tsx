import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';

import { useRecipes } from '@/queries';

type Props = {
  children: React.ReactNode;
};

export const SearchWrapper = ({ children }: Props) => {
  const [urlParams, setUrlParams] = useSearchParams();
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

  // Remove search query param when component unmounts
  useLayoutEffect(() => {
    return () => {
      setUrlParams((params) => {
        const nextSearchParams = new URLSearchParams(params);

        nextSearchParams.delete('search');
        console.log(nextSearchParams.toString());

        // params.delete('search');
        return nextSearchParams;
      });
    };
  }, []);

  useEffect(() => {
    if (triggerRefetch) {
      setTriggerRefetch(false);
      searchRecipeRefetch();
    }
  }, [triggerRefetch, searchRecipeRefetch]);

  return <Fragment>{children}</Fragment>;
};
