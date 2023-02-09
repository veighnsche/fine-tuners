import { Avatar } from '@mui/material'
import jdenticon from 'jdenticon/standalone'
import { useEffect, useRef } from 'react'

export interface JdenticonProps {
  value: string
  size?: number
  className?: string
}

export const Identicon = ({ value, size = 64, className }: JdenticonProps) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      jdenticon.update(ref.current, value)
    }
  }, [value])

  return (
    <Avatar sx={{ width: size, height: size }} variant="rounded">
      <canvas ref={ref} className={className} width={size} height={size}/>
    </Avatar>
  )
}