import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { VisualizationTooltip } from './VisualizationTooltip';

// Mock data to provide consistent states for testing
const mockProps = {
  id: 'test-tooltip',
  title: 'Quarterly Revenue',
  description: 'Showing a 15% increase compared to last quarter.',
  coordinateX: '120px',
  coordinateY: '250px',
  isVisible: true,
};

describe('VisualizationTooltip - Accessibility & ARIA Compliance', () => {
  // 1. Inspect markup for correct accessible labels and roles
  it('should have correct ARIA roles and accessibility labeling attributes', () => {
    render(<VisualizationTooltip x={0} y={0} {...mockProps} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('id', mockProps.id);
    expect(tooltip).toHaveAttribute('aria-labelledby', `${mockProps.id}-title`);
    expect(tooltip).toHaveAttribute('aria-describedby', `${mockProps.id}-description`);
  });

  // 2. Assert elements that accept focus maintain visible outline behaviors
  it('should maintain focus visible outline styling on interactive child elements', async () => {
    render(
      <VisualizationTooltip x={0} y={0} {...mockProps}>
        <button id="tooltip-action-btn">View Details</button>
      </VisualizationTooltip>
    );

    const button = screen.getByRole('button', { name: /view details/i });

    // Simulate user tabbing to the element
    await userEvent.tab();
    expect(button).toHaveFocus();

    // Assert compliance with visible focus styles (usually checking a utility class or computed style)
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-visible');
  });

  // 3. Verify tooltip labels are announced with correct accessibility descriptions
  // 3. Verify tooltip labels are announced with correct accessibility descriptions
  it('should announce correct text content matching accessible descriptions', () => {
    // Destructure container to access native DOM selectors safely
    const { container } = render(<VisualizationTooltip x={0} y={0} {...mockProps} />);

    // Use standard querySelector to grab elements by exact HTML id attributes
    const titleElement = container.querySelector(`#${mockProps.id}-title`);
    const descElement = container.querySelector(`#${mockProps.id}-description`);

    expect(titleElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();

    expect(titleElement).toHaveTextContent(mockProps.title);
    expect(descElement).toHaveTextContent(mockProps.description);
  });

  // 4. Test keyboard control path selectors to ensure normal tab ordering
  it('should respect a logical, predictable keyboard tab navigation order', async () => {
    render(
      <div>
        <button id="before-btn">Previous Element</button>
        <VisualizationTooltip x={0} y={0} {...mockProps}>
          <button id="inside-btn-1">Action 1</button>
          <button id="inside-btn-2">Action 2</button>
        </VisualizationTooltip>
        <button id="after-btn">Next Element</button>
      </div>
    );

    const beforeBtn = screen.getByRole('button', { name: /previous element/i });
    const insideBtn1 = screen.getByRole('button', { name: /action 1/i });
    const insideBtn2 = screen.getByRole('button', { name: /action 2/i });
    const afterBtn = screen.getByRole('button', { name: /next element/i });

    // Step through the elements via tab sequence
    await userEvent.tab();
    expect(beforeBtn).toHaveFocus();

    await userEvent.tab();
    expect(insideBtn1).toHaveFocus();

    await userEvent.tab();
    expect(insideBtn2).toHaveFocus();

    await userEvent.tab();
    expect(afterBtn).toHaveFocus();
  });

  // 5. Confirm standard headings exist in the correct logical hierarchical order
  it('should contain headings that strictly follow a logical DOM hierarchy', () => {
    render(<VisualizationTooltip x={0} y={0} {...mockProps} />);

    // Tooltip header elements shouldn't skip levels (e.g., jumping straight to H4)
    const titleHeading = screen.getByRole('heading', { level: 3 });
    expect(titleHeading).toBeInTheDocument();
    expect(titleHeading).toHaveAttribute('id', `${mockProps.id}-title`);
  });
});
