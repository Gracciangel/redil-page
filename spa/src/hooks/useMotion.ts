import { useEffect } from 'react'

/** Activa las animaciones de entrada y el parallax ligero al hacer scroll. */
export function usePageMotion(): void {
  useEffect(() => {
    const root = document.documentElement
    const revealables = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    revealables.forEach((element) => observer.observe(element))

    let scheduled = false
    const onScroll = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        root.style.setProperty('--scroll-y', String(Math.round(window.scrollY)))
        root.classList.toggle('is-scrolled', window.scrollY > 24)
        scheduled = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      root.classList.remove('is-scrolled')
    }
  }, [])
}
