import { useRef, useEffect, useCallback } from 'react'

const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || window.webkitAudioContext)()
  }
  return null
}

export function useAudio() {
  const audioCtxRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playBeep = useCallback((frequency, duration, volume = 0.3) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + duration)
  }, [])

  const playCarveSound = useCallback((intensity) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    const noise = audioCtx.createBufferSource()
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    noise.buffer = buffer

    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 800 + intensity * 400

    const gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.1 + intensity * 0.15

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    noise.start()
  }, [])

  const playGateHit = useCallback(() => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1)
    oscillator.type = 'square'
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.15)
  }, [])

  return {
    initAudio,
    playBeep,
    playCarveSound,
    playGateHit
  }
}
