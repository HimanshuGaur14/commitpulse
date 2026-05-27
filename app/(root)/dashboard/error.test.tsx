// app/(root)/dashboard/error.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardError from './error';

function makeError(message: string): Error {
  const e = new Error(message);
  return e;
}

describe('DashboardError', () => {
  it('shows ⏳ for a rate-limit error', () => {
    render(<DashboardError error={makeError('API limit reached')} reset={() => {}} />);
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  it('shows 🕵️‍♂️ for a not-found error', () => {
    render(<DashboardError error={makeError('User not found')} reset={() => {}} />);
    expect(screen.getByText('🕵️‍♂️')).toBeInTheDocument();
  });

  it('shows ⚠️ for a generic error', () => {
    render(<DashboardError error={makeError('Unexpected failure')} reset={() => {}} />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
