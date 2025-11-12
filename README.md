# react-vite

React + Vite + TypeScript + Tailwind CSS project template

## Tech Stack

- **React 19** - A JavaScript library for building user interfaces
- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - JavaScript with syntax for types
- **Tailwind CSS** - A utility-first CSS framework

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
MyApp.Client/
├── src/
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main App component
│   ├── App.css        # App styles
│   ├── index.css      # Global styles with Tailwind CSS
│   └── main.tsx       # Application entry point
├── public/            # Public static files
├── index.html         # HTML template
├── tailwind.config.ts # Tailwind CSS configuration (TypeScript)
├── postcss.config.js  # PostCSS configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Tailwind CSS v4

This project uses **Tailwind CSS v4** with the new CSS-first configuration approach.

### Key Features

- **Vite Plugin**: Uses `@tailwindcss/vite` for optimal performance
- **CSS-first Configuration**: Modern `@import` syntax instead of legacy directives
- **TypeScript Config**: Configuration in `tailwind.config.ts`
- **Built-in Plugins**: Includes `@tailwindcss/forms` plugin

### Configuration

Tailwind is imported using the new v4 syntax in `src/index.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@config "../tailwind.config.ts";
```

The Vite plugin is configured in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
