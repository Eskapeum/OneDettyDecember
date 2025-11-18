# OneDettyDecember Component Library

> Modern, accessible UI components for the OneDettyDecember marketplace platform

## 🎨 Design System

### Foundation
- **Framework**: React 19 + Next.js 14
- **Styling**: Tailwind CSS v3 + Custom vertical themes
- **Base Library**: Flowbite components (customized)
- **Accessibility**: WCAG AA+ compliance
- **Responsive**: Mobile-first design

### Design Principles
1. **Vertical-First**: Every component supports marketplace vertical theming
2. **Accessible by Default**: ARIA labels, keyboard navigation, screen reader support
3. **Performance**: Optimized for Core Web Vitals
4. **Developer Experience**: Clear props, TypeScript support, comprehensive documentation

---

## 🌈 Vertical Themes

All components support 6 marketplace verticals with unique color schemes:

| Vertical | Color | Hex | Usage |
|----------|-------|-----|-------|
| **Stays** | Coastal Emerald | `#2A9D8F` | Accommodations, hotels, Airbnbs |
| **Events** | Afrobeat Red | `#E63946` | Concerts, parties, nightlife |
| **Experiences** | Festival Orange | `#FB8500` | Tours, activities, adventures |
| **Cars** | Atlantic Blue | `#003566` | Car rentals, transfers |
| **Marketplace** | Highlife Purple | `#7209B7` | Products, merch, items |
| **Community** | Danfo Yellow | `#FFD60A` | Forums, groups, social |

### Theme Usage

```tsx
import { Button } from '@/components/ui/button'

// Vertical theming via props
<Button vertical="events">Book Event</Button>
<Button vertical="stays">Reserve Stay</Button>
<Button vertical="experiences">Book Experience</Button>
```

---

## 📦 Foundation Components (Sprint 0)

### Form Components
1. **Button** - Primary, secondary, ghost, outline variants
2. **Input** - Text, email, password with validation states
3. **Select** - Dropdown with search capability
4. **Checkbox** - Single and group selections
5. **Radio** - Radio button groups
6. **Toggle** - Switch component for boolean states
7. **Textarea** - Multi-line text input with character counter

### Data Display
8. **Card** - Content containers with vertical theming
9. **Badge** - Status indicators and tags
10. **Avatar** - User profile images with fallbacks

### Feedback
11. **Toast** - Notification system
12. **Alert** - Contextual messages
13. **Modal** - Dialog overlays
14. **Loading** - Spinners and skeleton screens

### Navigation
15. **Tabs** - Tab navigation with vertical support
16. **Breadcrumb** - Page navigation trail

---

## 🚀 Component Status

| Component | Design | Implementation | Tests | Storybook | Status |
|-----------|--------|----------------|-------|-----------|--------|
| Button | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Input | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Select | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Checkbox | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Radio | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Toggle | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Textarea | ✅ | 🟡 Planned | ⏳ Pending | ⏳ Pending | Sprint 0 |
| Card | ✅ | ⏳ Planned | ⏳ Pending | ⏳ Pending | Sprint 1 |
| Badge | ✅ | ⏳ Planned | ⏳ Pending | ⏳ Pending | Sprint 1 |
| Avatar | ✅ | ⏳ Planned | ⏳ Pending | ⏳ Pending | Sprint 1 |

---

## 💻 Usage Examples

### Basic Button
```tsx
import { Button } from '@/components/ui/button'

export function BookingForm() {
  return (
    <div className="flex gap-4">
      <Button variant="primary" vertical="events">
        Book Now
      </Button>
      <Button variant="secondary" vertical="events">
        Learn More
      </Button>
      <Button variant="ghost" vertical="events">
        Cancel
      </Button>
    </div>
  )
}
```

### Input with Validation
```tsx
import { Input } from '@/components/ui/input'

export function EmailForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  return (
    <Input
      type="email"
      label="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      placeholder="you@example.com"
      vertical="stays"
    />
  )
}
```

### Select with Search
```tsx
import { Select } from '@/components/ui/select'

const cities = [
  { value: 'lagos', label: 'Lagos, Nigeria' },
  { value: 'accra', label: 'Accra, Ghana' },
]

export function CitySelector() {
  return (
    <Select
      options={cities}
      placeholder="Select a city"
      searchable
      vertical="experiences"
      onChange={(value) => console.log(value)}
    />
  )
}
```

---

## 🎯 Component Props Pattern

All components follow a consistent prop structure:

```tsx
interface BaseComponentProps {
  // Vertical theming
  vertical?: 'stays' | 'events' | 'experiences' | 'cars' | 'marketplace' | 'community'

  // Common props
  className?: string
  disabled?: boolean
  loading?: boolean

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string

  // Children/content
  children?: React.ReactNode
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Component rendering
- Prop variations
- Event handlers
- Accessibility attributes

### Integration Tests (Playwright)
- User interactions
- Form validation
- Keyboard navigation
- Screen reader compatibility

### Visual Tests (Chromatic)
- Component snapshots
- Responsive layouts
- Theme variations
- State changes

---

## 📚 Storybook Setup

View and interact with all components in Storybook:

```bash
npm run storybook
```

This opens Storybook at `http://localhost:6006`

### Story Structure
Each component has stories for:
- Default state
- All variants
- All vertical themes
- Disabled/loading states
- Error states
- Interactive examples

---

## 🔧 Development Workflow

### Creating a New Component

1. **Create component file**
   ```bash
   src/components/ui/[component-name]/[component-name].tsx
   ```

2. **Create type definitions**
   ```bash
   src/components/ui/[component-name]/types.ts
   ```

3. **Create stories**
   ```bash
   src/components/ui/[component-name]/[component-name].stories.tsx
   ```

4. **Create tests**
   ```bash
   src/components/ui/[component-name]/[component-name].test.tsx
   ```

5. **Export from index**
   ```bash
   src/components/ui/index.ts
   ```

---

## 🎨 Theming System

### CSS Custom Properties
All vertical themes use CSS custom properties for consistency:

```css
:root {
  /* Stays - Coastal Emerald */
  --color-stays: #2A9D8F;
  --color-stays-light: #48C9B0;
  --color-stays-dark: #1C6B61;

  /* Events - Afrobeat Red */
  --color-events: #E63946;
  --color-events-light: #F94D5A;
  --color-events-dark: #BE2A35;

  /* And so on... */
}
```

### Tailwind Configuration
Custom colors are defined in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      stays: {
        DEFAULT: '#2A9D8F',
        light: '#48C9B0',
        dark: '#1C6B61',
      },
      // ... other verticals
    }
  }
}
```

---

## 📖 Resources

- [Flowbite Documentation](https://flowbite.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Aria Patterns](https://react-spectrum.adobe.com/react-aria/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Storybook Best Practices](https://storybook.js.org/docs)

---

## 🤝 Contributing

1. Follow the component creation workflow above
2. Ensure all components support vertical theming
3. Add comprehensive accessibility attributes
4. Write tests for all component states
5. Create detailed Storybook stories
6. Document usage examples

---

**Built with ❤️ for OneDettyDecember**
