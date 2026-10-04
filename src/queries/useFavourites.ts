import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { apiUrl } from '@/utils';

import type { RecipesResponse } from './types';

export type FavouriteRecipe = RecipesResponse['recipes'][number];

export const favouriteKeys = {
  all: ['favourites'] as const,
  ids: ['favourites', 'ids'] as const,
  recipes: ['favourites', 'recipes'] as const,
};

const MUTATION_KEY = ['favourites', 'toggle'] as const;

export const fetchFavouriteIds = async (): Promise<string[]> => {
  const { data } = await axios.get<{ recipeIds: string[] }>(
    apiUrl('/api/favourites'),
    {
      withCredentials: true,
    }
  );
  return data.recipeIds;
};

export const fetchFavouriteRecipes = async (): Promise<FavouriteRecipe[]> => {
  const { data } = await axios.get<{ recipes: FavouriteRecipe[] }>(
    apiUrl('/api/favourites/recipes'),
    {
      withCredentials: true,
    }
  );
  return data.recipes;
};

/** Set of favourited recipe ids — one cached request shared by every heart. */
export const useFavouriteIds = () =>
  useQuery({
    queryKey: favouriteKeys.ids,
    queryFn: fetchFavouriteIds,
    select: (ids) => new Set(ids),
    staleTime: 60_000,
  });

export const useFavouriteRecipes = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: favouriteKeys.recipes,
    queryFn: async () => {
      const recipes = await fetchFavouriteRecipes();
      // Seed the ids cache so hearts on this page render filled immediately
      // (unless a toggle is in flight, which owns the optimistic state).
      if (!queryClient.isMutating({ mutationKey: MUTATION_KEY })) {
        queryClient.setQueryData<string[]>(
          favouriteKeys.ids,
          (ids) => ids ?? recipes.map((r) => r._id)
        );
      }
      return recipes;
    },
  });
};

type ToggleVars = { recipeId: string; favourite: boolean };

/**
 * Optimistic toggle. Requests for the same recipe run one at a time, in click
 * order (mutation `scope`), so rapid double-clicks can't leave the server out
 * of sync. Caches are only refetched once the last toggle has settled, so an
 * earlier response never overwrites a newer optimistic state.
 */
export const useToggleFavourite = (recipeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY,
    scope: { id: `favourite-${recipeId}` },
    mutationFn: async ({ recipeId: id, favourite }: ToggleVars) => {
      const url = apiUrl(`/api/favourites/${id}`);
      if (favourite) await axios.put(url, undefined, { withCredentials: true });
      else await axios.delete(url, { withCredentials: true });
    },
    onMutate: async ({ recipeId: id, favourite }) => {
      await queryClient.cancelQueries({ queryKey: favouriteKeys.ids });
      const previous = queryClient.getQueryData<string[]>(favouriteKeys.ids);
      queryClient.setQueryData<string[]>(favouriteKeys.ids, (ids = []) =>
        favourite
          ? [id, ...ids.filter((x) => x !== id)]
          : ids.filter((x) => x !== id)
      );
      if (!favourite) {
        queryClient.setQueryData<FavouriteRecipe[]>(
          favouriteKeys.recipes,
          (recipes) => recipes?.filter((recipe) => recipe._id !== id)
        );
      }
      return { previous, favourite };
    },
    onError: (_error, { recipeId: id }, context) => {
      // Undo only this toggle, leaving any other recipe's optimistic state intact.
      queryClient.setQueryData<string[]>(favouriteKeys.ids, (ids = []) => {
        const wasFavourite =
          context?.previous?.includes(id) ?? !context?.favourite;
        const without = ids.filter((x) => x !== id);
        return wasFavourite ? [id, ...without] : without;
      });
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: MUTATION_KEY }) === 1) {
        queryClient.invalidateQueries({ queryKey: favouriteKeys.all });
      }
    },
  });
};
