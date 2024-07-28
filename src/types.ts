export type ScrollState = {
  /**
   * key: `[PAGE_KEY]:[RESTORATION_ID]`
   */
  [key: string]: {
    scrollX: number
    scrollY: number
  }
}

export type ScrollRestorationManager = {
  updateScroll: (
    href: string,
    restorationId: string,
    {
      scrollX,
      scrollY,
    }: {
      scrollX: number
      scrollY: number
    }
  ) => void
  restoreScroll: (
    href: string,
    scroll: 'default' | 'scroll' | 'no-scroll'
  ) => void
}
