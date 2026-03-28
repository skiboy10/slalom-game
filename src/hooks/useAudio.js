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

  const playCrowdNoise = useCallback((duration = 3) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    // Create crowd noise using filtered noise bursts
    const createCheerVoice = (delay, pitch) => {
      const noise = audioCtx.createBufferSource()
      const bufferSize = audioCtx.sampleRate * duration
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
      const data = buffer.getChannelData(0)

      // Create modulated noise for crowd effect
      for (let i = 0; i < buffer.length; i++) {
        const t = i / audioCtx.sampleRate
        const envelope = Math.sin(t * Math.PI / duration) // Fade in/out
        const modulation = 0.7 + 0.3 * Math.sin(t * (3 + pitch)) // Varying intensity
        data[i] = (Math.random() * 2 - 1) * envelope * modulation * 0.4
      }
      noise.buffer = buffer

      const filter = audioCtx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 800 + pitch * 200
      filter.Q.value = 0.5

      const gainNode = audioCtx.createGain()
      gainNode.gain.value = 0.15

      noise.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      noise.start(audioCtx.currentTime + delay)
    }

    // Layer multiple "voices" for crowd effect
    for (let i = 0; i < 5; i++) {
      createCheerVoice(Math.random() * 0.2, Math.random() * 3)
    }
  }, [])

  return {
    initAudio,
    playBeep,
    playCarveSound,
    playGateHit,
    playCrowdNoise
  }
}
