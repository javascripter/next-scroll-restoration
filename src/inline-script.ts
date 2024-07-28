// The content of this file will be compiled and minified into the main bundle
// as a string via $$INILNE_SCRIPT variable in the build process.

const storageKey = 'scroll-restoration'
function restoreScrollCache() {
  try {
    return JSON.parse(window.sessionStorage.getItem(storageKey) || 'null') || {}
  } catch {
    // ignore
  }
  return {}
}
function persistState() {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // ignore
  }
}
let state = restoreScrollCache()
function restoreScroll(
  href: string,
  scroll: 'default' | 'scroll' | 'no-scroll'
) {
  for (const cacheKey in state) {
    const [pageKey, restorationId] = cacheKey.split(':')
    if (pageKey !== href) {
      continue
    }
    const element = document.querySelector(
      `[data-scroll-restoration-id="\${restorationId}"]`
    )
    if (element) {
      if (scroll === 'default') {
        const { scrollX, scrollY } = state[cacheKey]
        element.scrollLeft = scrollX
        element.scrollTop = scrollY
        const resizeObserver = new ResizeObserver(() => {
          if (
            element.scrollHeight >= element.scrollTop ||
            element.scrollWidth >= element.scrollLeft
          ) {
            element.scrollLeft = scrollX
            element.scrollTop = scrollY
            resizeObserver.unobserve(element)
            resizeObserver.disconnect()
          }
        })
        resizeObserver.observe(element)
        setTimeout(() => {
          resizeObserver.disconnect()
        }, 500)
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
const url = new URL(location.search, document.baseURI)
const hasScrollQuery = url.searchParams.has('scroll')

if (hasScrollQuery) {
  url.searchParams.delete('scroll')
}
const normalizedHref = `${url.pathname}${
  url.searchParams.size > 0 ? `?${url.searchParams.toString()}` : ''
}`
restoreScroll(normalizedHref, 'default')
history.replaceState(history.state, '', normalizedHref)
