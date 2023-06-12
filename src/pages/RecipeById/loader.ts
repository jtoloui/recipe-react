import { type QueryClient } from 'react-query';
import { type LoaderFunctionArgs } from 'react-router-dom';

import { fetchRecipeByIdQuery } from '@/queries';
import { type RecipeByIdResponse } from '@/queries/types';

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = fetchRecipeByIdQuery(params?.recipeId || '');
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData<RecipeByIdResponse>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

// export const loader =
//   (queryClient: QueryClient) =>
//   ({ params }: LoaderFunctionArgs) =>
//     queryClient.fetchQuery({
//       ...fetchRecipeByIdQuery(params.recipeId || ''),
//       staleTime: 1000 * 60 * 2,
//     });
