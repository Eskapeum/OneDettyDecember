import { render, screen } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../card'

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-white', 'p-6')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Card variant="elevated" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('shadow-md')

    rerender(<Card variant="outlined" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('border-2')

    rerender(<Card variant="ghost" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('border-transparent', 'shadow-none')

    rerender(<Card variant="brand" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('border-[#FFB700]')

    rerender(<Card variant="events" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('border-[#E63946]/20')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Card size="sm" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-4')

    rerender(<Card size="lg" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-8')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Card ref={ref}>Content</Card>)
    expect(ref).toHaveBeenCalled()
  })
})

describe('CardHeader Component', () => {
  it('renders with default classes', () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'pb-4')
  })

  it('applies custom className', () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toHaveClass('custom-header')
  })
})

describe('CardTitle Component', () => {
  it('renders as h3 with correct classes', () => {
    render(<CardTitle>Card Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    expect(title).toHaveTextContent('Card Title')
  })

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    expect(screen.getByRole('heading')).toHaveClass('custom-title')
  })
})

describe('CardDescription Component', () => {
  it('renders with correct classes', () => {
    render(<CardDescription data-testid="description">Description text</CardDescription>)
    const description = screen.getByTestId('description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-sm', 'text-[#737373]')
    expect(description).toHaveTextContent('Description text')
  })

  it('applies custom className', () => {
    render(<CardDescription className="custom-desc" data-testid="description">Desc</CardDescription>)
    expect(screen.getByTestId('description')).toHaveClass('custom-desc')
  })
})

describe('CardContent Component', () => {
  it('renders with default classes', () => {
    render(<CardContent data-testid="content">Content text</CardContent>)
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('pt-0')
    expect(content).toHaveTextContent('Content text')
  })

  it('applies custom className', () => {
    render(<CardContent className="custom-content" data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveClass('custom-content')
  })
})

describe('CardFooter Component', () => {
  it('renders with default classes', () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex', 'items-center', 'pt-4')
    expect(footer).toHaveTextContent('Footer content')
  })

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveClass('custom-footer')
  })
})

describe('Card Component Integration', () => {
  it('renders complete card with all sections', () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>This is a test card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('full-card')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Test Card' })).toBeInTheDocument()
    expect(screen.getByText('This is a test card description')).toBeInTheDocument()
    expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
  })
})
