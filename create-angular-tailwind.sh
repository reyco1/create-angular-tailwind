#!/bin/bash

# Angular + Tailwind CSS Project Starter Script
# This script creates a new Angular project and configures Tailwind CSS

set -e

echo "==================================="
echo "Angular + Tailwind CSS Project Setup"
echo "==================================="
echo ""

# Ask for application name
read -p "Enter the application name: " APP_NAME

# Validate app name is not empty
if [ -z "$APP_NAME" ]; then
    echo "Error: Application name cannot be empty."
    exit 1
fi

# Ask for style preference with CSS as default
echo ""
echo "Select stylesheet format:"
echo "  1) CSS (default)"
echo "  2) SCSS"
echo "  3) Sass"
echo "  4) Less"
read -p "Enter your choice [1-4] (press Enter for CSS): " STYLE_CHOICE

# Set style based on choice
case $STYLE_CHOICE in
    2)
        STYLE="scss"
        ;;
    3)
        STYLE="sass"
        ;;
    4)
        STYLE="less"
        ;;
    *)
        STYLE="css"
        ;;
esac

echo ""
echo "Creating Angular project '$APP_NAME' with $STYLE stylesheets..."
echo ""

# Step 1: Create Angular project
ng new "$APP_NAME" --style "$STYLE" --skip-git --defaults

# Navigate into the project
cd "$APP_NAME"

echo ""
echo "Installing Tailwind CSS and dependencies..."
echo ""

# Step 2: Install Tailwind CSS and its peer dependencies
npm install tailwindcss @tailwindcss/postcss postcss --force

# Step 3: Configure PostCSS plugins
echo ""
echo "Configuring PostCSS..."
cat > .postcssrc.json << 'EOF'
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
EOF

# Step 4: Import Tailwind CSS into the main styles file
echo ""
echo "Adding Tailwind CSS import to styles.$STYLE..."

STYLES_FILE="src/styles.$STYLE"
if [ -f "$STYLES_FILE" ]; then
    # Prepend the import to existing styles file
    echo '@import "tailwindcss";' | cat - "$STYLES_FILE" > temp && mv temp "$STYLES_FILE"
else
    echo '@import "tailwindcss";' > "$STYLES_FILE"
fi

# Step 5: Create CLAUDE.md file with project instructions
echo ""
echo "Creating CLAUDE.md file..."
cat > CLAUDE.md << 'EOF'
# Angular + Tailwind CSS Project

This is an Angular project configured with Tailwind CSS for styling.

## Important Guidelines

### Styling Requirements

- **EXCLUSIVELY use Tailwind CSS** for all UI styles
- Do NOT use traditional CSS/SCSS/Sass/Less for component styling
- Use Tailwind utility classes directly in component templates
- Avoid writing custom CSS unless absolutely necessary

### Tailwind CSS Usage

When styling components, always use Tailwind utility classes:

```html
<!-- Good: Using Tailwind utility classes -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold text-gray-800">Title</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>

<!-- Bad: Using custom CSS -->
<div class="custom-container">...</div>
```

### Component Styling

- Use Tailwind classes in template HTML files
- For complex/reusable styles, use `@apply` directive sparingly in component CSS files
- Prefer composition of utility classes over custom CSS

### Responsive Design

Use Tailwind's responsive prefixes:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)
- `2xl:` - 2X large screens (1536px+)

### Dark Mode

Use Tailwind's dark mode utilities when implementing dark themes:
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

## Project Structure

This is a standard Angular project with Tailwind CSS configured via PostCSS.

### Key Files

- `src/styles.css` - Global styles with Tailwind import
- `.postcssrc.json` - PostCSS configuration for Tailwind
- `tailwind.config.js` - Tailwind configuration (if customization needed)

## Commands

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng generate component <name>` - Generate a new component
EOF

echo ""
echo "Running initial build to verify setup..."
npm run build

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "Your Angular + Tailwind CSS project '$APP_NAME' has been created."
echo ""
echo "Next steps:"
echo "  cd $APP_NAME"
echo "  ng serve"
echo ""
echo "Then open http://localhost:4200 in your browser."
echo ""
echo "Start using Tailwind classes in your components:"
echo '  <h1 class="text-3xl font-bold underline">Hello world!</h1>'
echo ""
