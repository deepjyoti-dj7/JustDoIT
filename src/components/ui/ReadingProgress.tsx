import { useReadingProgress } from '@/hooks/useReadingProgress'

export function ReadingProgress() {
  const progress = useReadingProgress()
  return (
    <div
      id="reading-progress"
      style={{ width: `${progress}%` }}
    />
  )
}
