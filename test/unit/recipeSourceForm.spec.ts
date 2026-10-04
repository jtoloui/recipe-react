import { describe, expect, it } from 'vitest';

import {
  type CreateRecipeFormData,
  createRecipeFormSchema,
  toRecipePayload,
} from '@/Forms/CreateRecipe/schema';

const image = new File(['x'], 'hash.jpg', { type: 'image/jpeg' });

const base = {
  recipeName: 'Hash Browns',
  recipeDescription: 'Crispy potato patties',
  vegetarian: true,
  vegan: false,
  difficulty: 'Easy',
  cuisine: 'British',
  prepTime: 15,
  cookTime: 10,
  steps: [{ step: 'Grate.' }],
  ingredients: [{ item: 'Potatoes', measurement: 'medium', quantity: 0.5 }],
  labels: ['Breakfast'],
  portionSize: 4,
  image,
  visibility: 'public',
} as const;

const issuesFor = (data: object) => {
  const result = createRecipeFormSchema.safeParse({ ...base, ...data });
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
};

describe('recipe source form validation', () => {
  it('accepts no source at all', () => {
    expect(issuesFor({ sourceName: '', sourceUrl: '' })).toEqual([]);
  });

  it('accepts a name with an https link (and decimal quantities)', () => {
    expect(issuesFor({ sourceName: 'BBC Food', sourceUrl: 'https://www.bbc.co.uk/food' })).toEqual([]);
  });

  it('requires both fields once either is filled', () => {
    expect(issuesFor({ sourceName: 'BBC Food' })).toEqual(['sourceUrl']);
    expect(issuesFor({ sourceUrl: 'https://www.bbc.co.uk/food' })).toEqual(['sourceName']);
  });

  it('rejects non-http links', () => {
    expect(issuesFor({ sourceName: 'Bad', sourceUrl: 'javascript:alert(1)' })).toEqual(['sourceUrl']);
    expect(issuesFor({ sourceName: 'Bad', sourceUrl: 'bbc.co.uk' })).toEqual(['sourceUrl']);
  });
});

describe('toRecipePayload', () => {
  const form = base as unknown as CreateRecipeFormData;

  it('maps the flat fields to a trimmed source object', () => {
    const payload = toRecipePayload({ ...form, sourceName: ' BBC Food ', sourceUrl: ' https://www.bbc.co.uk/food ' });

    expect(payload.source).toEqual({ name: 'BBC Food', url: 'https://www.bbc.co.uk/food' });
    expect(payload).not.toHaveProperty('sourceName');
    expect(payload).not.toHaveProperty('sourceUrl');
  });

  it('sends null when cleared so the credit is removed', () => {
    expect(toRecipePayload({ ...form, sourceName: '', sourceUrl: '' }).source).toBeNull();
  });
});
