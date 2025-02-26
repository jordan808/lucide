import { describe, it, expect } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react'
import { Pen, Edit2, Grid, LucideProps, Droplet } from '../src/lucide-react';
import { Suspense, lazy } from 'react';
import dynamicIconImports from '../src/dynamicIconImports';

describe('Using lucide icon components', () => {
  it('should render an component', () => {
    const { container } = render( <Grid/> );

    expect( container.innerHTML ).toMatchSnapshot();
  });

  it('should adjust the size, stroke color and stroke width', () => {
    const testId = 'grid-icon';
    const { container, getByTestId } = render(
      <Grid
        data-testid={testId}
        size={48}
        stroke="red"
        strokeWidth={4}
      />,
    );

    const { attributes } = getByTestId(testId) as unknown as{ attributes: Record<string, { value: string }>};
    expect(attributes.stroke.value).toBe('red');
    expect(attributes.width.value).toBe('48');
    expect(attributes.height.value).toBe('48');
    expect(attributes['stroke-width'].value).toBe('4');

    expect( container.innerHTML ).toMatchSnapshot();
  });

  it('should render the alias icon', () => {
    const { container } = render(
      <Pen
        size={48}
        stroke="red"
        strokeWidth={4}
      />,
    );

    const PenIconRenderedHTML = container.innerHTML

    cleanup()

    const { container: Edit2Container } = render(
      <Edit2
        size={48}
        stroke="red"
        strokeWidth={4}
      />,
    );

    expect(PenIconRenderedHTML).toBe(Edit2Container.innerHTML)
  });


  it('should not scale the strokeWidth when absoluteStrokeWidth is set', () => {
    const testId = 'grid-icon';
    const { container, getByTestId } = render(
      <Grid
        data-testid={testId}
        size={48}
        stroke="red"
        absoluteStrokeWidth
      />,
    );

    const { attributes } = getByTestId(testId) as unknown as{ attributes: Record<string, { value: string }>};
    expect(attributes.stroke.value).toBe('red');
    expect(attributes.width.value).toBe('48');
    expect(attributes.height.value).toBe('48');
    expect(attributes['stroke-width'].value).toBe('1');

    expect( container.innerHTML ).toMatchSnapshot();
  });

  it('should apply all classNames to the element', () => {
    const testClass = 'my-class';
    const { container } = render(
      <Droplet className={testClass} />,
    );

    expect(container.firstChild).toHaveClass(testClass);
    expect(container.firstChild).toHaveClass('lucide');
    expect(container.firstChild).toHaveClass('lucide-droplet');
  });

  it('should render icons dynamically by using the dynamicIconImports module', async () => {
    interface IconProps extends Omit<LucideProps, 'ref'> {
      name: keyof typeof dynamicIconImports;
    }

    const Icon = ({ name, ...props }: IconProps) => {
      const LucideIcon = lazy(dynamicIconImports[name]);

      return (
        <Suspense fallback={null}>
          <LucideIcon {...props} />
        </Suspense>
      );
    }

    const { container, getByLabelText } = render(
      <Icon
        aria-label="smile"
        name="smile"
        size={48}
        stroke="red"
        absoluteStrokeWidth
      />,
    );

    await waitFor(() => getByLabelText('smile'))

    expect( container.innerHTML ).toMatchSnapshot();

  });
})
