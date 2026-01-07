#!/usr/bin/env node

const readline = require('readline');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function runCommand(command, options = {}) {
  console.log(`\n> ${command}\n`);
  execSync(command, { stdio: 'inherit', ...options });
}

const CLAUDE_MD_CONTENT = `# Angular + Tailwind CSS Project

This is an Angular project configured with Tailwind CSS for styling.

## Important Guidelines

### Styling Requirements

- **EXCLUSIVELY use Tailwind CSS** for all UI styles
- Do NOT use traditional CSS/SCSS/Sass/Less for component styling
- Use Tailwind utility classes directly in component templates
- Avoid writing custom CSS unless absolutely necessary

### Tailwind CSS Usage

When styling components, always use Tailwind utility classes:

\`\`\`html
<!-- Good: Using Tailwind utility classes -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold text-gray-800">Title</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>

<!-- Bad: Using custom CSS -->
<div class="custom-container">...</div>
\`\`\`

### Component Styling

- Use Tailwind classes in template HTML files
- For complex/reusable styles, use \`@apply\` directive sparingly in component CSS files
- Prefer composition of utility classes over custom CSS

### Responsive Design

Use Tailwind's responsive prefixes:
- \`sm:\` - Small screens (640px+)
- \`md:\` - Medium screens (768px+)
- \`lg:\` - Large screens (1024px+)
- \`xl:\` - Extra large screens (1280px+)
- \`2xl:\` - 2X large screens (1536px+)

### Dark Mode

Use Tailwind's dark mode utilities when implementing dark themes:
\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
\`\`\`

## Project Structure

This is a standard Angular project with Tailwind CSS configured via PostCSS.

### Key Files

- \`src/styles.css\` - Global styles with Tailwind import
- \`.postcssrc.json\` - PostCSS configuration for Tailwind
- \`tailwind.config.js\` - Tailwind configuration (if customization needed)

## Commands

- \`ng serve\` - Start development server
- \`ng build\` - Build for production
- \`ng test\` - Run unit tests
- \`ng generate component <name>\` - Generate a new component
`;

const POSTCSS_CONFIG = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
`;

async function main() {
  console.log('===================================');
  console.log('Angular + Tailwind CSS Project Setup');
  console.log('===================================\n');

  // Check if Angular CLI is installed
  try {
    execSync('ng version', { stdio: 'ignore' });
  } catch {
    console.error('Error: Angular CLI is not installed.');
    console.error('Please install it with: npm install -g @angular/cli');
    process.exit(1);
  }

  // Ask for application name
  const appName = await question('Enter the application name: ');

  if (!appName || !appName.trim()) {
    console.error('Error: Application name cannot be empty.');
    process.exit(1);
  }

  const cleanAppName = appName.trim();

  // Ask for style preference
  console.log('\nSelect stylesheet format:');
  console.log('  1) CSS (default)');
  console.log('  2) SCSS');
  console.log('  3) Sass');
  console.log('  4) Less');

  const styleChoice = await question('Enter your choice [1-4] (press Enter for CSS): ');

  let style;
  switch (styleChoice.trim()) {
    case '2':
      style = 'scss';
      break;
    case '3':
      style = 'sass';
      break;
    case '4':
      style = 'less';
      break;
    default:
      style = 'css';
  }

  rl.close();

  console.log(`\nCreating Angular project '${cleanAppName}' with ${style} stylesheets...\n`);

  // Step 1: Create Angular project
  runCommand(`ng new "${cleanAppName}" --style ${style} --skip-git --defaults`);

  // Change to project directory
  const projectPath = path.join(process.cwd(), cleanAppName);
  process.chdir(projectPath);

  console.log('\nInstalling Tailwind CSS and dependencies...\n');

  // Step 2: Install Tailwind CSS and its peer dependencies
  runCommand('npm install tailwindcss @tailwindcss/postcss postcss --force');

  // Step 3: Configure PostCSS plugins
  console.log('\nConfiguring PostCSS...');
  fs.writeFileSync(path.join(projectPath, '.postcssrc.json'), POSTCSS_CONFIG);

  // Step 4: Import Tailwind CSS into the main styles file
  console.log(`Adding Tailwind CSS import to styles.${style}...`);
  const stylesPath = path.join(projectPath, 'src', `styles.${style}`);

  let existingStyles = '';
  if (fs.existsSync(stylesPath)) {
    existingStyles = fs.readFileSync(stylesPath, 'utf8');
  }

  fs.writeFileSync(stylesPath, `@import "tailwindcss";\n${existingStyles}`);

  // Step 5: Create CLAUDE.md file
  console.log('Creating CLAUDE.md file...');
  fs.writeFileSync(path.join(projectPath, 'CLAUDE.md'), CLAUDE_MD_CONTENT);

  // Step 6: Run build to verify setup
  console.log('\nRunning initial build to verify setup...');
  runCommand('npm run build');

  console.log('\n===================================');
  console.log('Setup Complete!');
  console.log('===================================\n');
  console.log(`Your Angular + Tailwind CSS project '${cleanAppName}' has been created.\n`);
  console.log('Next steps:');
  console.log(`  cd ${cleanAppName}`);
  console.log('  ng serve\n');
  console.log('Then open http://localhost:4200 in your browser.\n');
  console.log('Start using Tailwind classes in your components:');
  console.log('  <h1 class="text-3xl font-bold underline">Hello world!</h1>\n');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
