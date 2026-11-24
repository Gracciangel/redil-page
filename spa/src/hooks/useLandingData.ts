import { useEffect, useState } from 'react'
import { loadLandingData, ROADMAP, type LandingData } from '../data/landing'

const INITIAL: LandingData = {
  stats: null,
  roadmap: ROADMAP,
  live: false,
}

export function useLandingData(): LandingData {
  const [data, setData] = useState<LandingData>(INITIAL)

  useEffect(() => {
    const controller = new AbortController()
    void loadLandingData(controller.signal).then((result) => {
      if (!controller.signal.aborted) setData(result)
    })
    return () => controller.abort()
  }, [])

  return data
}
