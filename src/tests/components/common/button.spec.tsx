import { render, screen } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import { composeStories } from '@storybook/react';
import * as stories from '@/components/common/BorderdButton/index.stories';

const { Primary } = composeStories(stories);

describe('BorderdButton', () => {
  test('renders correctly', () => {
    render(<Primary />);
    expect(screen.getByText('Button')).toBeTruthy();
  });
});
