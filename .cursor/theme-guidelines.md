# Theme Color Guidelines

When adding new colors to the application, always use CSS variables to ensure theme compatibility. This allows for easy switching between light and dark modes.

## Available Color Variables

### Background Colors
- `--background-primary`: Main background color
- `--background-secondary`: Secondary/alternate background color

### Text Colors
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color (for less emphasis)

### Accent Colors
- `--accent-primary`: Main accent color (for primary actions, links)
- `--accent-hover`: Accent color for hover states

### Button Colors
- `--button-bg`: Button background color
- `--button-border`: Button border color
- `--button-hover`: Button hover state color

### Card Colors
- `--card-bg`: Card background color
- `--card-shadow`: Card shadow color

## Usage Examples

```css
/* ✅ DO: Use theme variables */
.element {
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--button-border);
}

/* ❌ DON'T: Use hardcoded colors */
.element {
  background-color: #ffffff;
  color: #213547;
  border: 1px solid #646cff;
}
```

## Adding New Colors

If you need to add a new color that doesn't fit into existing variables:

1. Add the new variable to both themes in `src/index.css`:
```css
:root {
  /* Light theme */
  --new-color: #your-color;
}

[data-theme="dark"] {
  /* Dark theme */
  --new-color: #your-dark-color;
}
```

2. Use the variable in your CSS:
```css
.element {
  color: var(--new-color);
}
```

## Theme Switching

The application uses a `data-theme` attribute on the root element to switch themes:
- Light theme: `data-theme="light"` or no attribute
- Dark theme: `data-theme="dark"`

All color variables will automatically update when the theme changes. 