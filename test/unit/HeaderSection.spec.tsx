import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { HeaderSection } from '@/pages/RecipeById/components/HeaderSection/HeaderSection';

type Props = ComponentProps<typeof HeaderSection>;

const baseProps = {
  recipeId: 'r1',
  name: 'Hash Browns',
  recipeAuthor: 'Jamie T',
  isAuthor: false,
  difficulty: 'Easy',
  cuisine: 'British',
  vegan: false,
  vegetarian: true,
  timeToCook: { Cook: 10, Prep: 15 },
  description: 'Crispy potato patties',
  visibility: { public: true, private: false, groups: [] },
} as unknown as Props;

const renderHeader = (props: Partial<Props>) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { enabled: false } } })
      }
    >
      <MemoryRouter>
        <HeaderSection {...baseProps} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe('HeaderSection source credit', () => {
  it('links to the source in a new tab', () => {
    renderHeader({
      source: {
        name: 'BBC Food',
        url: 'https://www.bbc.co.uk/food/recipes/hashbrowns_12454',
      },
    });

    const link = screen.getByRole('link', { name: /BBC Food/ });
    expect(link).toHaveAttribute(
      'href',
      'https://www.bbc.co.uk/food/recipes/hashbrowns_12454'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render a link for unsafe URLs', () => {
    renderHeader({ source: { name: 'Bad', url: 'javascript:alert(1)' } });

    expect(screen.queryByText(/Recipe source/)).not.toBeInTheDocument();
  });

  it('renders nothing when there is no source', () => {
    renderHeader({ source: null });

    expect(screen.queryByText(/Recipe source/)).not.toBeInTheDocument();
  });
});
