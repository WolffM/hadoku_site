# FOSS Component Research Guide

## Current Architecture

- **Framework**: Astro 5 (SSG, static output)
- **UI**: React 19 + Tailwind CSS
- **Module System**: ESM (type: "module")
- **Architecture**: Micro-frontends pattern
- **Styling**: Custom CSS variables + Tailwind utilities
  - Theme variables: `var(--color-bg)`, `var(--color-text)`, etc.
  - Custom theme system via `@wolffm/themes`
- **TypeScript**: Full support required
- **Build**: Vite-based

## Required Component Characteristics

### Architecture Compatibility
- Headless/unstyled libraries (highest priority)
- Framework-agnostic or React-compatible
- Small bundle size (micro-frontend architecture)
- ESM module support
- TypeScript support
- Works with Astro SSG

### Fork-Friendly Indicators
- Active but not hyper-active (3-20 contributors ideal)
- Permissive licenses: MIT, Apache 2.0, BSD
- Simple dependencies
- Good test coverage
- Clear file structure
- Small codebase (<50 files preferred)

### Integration Requirements
- Accepts CSS variables (`var(--color-bg)`, etc.)
- Supports custom class names (Tailwind workflow)
- No forced styling/themes
- Modular exports (tree-shakeable)
- Standard React patterns (no magic)

## ChatGPT Deep Research Prompts

### Notifications
```
Find FOSS React notification/toast libraries that are:
- Headless or unstyled (no forced styling)
- Support custom CSS and Tailwind
- Lightweight (<10kb)
- TypeScript support
- MIT licensed
- Under 1000 GitHub stars (easier to fork/maintain)
- Compare: react-hot-toast, sonner, react-toastify headless versions
```

### Calendar/Scheduling
```
Find FOSS calendar and appointment scheduling libraries for React that:
- Are headless/unstyled or minimally styled
- Support custom CSS variables
- Work with Astro SSG
- Have <5 core maintainers (fork-friendly)
- MIT/Apache licensed
- Compare scheduling libraries vs calendar view libraries separately
- Include data model/API design patterns
```

### Art Showcase/Gallery
```
Find FOSS React image gallery/portfolio components that:
- Are headless or support custom styling
- Support lazy loading and responsive images
- Work with Astro
- Have simple lightbox functionality
- Are fork-friendly (small codebase, <50 files)
- MIT licensed
```

## Evaluation Checklist

For each candidate library:

- [ ] Can remove ALL styling and use Tailwind + CSS vars?
- [ ] Exports individual components/functions?
- [ ] Last commit < 6 months ago?
- [ ] Codebase understandable in < 1 hour?
- [ ] Uses standard React patterns?
- [ ] Compatible with ESM?
- [ ] Works with Astro SSG?
- [ ] TypeScript definitions included?

## Fork vs. Dependency Decision

| Factor | Fork | Use as Dependency |
|--------|------|-------------------|
| 100+ active contributors | ❌ | ✅ |
| 1-10 contributors, clear code | ✅ | ❌ |
| Complex build process | ❌ | ✅ |
| Simple source (few files) | ✅ | ❌ |
| Need <50% of features | ✅ | ❌ |
| Actively maintained by large org | ❌ | ✅ |

## Red Flags (Avoid)

- Monorepos with 50+ packages
- Custom build tools (not standard Vite/Rollup)
- Heavy framework coupling (Next.js specific, etc.)
- No exports of internal utilities
- Inline styles with no escape hatch
- Webpack-only or CJS-only
- Requires specific bundler plugins

## Useful Search Queries

### GitHub Advanced Search
```
topic:headless language:TypeScript stars:100..1000 license:mit
topic:react-components topic:unstyled archived:false
topic:headless topic:react stars:<1000 license:mit
```

### NPM Search
```
keywords:headless keywords:unstyled keywords:react
keywords:headless keywords:typescript keywords:components
```

## Cross-Reference Resources

- **npm trends**: Compare download trends, bundle size
- **Bundlephobia**: Check actual bundle impact
- **GitHub**: Read source, check commit activity
- **Package Phobia**: Verify install size

## Target Features

### Notifications
- Toast/notification system
- Custom positioning
- Auto-dismiss with custom timing
- Action buttons support
- Queue management

### Calendar/Scheduling
- Month/week/day views
- Event creation/editing
- Time slot selection
- Timezone support
- Recurring events (optional)

### Art Showcase
- Grid/masonry layouts
- Lightbox/modal view
- Lazy loading
- Touch gestures
- Responsive images
- Metadata display
