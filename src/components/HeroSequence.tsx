import React, { useRef, useEffect, useState, useCallback } from 'react'

interface HeroSequenceProps {
  progress: number // Scroll progress from 0.0 to 1.0
  onFirstFrameLoaded?: () => void
  onProgressChange?: (loadedCount: number, total: number) => void
  className?: string
}

const TOTAL_FRAMES = 150
const CONCURRENT_DOWNLOADS = 4

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  progress,
  onFirstFrameLoaded,
  onProgressChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  // Cache: frameNumber (1 to 150) -> HTMLImageElement
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map())
  const loadingFrames = useRef<Set<number>>(new Set())
  const queueRef = useRef<number[]>([])
  const activeDownloads = useRef(0)
  const isDestroyed = useRef(false)

  // Rendering state
  const lastDrawnFrameRef = useRef<number>(-1)
  const targetFrameRef = useRef<number>(1)
  const rafIdRef = useRef<number | null>(null)
  const isDirtyRef = useRef(true)

  // Detect mobile screen on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Helper to format frame path
  const getFrameUrl = useCallback(
    (frameIndex: number, mobileMode: boolean) => {
      const padded = String(frameIndex).padStart(4, '0')
      const folder = mobileMode ? '/frames/mobile' : '/frames'
      return `${folder}/frame_${padded}.webp`
    },
    []
  )

  // Nearest-neighbor fallback: find closest available frame in cache
  const getClosestAvailableImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    const cache = frameCache.current
    if (cache.has(targetIndex)) {
      return cache.get(targetIndex)!
    }

    let closestDist = Infinity
    let closestImg: HTMLImageElement | null = null

    for (const [idx, img] of cache.entries()) {
      const dist = Math.abs(idx - targetIndex)
      if (dist < closestDist) {
        closestDist = dist
        closestImg = img
      }
    }

    return closestImg
  }, [])

  // Draw frame on canvas with object-fit: cover math and DPR
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const targetFrame = targetFrameRef.current
    const img = getClosestAvailableImage(targetFrame)
    if (!img || !img.complete || img.naturalWidth === 0) {
      return
    }

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight

    // object-fit: cover math
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight)
    const renderWidth = imgWidth * scale
    const renderHeight = imgHeight * scale
    const offsetX = (canvasWidth - renderWidth) * 0.5
    const offsetY = (canvasHeight - renderHeight) * 0.5

    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)
    lastDrawnFrameRef.current = targetFrame
    isDirtyRef.current = false
  }, [getClosestAvailableImage])

  // Canvas resize and render scheduler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    // Clamp DPR to 2 to optimize memory consumption while staying crisp on Retina
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const newPixelWidth = Math.round(rect.width * dpr)
    const newPixelHeight = Math.round(rect.height * dpr)

    if (canvas.width !== newPixelWidth || canvas.height !== newPixelHeight) {
      canvas.width = newPixelWidth
      canvas.height = newPixelHeight
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      isDirtyRef.current = true
      drawFrame()
    }
  }, [drawFrame])

  // Load an individual frame
  const loadSingleFrame = useCallback(
    (frameIndex: number, mobileMode: boolean, isHighPriority = false): Promise<HTMLImageElement> => {
      if (frameCache.current.has(frameIndex)) {
        return Promise.resolve(frameCache.current.get(frameIndex)!)
      }

      return new Promise((resolve, reject) => {
        loadingFrames.current.add(frameIndex)
        const img = new Image()
        img.src = getFrameUrl(frameIndex, mobileMode)

        const handleSuccess = async () => {
          if (isDestroyed.current) return
          loadingFrames.current.delete(frameIndex)

          // Decode asynchronously if supported to prevent jank during paint
          if ('decode' in img && typeof img.decode === 'function') {
            try {
              await img.decode()
            } catch {
              // Ignore decode fallback
            }
          }

          frameCache.current.set(frameIndex, img)

          // Notify progress
          if (onProgressChange) {
            onProgressChange(frameCache.current.size, TOTAL_FRAMES)
          }

          // If this frame is the currently targeted frame or closest neighbor, mark dirty
          if (Math.abs(targetFrameRef.current - frameIndex) <= 2) {
            isDirtyRef.current = true
          }

          if (frameIndex === 1 && !isFirstFrameReady) {
            setIsFirstFrameReady(true)
            if (onFirstFrameLoaded) onFirstFrameLoaded()
          }

          resolve(img)
        }

        const handleError = (err: Event | string) => {
          loadingFrames.current.delete(frameIndex)
          reject(err)
        }

        if (img.complete && img.naturalWidth > 0) {
          handleSuccess()
        } else {
          img.onload = handleSuccess
          img.onerror = handleError
        }
      })
    },
    [getFrameUrl, isFirstFrameReady, onFirstFrameLoaded, onProgressChange]
  )

  // Queue pump with limited concurrency
  const processQueue = useCallback(() => {
    if (isDestroyed.current) return

    while (activeDownloads.current < CONCURRENT_DOWNLOADS && queueRef.current.length > 0) {
      const nextFrame = queueRef.current.shift()!
      if (!nextFrame || frameCache.current.has(nextFrame) || loadingFrames.current.has(nextFrame)) {
        continue
      }

      activeDownloads.current++
      loadSingleFrame(nextFrame, isMobile)
        .catch(() => {
          // Graceful skip on single frame error
        })
        .finally(() => {
          activeDownloads.current--
          processQueue()
        })
    }
  }, [isMobile, loadSingleFrame])

  // Dynamic priority re-ordering around current target frame
  const prioritizeAroundTarget = useCallback(
    (target: number) => {
      // Create a window around target: target, target+1, target-1, target+2, target-2...
      const windowFrames: number[] = []
      const radius = 8

      for (let offset = 0; offset <= radius; offset++) {
        const next = target + offset
        const prev = target - offset

        if (next <= TOTAL_FRAMES && !frameCache.current.has(next) && !loadingFrames.current.has(next)) {
          windowFrames.push(next)
        }
        if (offset > 0 && prev >= 1 && !frameCache.current.has(prev) && !loadingFrames.current.has(prev)) {
          windowFrames.push(prev)
        }
      }

      if (windowFrames.length > 0) {
        // Filter out these window frames from existing queue and insert at head
        const remaining = queueRef.current.filter((f) => !windowFrames.includes(f))
        queueRef.current = [...windowFrames, ...remaining]
        processQueue()
      }
    },
    [processQueue]
  )

  // Master Progressive Preloading Sequence
  useEffect(() => {
    isDestroyed.current = false
    const currentMobile = isMobile

    // Stage 1: Load First Frame (1) immediately
    loadSingleFrame(1, currentMobile, true)
      .then(() => {
        if (isDestroyed.current) return
        isDirtyRef.current = true
        drawFrame()

        // Stage 2: Load Last Frame (150) immediately after
        return loadSingleFrame(TOTAL_FRAMES, currentMobile, true)
      })
      .then(() => {
        if (isDestroyed.current) return

        // Stage 3: Keyframe anchors evenly spaced (every 10th frame: 10, 20, 30... 140)
        const keyframes: number[] = []
        for (let i = 10; i < TOTAL_FRAMES; i += 10) {
          if (!frameCache.current.has(i)) {
            keyframes.push(i)
          }
        }

        // Stage 4: Remaining frames
        const remaining: number[] = []
        for (let i = 2; i < TOTAL_FRAMES; i++) {
          if (!keyframes.includes(i) && !frameCache.current.has(i)) {
            remaining.push(i)
          }
        }

        queueRef.current = [...keyframes, ...remaining]
        processQueue()
      })
      .catch((err) => {
        console.warn('Initial frame loading notice:', err)
      })

    return () => {
      isDestroyed.current = true
    }
  }, [isMobile, loadSingleFrame, processQueue, drawFrame])

  // Update target frame when progress changes (0.0 to 1.0 -> 1 to 150)
  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targetFrameRef.current = progress > 0.5 ? TOTAL_FRAMES : 1
      isDirtyRef.current = true
      return
    }

    // Exact 1 to 150 mapping
    const clampedProgress = Math.max(0, Math.min(1, progress))
    const mapped = Math.round(clampedProgress * (TOTAL_FRAMES - 1)) + 1
    const nextFrame = Math.max(1, Math.min(TOTAL_FRAMES, mapped))

    if (nextFrame !== targetFrameRef.current) {
      targetFrameRef.current = nextFrame
      isDirtyRef.current = true
      prioritizeAroundTarget(nextFrame)
    }
  }, [progress, prioritizeAroundTarget])

  // Animation Frame Loop: only redraws when isDirty is true
  useEffect(() => {
    let active = true

    const loop = () => {
      if (!active) return

      if (isDirtyRef.current || lastDrawnFrameRef.current !== targetFrameRef.current) {
        drawFrame()
      }

      rafIdRef.current = requestAnimationFrame(loop)
    }

    rafIdRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [drawFrame])

  // Setup ResizeObserver for responsive canvas sizing
  useEffect(() => {
    resizeCanvas()

    const container = containerRef.current
    if (!container) return

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        resizeCanvas()
      })
      ro.observe(container)
    }

    const handleWindowResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleWindowResize, { passive: true })

    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [resizeCanvas])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      aria-label="Artisanal momo scroll sequence"
    >
      {/* High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{
          display: 'block',
          willChange: 'transform',
        }}
      />

      {/* Elegant Poster Fallback while initial frame loads */}
      <img
        src="/momo-poster.jpg"
        alt="Handcrafted artisanal momo"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out-custom pointer-events-none z-10 ${
          isFirstFrameReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}
