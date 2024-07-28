'use client'
import React, { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import type { ScrollRestorationManager, ScrollState } from './types'

// ./inline-script.ts will be minified in the prebuild step and the minified
// script will be inlined in the main bundle.
declare const $$INLINE_SCRIPT: string

const storageKey = 'scroll-restoration'

function createScrollRestorationManager(): ScrollRestorationManager {
  function restoreScrollCache(): ScrollState {
    try {
      return (
        JSON.parse(window.sessionStorage.getItem(storageKey) || 'null') || {}
      )
    } catch {
      // ignore
    }

    return {}
  }

  let state = restoreScrollCache()
  let prevHref: string | null = null

  let ticking = false
  // Batch updates to sessionStorage (throttling with the trailing edge)
  function persistState() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify(state))
      } catch {
        // ignore
      }
    })
  }

  function updateScroll(
    href: string,
    restorationId: string,
    {
      scrollX,
      scrollY,
    }: {
      scrollX: number
      scrollY: number
    }
  ) {
    const key = `${href}:${restorationId}`

    state = {
      ...state,
      [key]: {
        scrollX,
        scrollY,
      },
    }
    persistState()
  }

  function restoreScroll(
    href: string,
    scroll: 'default' | 'scroll' | 'no-scroll'
  ) {
    for (const cacheKey in state) {
      const [pageKey, restorationId] = cacheKey.split(':') as [string, string]

      if (pageKey !== href) {
        continue
      }

      const element = document.querySelector(
        `[data-scroll-restoration-id="${restorationId}"]`
      )

      if (element) {
        if (href === prevHref) {
          if (scroll === 'scroll') {
            const key = `${href}:${restorationId}`
            element.scrollLeft = 0
            element.scrollTop = 0
            state = {
              ...state,
              [key]: {
                scrollX,
                scrollY,
              },
            }
            persistState()
          }
        } else if (href !== prevHref) {
          if (scroll === 'default') {
            const { scrollX, scrollY } = state[cacheKey]!
            element.scrollLeft = scrollX
            element.scrollTop = scrollY
          } else if (scroll === 'scroll') {
            const key = `${href}:${restorationId}`
            element.scrollLeft = 0
            element.scrollTop = 0
            state = {
              ...state,
              [key]: {
                scrollX,
                scrollY,
              },
            }
            persistState()
          }
        }
      }
    }
    prevHref = href
  }

  return {
    updateScroll,
    restoreScroll,
  }
}

function useScrollRestoration() {
  const [scrollRestorationManager] = React.useState(() =>
    createScrollRestorationManager()
  )
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const href = `${pathname}${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ''
  }`

  React.useLayoutEffect(() => {
    function onScroll(event: Event) {
      if (event.target === document || event.target === window) {
        return
      }

      const scrollingElement = event.target as Element

      if (!scrollingElement.hasAttribute('data-scroll-restoration-id')) {
        return
      }

      const attrId = scrollingElement.getAttribute('data-scroll-restoration-id')

      if (attrId == null) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            'Scroll restoration element must have a data-scroll-restoration-id attribute with a string value'
          )
        }
        return
      }

      scrollRestorationManager.updateScroll(href, attrId, {
        scrollX: scrollingElement.scrollLeft,
        scrollY: scrollingElement.scrollTop,
      })
    }

    // TypeScript definitions for `removeEventListener` do not allow `passive`
    // option but it is recommended to specify the same options as
    // `addEventListener`.
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
    // From MDN:
    // > It's worth noting that some browser releases have been inconsistent on
    // > this, and unless you have specific reasons otherwise, it's probably
    // > wise to use the same values used for the call to addEventListener()
    // > when calling removeEventListener().
    const options: AddEventListenerOptions & EventListenerOptions = {
      capture: true,
      passive: true,
    }

    document.addEventListener('scroll', onScroll, options)

    return () => {
      document.removeEventListener('scroll', onScroll, options)
    }
  }, [href, scrollRestorationManager])

  const scroll = React.useMemo(() => {
    return (
      (
        {
          '0': 'no-scroll',
          '1': 'scroll',
          false: 'no-scroll',
          true: 'scroll',
          null: 'default',
        } as const
      )[searchParams.get('scroll') ?? 'null'] ?? 'default'
    )
  }, [searchParams])

  const url = new URL(
    href,
    typeof document === 'undefined' ? 'http://example.com' : document.baseURI
  )
  const hasScrollQuery = url.searchParams.has('scroll')

  if (hasScrollQuery) {
    url.searchParams.delete('scroll')
  }
  const normalizedHref = `${url.pathname}${
    url.searchParams.size > 0 ? `?${url.searchParams.toString()}` : ''
  }`

  React.useLayoutEffect(() => {
    scrollRestorationManager.restoreScroll(normalizedHref, scroll)
    if (hasScrollQuery) {
      // Remove the scroll query from the URL if present.
      // The removal of Next.js internal
      // history state is necessary to allow Next.js to recognize the search
      // query change and to update the useSearchParams() hook.
      // If you don't remove the internal state, useSearchParams() will not
      // reflect the change in the search query.
      const {
        __NA: _unused1,
        __PRIVATE_NEXTJS_INTERNALS_TREE: _unused2,
        ...state
      } = history.state
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api
      // Other state properties may have been already added by the user or
      // other libraries using Native History API. We should not remove them.
      history.replaceState(state, '', normalizedHref)
    }
  }, [hasScrollQuery, normalizedHref, scroll, scrollRestorationManager])
}

function ScrollRestorationInner() {
  useScrollRestoration()
  return null
}

/**
 * Restores scroll position on custom scrollable elements marked with the
 * [data-scroll-restoration-id="..."] attribute when navigating on page
 * navigation (reload, back, forward).
 *
 * - Place this component at the end of the body element in the root layout.
 * - Use this for scrollable elements with overflow: auto or overflow: scroll
 *   only (e.g. no need for html or body elements which is natively handled by
 *   Next.js).
 * - `scroll` options passed to `next/link` or `next/navigation` will not be used
 *   for scrollable elements marked with the [data-scroll-restoration-id="..."].
 *   In addition to specifying the scroll option, you can use `scroll` query:
 *   - To disable scroll restoration for a specific link, you can use the
 *     ?scroll=false or ?scroll=0 query parameter.
 *   - To preserve the scroll to top behavior for the same page navigation, use
 *     ?scroll=true or ?scroll=1 query parameter. This is required only for the
 *     same page navigation.
 *   - The search query will be removed from the URL after the scroll
 *     restoration automatically.
 */

function ScrollRestorationBeforeHydration() {
  // This script is executed before React hydration to restore scroll position
  // immediately after the page is loaded or reloaded.
  // This removes all the flickering caused by the default browser behavior,
  // although it increases the complexity of the scroll restoration logic.
  return (
    <script
      // @ts-expect-error React 19 has this property but it's not in the types
      href="scroll-restoration"
      precedence="default"
      dangerouslySetInnerHTML={{ __html: $$INLINE_SCRIPT }}
    />
  )
}

function ScrollRestoration({ children }: { children?: React.ReactNode }) {
  return (
    // Suspense is required because useSearchParams() can suspend in some cases
    // (e.g. SSG).
    <Suspense>
      {children}
      <ScrollRestorationInner />
    </Suspense>
  )
}

export {
  ScrollRestoration,
  ScrollRestorationBeforeHydration as experimental_ScrollRestorationBeforeHydration,
}
