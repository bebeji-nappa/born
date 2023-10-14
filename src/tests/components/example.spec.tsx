import { render, screen } from '@testing-library/react';
import SignInTemplate from '@/components/templates/SignIn';

describe('SignInTemplate', () => {
  test('renders correctly', () => {
    render(<SignInTemplate />);
    expect(screen.getByText('Sign in of GitHub')).toBeTruthy();
  });
});
