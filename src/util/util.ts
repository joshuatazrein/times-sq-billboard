import { useEffect, useMemo, useRef } from 'react'

export const useEventListener = <K extends keyof WindowEventMap>(
  listener: K,
  func: (data: WindowEventMap[K]) => void,
  dependencies: any[] = []
) => {
  useEffect(() => {
    window.addEventListener(listener, func)
    return () => window.removeEventListener(listener, func)
  }, dependencies)
}

export const useInterval = (
  interval: () => void,
  intervalTime: number,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const intervalIndex = window.setInterval(interval, intervalTime)
    return () => window.clearInterval(intervalIndex)
  }, dependencies)
}

export const rad = (progress: number) => progress * Math.PI * 2

export const scale = <T extends number | number[]>(
  input: T,
  low: number,
  high: number,
  lowOut: number,
  highOut: number,
  exp: number = 1
): T => {
  const scaleNumber = (input: number) => {
    if (high === low) return lowOut
    const zTo1 = ((input - low) / (high - low)) ** exp
    return zTo1 * (highOut - lowOut) + lowOut
  }
  if (input instanceof Array) {
    return input.map(value => scaleNumber(value)) as T
  } else {
    return scaleNumber(input) as T
  }
}

export const create = <T>(e: T, onCreate: (argument: T) => void) => {
  onCreate(e)
  return e
}

export const useMemoCleanup = <T>(
  create: () => T,
  cleanup: (item: T) => void,
  deps: any[] = []
) => {
  const itemRef = useRef<T | null>(null)
  const item = useMemo(() => {
    if (itemRef.current) {
      cleanup(itemRef.current)
      itemRef.current = null
    }
    return create()
  }, deps)
  itemRef.current = item
  return item
}
