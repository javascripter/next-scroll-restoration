# Next Scroll Restoration

A robust scroll restoration library for Next.js App Router that supports custom
scrollable elements.

## Purpose

Next Scroll Restoration solves the problem of preserving scroll positions for
custom scrollable elements in Next.js applications, which is not natively
supported by Next.js's built-in scroll restoration feature. Check out our [demo](https://next-scroll-restoration.vercel.app/) to see it in action.

## Features

- 🔄 Preserves scroll position for custom scrollable elements
- 🚀 Works seamlessly with Next.js App Router and its built-in scroll restoration
- 🖱️ Supports multiple scrollable areas within a single page
- 🔧 Fine-grained control over scroll behavior via URL parameters
- 🏎️ Performance-optimized with batched updates to sessionStorage
- 📦 Minimal setup required
- 🧠 Handles edge cases like same-page navigation, initial page load, hard reload, and more

## Installation

```bash
npm install next-scroll-restoration
```

## Quick Start

```tsx
import React from 'react'
import { ScrollRestoration } from 'next-scroll-restoration'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  )
}
```

## Usage

1. Add the `ScrollRestoration` component to your root layout.
2. Mark scrollable elements with the `data-scroll-restoration-id` attribute:

```tsx
<div
  data-scroll-restoration-id="container"
  style={{
    height: '100dvh',
    overflowY: 'scroll',
  }}
>
  Your scrollable content
</div>
```

3. Use URL parameters to control scroll behavior:
   - `?scroll=false` or `?scroll=0`: Disable scroll restoration
   - `?scroll=true` or `?scroll=1`: Force scroll to top (useful for same-page navigation)

## How It Works

- Designed to work alongside Next.js's built-in scroll restoration feature
- Handles scroll restoration for elements explicitly marked with `data-scroll-restoration-id` attribute
- Uses `sessionStorage` to persist scroll positions across page reloads
- Utilizes React hooks and Next.js routing for efficient state management
- Handles various navigation scenarios including history push/forward/reload
- Handles Next.js App Router features like async Components, nested Suspense boundaries, and SSG correctly
- Implements a pre-hydration script to eliminate flickering (experimental: optional)

## Important Considerations

1. **Same-page navigation**: To ensure scroll-to-top behavior, use:

   ```tsx
   <Link href="/same-page?scroll=true">Link</Link>
   ```

2. **Page navigation with scroll: false**: When using Next.js scroll options, also specify in the URL:

   ```tsx
   <Link href="/another-page?scroll=false" scroll={false}>
     Link
   </Link>
   ```

   ```tsx
   router.push('/another-page?scroll=false', { scroll: false })
   ```

3. **Search query cleanup**: The `scroll` search query is automatically removed after scroll restoration.

## Advanced Usage: Scroll Restoration Before Hydration

> Experimental (React 19+ Only)

For cases where you notice flickering on initial page load or first navigation,
you can optionally use the `ScrollRestorationBeforeHydration` component:

```tsx
import React from 'react'
import {
  ScrollRestoration,
  experimental_ScrollRestorationBeforeHydration as ScrollRestorationBeforeHydration,
} from 'next-scroll-restoration'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <ScrollRestoration>
          <ScrollRestorationBeforeHydration />
        </ScrollRestoration>
      </body>
    </html>
  )
}
```

This component injects a script that runs before React hydration, restoring scroll position immediately after content becomes readable.

## Browser Support

Compatible with all modern browsers that support `sessionStorage` and
`ResizeObserver`.
