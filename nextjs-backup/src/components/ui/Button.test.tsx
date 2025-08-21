/**
 * Button component tests
 * Tests the Button UI component functionality and accessibility
 */

import { render, screen, fireEvent } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn')
  })

  it('renders different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-outline')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-sm')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-md')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-lg')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
  })

  it('renders as link when href is provided', () => {
    render(<Button href="/contact">Contact Us</Button>)
    
    const link = screen.getByRole('link', { name: /contact us/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/contact')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    expect(button).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('has proper ARIA attributes', () => {
    render(
      <Button 
        aria-label="Submit form" 
        aria-describedby="help-text"
        disabled
      >
        Submit
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
    expect(button).toHaveAttribute('aria-describedby', 'help-text')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('supports custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn', 'custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    
    render(<Button ref={ref}>Button</Button>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  describe('Accessibility', () => {
    it('has proper role for button', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has proper role for link', () => {
      render(<Button href="/test">Link Button</Button>)
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('is focusable when not disabled', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
    })

    it('is not focusable when disabled', () => {
      render(<Button disabled>Button</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).not.toHaveFocus()
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('hides text when loading and loadingText is not provided', () => {
      render(<Button loading>Submit</Button>)
      
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })

    it('shows custom loading text when provided', () => {
      render(
        <Button loading loadingText="Submitting...">
          Submit
        </Button>
      )
      
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })
  })

  describe('Event Handling', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      
      render(<Button onClick={onClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      
      render(<Button onClick={onClick} disabled>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      
      render(<Button onClick={onClick} loading>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('prevents form submission when type is not submit', () => {
      const handleSubmit = jest.fn()
      
      render(
        <form onSubmit={handleSubmit}>
          <Button type="button">Button</Button>
        </form>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleSubmit).not.toHaveBeenCalled()
    })
  })
})