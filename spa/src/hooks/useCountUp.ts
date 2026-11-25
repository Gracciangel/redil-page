import { useEffect, useRef, useState } from 'react'

/**
 * Cuenta desde 0 hasta `target` con easing suave. Arranca una sola vez, cuando
 * `active` es true (por ejemplo al entrar en viewport). Con movimiento
 * reducido —o si el target cambia después— muestra el valor final directo.
 */
export function useCountUp(target: number, active = true, duration = 1400): number {
  const [value, setValue] = useState(0)
  const animatedTarget = useRef<number | null>(null)

  useEffect(() => {
    if (!active || animatedTarget.current === target) return

    const isFirst = animatedTarget.current === null
    animatedTarget.current = target

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!isFirst || reduceMotion) {
      setValue(target)
      return
    }

    let frame = 0
    let startTime: number | null = null
    const tick = (now: number) => {
      if (startTime === null) startTime = now
      const t = Math.min(1, (now - startTime) / duration)
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])

  return value
}
