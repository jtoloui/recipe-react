import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Card } from '@/components/Card';
import { FavouriteButton } from '@/components/FavouriteButton';
import { favouriteKeys } from '@/queries/useFavourites';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const ID = '6ac2957c5840465fb86cfdaa';

const renderWith = (ui: React.ReactNode, initialIds: string[]) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(favouriteKeys.ids, initialIds);
  mockedAxios.get.mockResolvedValue({
    data: { recipeIds: initialIds, recipes: [] },
  });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
  return { client };
};

const heart = () =>
  screen.getByRole('button', { name: 'Favourite “Hash Browns”' });

describe('FavouriteButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('exposes saved state via aria-pressed with a stable label', () => {
    renderWith(<FavouriteButton recipeId={ID} recipeName="Hash Browns" />, [
      ID,
    ]);
    expect(heart()).toHaveAttribute('aria-pressed', 'true');
  });

  it('favourites optimistically with PUT', async () => {
    const { client } = renderWith(
      <FavouriteButton recipeId={ID} recipeName="Hash Browns" />,
      []
    );
    mockedAxios.put.mockImplementation(() => new Promise(() => undefined));

    await userEvent.click(heart());

    expect(heart()).toHaveAttribute('aria-pressed', 'true');
    expect(client.getQueryData(favouriteKeys.ids)).toEqual([ID]);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/api/favourites/${ID}`),
      undefined,
      {
        withCredentials: true,
      }
    );
  });

  it('unfavourites with DELETE', async () => {
    renderWith(<FavouriteButton recipeId={ID} recipeName="Hash Browns" />, [
      ID,
    ]);
    mockedAxios.delete.mockResolvedValue({ data: {} });

    await userEvent.click(heart());

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining(`/api/favourites/${ID}`),
      {
        withCredentials: true,
      }
    );
  });

  it('serialises rapid clicks so requests go out in order', async () => {
    renderWith(<FavouriteButton recipeId={ID} recipeName="Hash Browns" />, []);
    const calls: string[] = [];
    let releasePut: () => void = () => undefined;
    mockedAxios.put.mockImplementation(() => {
      calls.push('PUT');
      return new Promise(
        (resolve) => (releasePut = () => resolve({ data: {} }))
      );
    });
    mockedAxios.delete.mockImplementation(() => {
      calls.push('DELETE');
      return Promise.resolve({ data: {} });
    });

    await userEvent.click(heart());
    await userEvent.click(heart());

    // Second toggle waits for the first to finish.
    expect(calls).toEqual(['PUT']);
    expect(heart()).toHaveAttribute('aria-pressed', 'false');
    releasePut();
    await waitFor(() => expect(calls).toEqual(['PUT', 'DELETE']));
  });

  it('rolls back if the request fails', async () => {
    const { client } = renderWith(
      <FavouriteButton recipeId={ID} recipeName="Hash Browns" />,
      []
    );
    mockedAxios.put.mockRejectedValue(new Error('network'));
    mockedAxios.get.mockResolvedValue({ data: { recipeIds: [] } });

    await userEvent.click(heart());

    await waitFor(() =>
      expect(heart()).toHaveAttribute('aria-pressed', 'false')
    );
    expect(client.getQueryData(favouriteKeys.ids)).toEqual([]);
  });

  it('is rendered beside (not inside) the card link', () => {
    renderWith(
      <Card
        recipeId={ID}
        image=""
        title="Hash Browns"
        to={`/recipe/${ID}`}
        totalTime="25 mins"
        ingredientsCount={5}
      />,
      []
    );
    const link = screen.getByRole('link');
    expect(link).not.toContainElement(heart());
    expect(link).not.toHaveAccessibleName(/favourite/i);
  });
});
