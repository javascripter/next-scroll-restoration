import Link from 'next/link'
import styles from './page.module.css'
export default function Page({
  params: { id },
}: {
  params: {
    id: string
  }
}) {
  const anotherId = parseInt(id) === 1 ? 2 : 1

  return (
    <main
      className={styles.main}
      // data-scroll-restoration-id is used to identify the scroll restoration
      // container.
      // Uniqueness only needs to be guaranteed within the same route, so it's
      // enough to use any constant string id here but we use the id from the URL here.
      data-scroll-restoration-id={id}
    >
      <div className={styles.content}>
        <h1>Next Scroll Restoration ({id})</h1>
        <p>
          This page uses the main element as a scrollable container, so the
          scroll restoration is managed by the {'`<ScrollRestoration />`'}{' '}
          component.
        </p>
        <p>
          You can scroll the page, navigate to another page, go back and come
          back, reload the page, and the scroll position will be restored.
        </p>
        <p>👇 Example Links below</p>
        {Array.from({ length: 100 }, (_, i) => (
          <br key={i} />
        ))}
        <ul>
          <li>
            <Link href="/">Navigate to Home (scrolls to the top)</Link>
          </li>
          <li>
            <Link
              href={{
                pathname: `/scroll-restoration/${id}`,
                query: {
                  scroll: true,
                },
              }}
            >
              Navigate to the same page ({id}) (scrolls to the top)
            </Link>
          </li>
          <li>
            <Link
              href={{
                pathname: `/scroll-restoration/${id}`,
                query: {
                  scroll: false,
                },
              }}
              scroll={false}
            >
              Navigate to the same page ({id}) with scroll disabled (does not
              reset the scroll position)
            </Link>
          </li>
          <li>
            <Link
              href={{
                pathname: `/scroll-restoration/${id}`,
                query: {
                  scroll: true,
                },
              }}
              replace
            >
              Navigate to the same page ({id}) with replace: true (scrolls to
              the top)
            </Link>
          </li>
          <li>
            <Link
              href={{
                pathname: `/scroll-restoration/${anotherId}`,
                query: {
                  scroll: true,
                },
              }}
            >
              Navigate to another page ({anotherId})
            </Link>
          </li>
          <li>
            <Link
              href={{
                pathname: `/scroll-restoration/${anotherId}`,
                query: {
                  scroll: true,
                },
              }}
            >
              Navigate to another page ({anotherId}) with replace: true (scrolls
              to the top)
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
