import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LabelCarousel } from '@/components/LabelCarousel';

const data = [
  { title: 'All', count: 5 },
  { title: 'Asian', count: 2 },
  { title: 'Breakfast', count: 0 },
  { title: 'Chicken', count: 3 },
];

const setup = (selected = 'All') => {
  const onSelect = vi.fn();
  render(<LabelCarousel data={data} selected={selected} onSelect={onSelect} />);
  return { onSelect };
};

describe('LabelCarousel', () => {
  it('renders an accessible radio group with counts', () => {
    setup();
    expect(
      screen.getByRole('radiogroup', { name: 'Filter by label' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'All, 5 recipes' })
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: 'Asian, 2 recipes' })
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('disables labels with no matching recipes', async () => {
    const { onSelect } = setup();
    const empty = screen.getByRole('radio', { name: 'Breakfast, 0 recipes' });
    expect(empty).toBeDisabled();
    await userEvent.click(empty);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('selects a label on click', async () => {
    const { onSelect } = setup();
    await userEvent.click(
      screen.getByRole('radio', { name: 'Chicken, 3 recipes' })
    );
    expect(onSelect).toHaveBeenCalledWith('Chicken');
  });

  it('moves with arrow keys, skipping disabled labels', async () => {
    const { onSelect } = setup('Asian');
    screen.getByRole('radio', { name: 'Asian, 2 recipes' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSelect).toHaveBeenLastCalledWith('Chicken');
  });

  it('wraps around at the ends with arrow keys', async () => {
    const { onSelect } = setup('Chicken');
    screen.getByRole('radio', { name: 'Chicken, 3 recipes' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSelect).toHaveBeenLastCalledWith('All');
  });

  it('keeps only the selected label in the tab order', () => {
    setup('Asian');
    expect(
      screen.getByRole('radio', { name: 'Asian, 2 recipes' })
    ).toHaveAttribute('tabindex', '0');
    expect(
      screen.getByRole('radio', { name: 'All, 5 recipes' })
    ).toHaveAttribute('tabindex', '-1');
  });
});
