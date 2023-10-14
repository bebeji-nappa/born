import { render, screen } from '@testing-library/react';
import SignInTemplate from '@/components/templates/SignIn';
import { describe, test, expect } from '@jest/globals';

describe('SignInTemplate', () => {
  test('renders correctly', () => {
    render(<SignInTemplate />);
    expect(screen.getByText('Sign in of GitHub')).toBeTruthy();
  });
});
