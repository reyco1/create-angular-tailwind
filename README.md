# @reyco1/create-angular-tailwind

CLI to scaffold an Angular project with Tailwind CSS pre-configured.

## Usage

```bash
npx @reyco1/create-angular-tailwind
```

## What it does

1. Prompts for your application name
2. Prompts for stylesheet format (CSS, SCSS, Sass, or Less)
3. Creates a new Angular project using `ng new`
4. Installs Tailwind CSS dependencies (`tailwindcss`, `@tailwindcss/postcss`, `postcss`)
5. Configures PostCSS with the Tailwind plugin
6. Adds `@import "tailwindcss";` to your styles file
7. Creates a `CLAUDE.md` file with Tailwind-only styling guidelines
8. Runs an initial build to verify the setup

## Requirements

- Node.js >= 18.0.0
- Angular CLI installed globally (`npm install -g @angular/cli`)

## After Setup

```bash
cd your-app-name
ng serve
```

Then open http://localhost:4200 in your browser.

Start using Tailwind classes in your components:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

## License

MIT
