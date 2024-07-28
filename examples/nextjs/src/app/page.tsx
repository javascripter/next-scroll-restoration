import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Next Scroll Restoration Example</h1>
      <p>
        This page does not use a scrollable container, so the scroll restoration
        is managed by the browser.
      </p>
      <p>
        If you navigate to the scroll restoration page and then come back here,
        you will see that the page is scrolled to the top.
        <br />
        <Link href="/scroll-restoration/1">Navigate to Scroll Restoration</Link>
      </p>
      <p>👇 Link below</p>
      {Array.from({ length: 100 }, (_, i) => (
        <br key={i} />
      ))}
      <p>
        When you click the link below, the page will scroll to the top
        initially. <br />
        <br />
        If you navigate to the scroll restoration page down and then come back
        here, you will see that the page position is restored (default Next.js
        behavior).
        <br />
        <br />
        If you press the forward button in the browser, you will see that the
        page position is restored there as well (
        {'<ScrollRestoration /> handles it automatically'}).
        <br />
        <br />
        <Link href="/scroll-restoration/1">Navigate to Scroll Restoration</Link>
      </p>
    </main>
  )
}
