import { useEffect, useState } from 'react'

export function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}
