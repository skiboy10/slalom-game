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
        audioCtxRef.current = null
      }
    }
  }, [])

  const initAudio = useCallback(() => {
    // Create a new context if we don't have one, or if the old one was closed
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
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

  // Lobby music
  const lobbyNodesRef = useRef(null)

  const startLobbyMusic = useCallback(() => {
    const mc = new (window.AudioContext || window.webkitAudioContext)()
    if (!mc || lobbyNodesRef.current) return

    const BPM = 120
    const beat = 60 / BPM
    const e8 = beat / 2
    const master = mc.createGain(); master.gain.value = 0.55; master.connect(mc.destination)

    // Noise buffer for percussion
    const noise = mc.createBuffer(1, mc.sampleRate * 0.2, mc.sampleRate)
    const nd = noise.getChannelData(0)
    for (let i = 0; i < noise.length; i++) nd[i] = Math.random() * 2 - 1

    // Longer noise buffer for sleigh bells (needs sustained jingle)
    const longNoise = mc.createBuffer(1, mc.sampleRate * 0.5, mc.sampleRate)
    const lnd = longNoise.getChannelData(0)
    for (let i = 0; i < longNoise.length; i++) lnd[i] = Math.random() * 2 - 1

    // --- Instrument buses ---
    const drm = mc.createGain(); drm.gain.value = 0.45; drm.connect(master)   // drums (lighter)
    const agt = mc.createGain(); agt.gain.value = 0.30; agt.connect(master)   // acoustic guitar
    const bas = mc.createGain(); bas.gain.value = 0.28; bas.connect(master)   // bass
    const glk = mc.createGain(); glk.gain.value = 0.18; glk.connect(master)   // glockenspiel/bells melody
    const slb = mc.createGain(); slb.gain.value = 0.14; slb.connect(master)   // sleigh bells
    const pad = mc.createGain(); pad.gain.value = 0.14; pad.connect(master)   // warm synth pad
    const fid = mc.createGain(); fid.gain.value = 0.22; fid.connect(master)   // fiddle/strings melody

    // ========== INSTRUMENT DEFINITIONS ==========

    // --- Kick (softer, rounder) ---
    function K(t) {
      const o = mc.createOscillator(), g = mc.createGain()
      o.connect(g); g.connect(drm)
      o.frequency.setValueAtTime(120, t)
      o.frequency.exponentialRampToValueAtTime(40, t + 0.08)
      g.gain.setValueAtTime(0.7, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
      o.start(t); o.stop(t + 0.12)
    }

    // --- Snare/brush (soft brush swish, not a hard crack) ---
    function S(t) {
      const s = mc.createBufferSource(); s.buffer = noise
      const bp = mc.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 0.8
      const g = mc.createGain()
      g.gain.setValueAtTime(0.4, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.1)
      s.connect(bp); bp.connect(g); g.connect(drm)
      s.start(t); s.stop(t + 0.1)
    }

    // --- Hi-hat (light closed) ---
    function H(t) {
      const s = mc.createBufferSource(); s.buffer = noise
      const hp = mc.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 9000
      const g = mc.createGain()
      g.gain.setValueAtTime(0.1, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.02)
      s.connect(hp); hp.connect(g); g.connect(drm)
      s.start(t); s.stop(t + 0.025)
    }

    // --- Sleigh bells (jingly, wintery!) ---
    function SLB(t) {
      // Multiple quick noise bursts with very high pass = metallic jingle
      for (let j = 0; j < 3; j++) {
        const s = mc.createBufferSource(); s.buffer = noise
        const hp = mc.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 8000
        const pk = mc.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 12000; pk.gain.value = 10; pk.Q.value = 3
        const g = mc.createGain()
        const jt = t + j * 0.03
        g.gain.setValueAtTime(0.5, jt)
        g.gain.exponentialRampToValueAtTime(0.01, jt + 0.04)
        s.connect(hp); hp.connect(pk); pk.connect(g); g.connect(slb)
        s.start(jt); s.stop(jt + 0.05)
      }
    }

    // --- Sleigh bell sustained shake (for fills) ---
    function SLBSHAKE(t, dur) {
      const steps = Math.floor(dur / 0.06)
      for (let j = 0; j < steps; j++) {
        const s = mc.createBufferSource(); s.buffer = noise
        const hp = mc.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 9000
        const pk = mc.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 12000; pk.gain.value = 8; pk.Q.value = 4
        const g = mc.createGain()
        const jt = t + j * 0.06
        const env = 1 - (j / steps) * 0.5
        g.gain.setValueAtTime(0.3 * env, jt)
        g.gain.exponentialRampToValueAtTime(0.01, jt + 0.04)
        s.connect(hp); hp.connect(pk); pk.connect(g); g.connect(slb)
        s.start(jt); s.stop(jt + 0.05)
      }
    }

    // --- Acoustic guitar strum (triangle waves for warmth, multiple strings) ---
    function STRUM(t, freqs, dur, direction) {
      // freqs: array of frequencies (chord voicing)
      // direction: 1 = down strum, -1 = up strum
      const strumDelay = 0.012 // delay between strings
      const ordered = direction === 1 ? freqs : [...freqs].reverse()
      ordered.forEach((f, i) => {
        const st = t + i * strumDelay
        const o = mc.createOscillator()
        o.type = 'triangle'
        o.frequency.value = f
        // Slight random detune for natural feel
        o.detune.value = (Math.random() - 0.5) * 6
        const g = mc.createGain()
        g.gain.setValueAtTime(0.35, st)
        g.gain.setTargetAtTime(0.15, st, dur * 0.1)
        g.gain.setTargetAtTime(0.01, st + dur * 0.7, dur * 0.15)
        o.connect(g); g.connect(agt)
        o.start(st); o.stop(st + dur)
      })
    }

    // --- Acoustic guitar single note (fingerpick) ---
    function PICK(t, freq, dur) {
      const o = mc.createOscillator()
      o.type = 'triangle'
      o.frequency.value = freq
      const g = mc.createGain()
      g.gain.setValueAtTime(0.3, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + dur)
      o.connect(g); g.connect(agt)
      o.start(t); o.stop(t + dur)
    }

    // --- Bass (warm round tone) ---
    function B(t, freq, dur) {
      const o = mc.createOscillator()
      o.type = 'sine'
      const lp = mc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400
      const g = mc.createGain()
      g.gain.setValueAtTime(0.5, t)
      g.gain.setTargetAtTime(0.2, t, dur * 0.3)
      g.gain.setTargetAtTime(0.01, t + dur * 0.8, dur * 0.1)
      o.frequency.value = freq
      o.connect(lp); lp.connect(g); g.connect(bas)
      o.start(t); o.stop(t + dur)
    }

    // --- Glockenspiel / bright mallet (sparkly melody) ---
    function GLOCK(t, freq, dur) {
      // Sine with fast decay = bell-like tone
      const o = mc.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq
      // Add a quiet overtone for shimmer
      const o2 = mc.createOscillator()
      o2.type = 'sine'
      o2.frequency.value = freq * 3 // 3rd harmonic for bell character
      const g = mc.createGain()
      g.gain.setValueAtTime(0.45, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + dur)
      const g2 = mc.createGain()
      g2.gain.setValueAtTime(0.12, t)
      g2.gain.exponentialRampToValueAtTime(0.01, t + dur * 0.6)
      o.connect(g); g.connect(glk)
      o2.connect(g2); g2.connect(glk)
      o.start(t); o.stop(t + dur)
      o2.start(t); o2.stop(t + dur * 0.6 + 0.01)
    }

    // --- Fiddle / strings (sine with gentle vibrato, legato feel) ---
    function FID(t, freq, dur) {
      const o = mc.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq
      // Vibrato
      const vib = mc.createOscillator(), vg = mc.createGain()
      vib.type = 'sine'; vib.frequency.value = 5
      vg.gain.value = freq * 0.008
      vib.connect(vg); vg.connect(o.frequency)
      // Warm filter
      const lp = mc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000
      const g = mc.createGain()
      g.gain.setValueAtTime(0.01, t)
      g.gain.setTargetAtTime(0.5, t, 0.04) // smooth attack
      g.gain.setTargetAtTime(0.35, t + 0.05, dur * 0.3)
      g.gain.setTargetAtTime(0.01, t + dur * 0.8, dur * 0.1)
      o.connect(lp); lp.connect(g); g.connect(fid)
      o.start(t); o.stop(t + dur + 0.05)
      vib.start(t); vib.stop(t + dur + 0.05)
    }

    // --- Warm synth pad (cozy background) ---
    function PAD(t, freq, dur) {
      ;[freq, freq * 1.003, freq * 0.997].forEach(f => {
        const o = mc.createOscillator()
        o.type = 'sine'
        o.frequency.value = f
        const lp = mc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900
        const g = mc.createGain()
        g.gain.setValueAtTime(0.01, t)
        g.gain.setTargetAtTime(0.25, t, dur * 0.2)
        g.gain.setTargetAtTime(0.01, t + dur * 0.65, dur * 0.25)
        o.connect(lp); lp.connect(g); g.connect(pad)
        o.start(t); o.stop(t + dur + 0.1)
      })
    }

    // --- Cymbal swell (for section transitions) ---
    function SWELL(t, dur) {
      const s = mc.createBufferSource(); s.buffer = longNoise
      const bp = mc.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 6000; bp.Q.value = 0.4
      const g = mc.createGain()
      g.gain.setValueAtTime(0.01, t)
      g.gain.setTargetAtTime(0.4, t, dur * 0.3)
      g.gain.setTargetAtTime(0.01, t + dur * 0.7, dur * 0.15)
      s.connect(bp); bp.connect(g); g.connect(drm)
      s.start(t); s.stop(t + dur)
    }

    // ========== "SKI LODGE SERENADE" ==========
    // Key: D major, 120 BPM. Bright, adventurous, wintery!
    // D3=146.8  E3=164.8  F#3=185  G3=196  A3=220  B3=246.9
    // D4=293.7  E4=329.6  F#4=370  G4=392  A4=440  B4=493.9
    // D5=587.3  E5=659.3  F#5=740  G5=784  A5=880

    // Chord voicings for acoustic guitar strums (open-string style)
    const chD  = [146.8, 220, 293.7, 370]       // D major
    const chG  = [196, 246.9, 293.7, 392]        // G major
    const chA  = [220, 277.2, 329.6, 440]        // A major
    const chBm = [246.9, 293.7, 370, 493.9]      // Bm
    const chEm = [164.8, 246.9, 329.6, 392]      // Em

    // 16-bar loop divided into 4 sections of 4 bars each
    // Section A (bars 0-3):  D - G - D - A        (bright intro/verse)
    // Section B (bars 4-7):  G - A - Bm - G       (building/adventurous)
    // Section C (bars 8-11): Em - G - D - A        (reflective then upward)
    // Section D (bars 12-15): G - A - D - D        (triumphant resolve)

    const chordMap = [
      chD, chG, chD, chA,       // Section A
      chG, chA, chBm, chG,     // Section B
      chEm, chG, chD, chA,     // Section C
      chG, chA, chD, chD,      // Section D
    ]

    // Bass roots per bar
    const bassRoots = [
      146.8, 98, 146.8, 110,      // A: D G D A (G bass = G2=98)
      98, 110, 123.5, 98,          // B: G A Bm G (Bm bass = B2=123.5)
      82.4, 98, 146.8, 110,        // C: Em G D A (Em bass = E2=82.4)
      98, 110, 146.8, 146.8,       // D: G A D D
    ]

    // Strum patterns per bar: [beatOffset, direction, duration]
    // Pattern 1: down-up-down-up (folksy drive)
    const strumA = [
      [0, 1, beat*0.9], [beat*0.75, -1, beat*0.4],
      [beat*1.5, 1, beat*0.9], [beat*2.25, -1, beat*0.4],
      [beat*3, 1, beat*0.6], [beat*3.5, -1, beat*0.4]
    ]
    // Pattern 2: syncopated folk (lighter)
    const strumB = [
      [0, 1, beat*1.2], [beat, -1, beat*0.3],
      [beat*1.75, 1, beat*0.6], [beat*2.5, -1, beat*0.3],
      [beat*3, 1, beat*0.9]
    ]

    const strumPatterns = [
      strumA, strumA, strumA, strumB,   // A
      strumA, strumA, strumB, strumB,   // B
      strumB, strumA, strumA, strumA,   // C
      strumA, strumA, strumB, strumA,   // D
    ]

    // Bass pattern per bar: [eighthIndex, durationInEighths]
    // Walking feel with root and fifth
    const bassPatterns = [
      [[0,2],[2,1],[3,1],[4,2],[6,2]],  // root-root-5th-root-root-root
      [[0,2],[2,2],[4,1],[5,1],[6,2]],  // root-root-root-5th-root
      [[0,3],[3,1],[4,2],[6,2]],        // long-short-root-root
      [[0,2],[2,1],[3,1],[4,2],[6,1],[7,1]], // walking
    ]

    // Glockenspiel melody - bright pentatonic adventure theme!
    // [freq, startEighth, durationEighths]
    const glockMelody = [
      // Section A: cheerful ascending theme
      [[587.3,0,2],[659.3,2,1],[740,3,3],[659.3,6,2]],                          // bar0: D5 E5 F#5~ E5
      [[784,0,2],[740,2,2],[587.3,4,2],[659.3,6,2]],                            // bar1: G5 F#5 D5 E5
      [[740,0,3],[659.3,3,1],[587.3,4,2],[440,6,2]],                            // bar2: F#5~ E5 D5 A4
      [[587.3,0,2],[659.3,2,2],[740,4,4]],                                       // bar3: D5 E5 F#5~~~

      // Section B: building excitement
      [[784,0,2],[880,2,2],[784,4,2],[740,6,2]],                                // bar4: G5 A5 G5 F#5
      [[880,0,3],[784,3,1],[740,4,2],[659.3,6,2]],                              // bar5: A5~ G5 F#5 E5
      [[587.3,0,2],[493.9,2,2],[587.3,4,2],[740,6,2]],                          // bar6: D5 B4 D5 F#5
      [[784,0,4],[740,4,2],[659.3,6,2]],                                        // bar7: G5~~~ F#5 E5

      // Section C: reflective then rising
      [[659.3,0,2],[587.3,2,2],[493.9,4,4]],                                    // bar8: E5 D5 B4~~~
      [[587.3,0,2],[659.3,2,2],[784,4,2],[880,6,2]],                            // bar9: D5 E5 G5 A5
      [[740,0,3],[659.3,3,1],[587.3,4,4]],                                      // bar10: F#5~ E5 D5~~~
      [[659.3,0,2],[740,2,2],[880,4,4]],                                        // bar11: E5 F#5 A5~~~

      // Section D: triumphant resolution
      [[784,0,1],[880,1,1],[784,2,2],[740,4,2],[659.3,6,2]],                    // bar12: G5 A5 G5 F#5 E5
      [[880,0,2],[784,2,1],[740,3,1],[659.3,4,2],[587.3,6,2]],                  // bar13: A5 G5 F#5 E5 D5
      [[740,0,2],[880,2,2],[740,4,4]],                                           // bar14: F#5 A5 F#5~~~
      [[587.3,0,2],[740,2,2],[587.3,4,4]],                                       // bar15: D5 F#5 D5~~~ (home)
    ]

    // Fiddle counter-melody (plays in sections B and D for variation)
    // [freq, startEighth, durationEighths]
    const fiddleParts = [
      // Section A: rest (let glock carry)
      null, null, null, null,
      // Section B: harmony below the glock
      [[392,0,3],[370,3,1],[293.7,4,4]],                                        // bar4
      [[440,0,2],[392,2,2],[370,4,4]],                                          // bar5
      [[293.7,0,2],[370,2,2],[293.7,4,4]],                                      // bar6
      [[392,0,4],[370,4,2],[329.6,6,2]],                                        // bar7
      // Section C: rest
      null, null, null, null,
      // Section D: soaring harmony
      [[392,0,2],[440,2,2],[392,4,2],[370,6,2]],                                // bar12
      [[440,0,2],[392,2,2],[370,4,2],[293.7,6,2]],                              // bar13
      [[370,0,2],[440,2,2],[370,4,4]],                                           // bar14
      [[293.7,0,4],[370,2,2],[293.7,4,4]],                                       // bar15
    ]

    // Pad notes per bar [freq, startBeat, durBeats]
    const padNotes = [
      [[146.8,0,4]],  [[196,0,4]],   [[146.8,0,4]], [[220,0,4]],     // A
      [[196,0,4]],    [[220,0,4]],   [[246.9,0,4]], [[196,0,4]],     // B
      [[164.8,0,4]], [[196,0,4]],   [[146.8,0,4]], [[220,0,4]],     // C
      [[196,0,4]],    [[220,0,4]],   [[146.8,0,4]], [[146.8,0,4]],   // D
    ]

    let bar = 0

    function tick() {
      try {
        const t0 = mc.currentTime + 0.05
        const bi = bar % 16
        const section = Math.floor(bi / 4) // 0=A, 1=B, 2=C, 3=D

        // --- Cymbal swell on section transitions ---
        if (bi === 0 || bi === 8) SWELL(t0, beat * 1.5)

        // --- Sleigh bells on every beat ---
        for (let i = 0; i < 4; i++) {
          SLB(t0 + i * beat)
        }
        // Extra sleigh bell shake on bar transitions (last beat, sections B & D)
        if ((section === 1 || section === 3) && (bi % 4 === 3)) {
          SLBSHAKE(t0 + beat * 3, beat * 0.8)
        }

        // --- Drums (light folk pattern) ---
        for (let i = 0; i < 8; i++) {
          const t = t0 + i * e8
          // Hi-hat on every eighth (light)
          H(t)
          // Kick on 1 and 3
          if (i === 0 || i === 4) K(t)
          // Brush snare on 2 and 4
          if (i === 2 || i === 6) S(t)
        }

        // --- Acoustic guitar strums ---
        const chord = chordMap[bi]
        const sp = strumPatterns[bi]
        sp.forEach(([offset, dir, dur]) => {
          STRUM(t0 + offset, chord, dur, dir)
        })

        // --- Fingerpick accent on some bars (arpeggiated chord tones) ---
        if (bi % 4 === 0 || bi % 4 === 2) {
          // Quick arpeggio before the bar
          chord.forEach((f, idx) => {
            PICK(t0 + beat * 3.5 + idx * 0.04, f * 2, beat * 0.4)
          })
        }

        // --- Bass ---
        const root = bassRoots[bi]
        const fifth = root * 1.5
        const bpat = bassPatterns[bi % 4]
        bpat.forEach(([ei, dur]) => {
          // Alternate root and fifth for walking feel
          const freq = (ei === 2 || ei === 5) ? fifth : root
          B(t0 + ei * e8, freq, dur * e8 * 0.85)
        })

        // --- Glockenspiel melody ---
        const gm = glockMelody[bi]
        if (gm) {
          gm.forEach(([freq, startE, durE]) => {
            GLOCK(t0 + startE * e8, freq, durE * e8)
          })
        }

        // --- Fiddle (sections B and D only) ---
        const fp = fiddleParts[bi]
        if (fp) {
          fp.forEach(([freq, startE, durE]) => {
            FID(t0 + startE * e8, freq, durE * e8)
          })
        }

        // --- Warm pad ---
        const pn = padNotes[bi]
        if (pn) {
          pn.forEach(([f, sb, d]) => PAD(t0 + sb * beat, f, d * beat))
        }

        bar++
      } catch (e) {
        console.error('[MUSIC]', e)
      }
    }

    tick()
    const loopId = setInterval(tick, beat * 4 * 1000)
    lobbyNodesRef.current = { masterGain: master, loopId, musicCtx: mc }
  }, [])

  const stopLobbyMusic = useCallback(() => {
    if (!lobbyNodesRef.current) return
    const { masterGain, loopId, musicCtx } = lobbyNodesRef.current

    if (loopId) clearInterval(loopId)

    if (musicCtx && masterGain) {
      try {
        masterGain.gain.setTargetAtTime(0, musicCtx.currentTime, 0.15)
        setTimeout(() => { try { musicCtx.close() } catch {} }, 300)
      } catch {}
    }

    lobbyNodesRef.current = null
  }, [])

  const playComboTick = useCallback((comboCount) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    const frequency = Math.min(300 + comboCount * 20, 900)
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.08)
  }, [])

  const playComboMilestone = useCallback((tier) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx) return

    const now = audioCtx.currentTime

    if (tier === 'legendary') {
      // Dramatic ascending sweep 200Hz → 1200Hz over 0.5s
      const osc = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      osc.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5)
      gainNode.gain.setValueAtTime(0.25, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.55)
      osc.start(now)
      osc.stop(now + 0.55)

      // Noise burst at the peak
      const noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate)
      const data = noiseBuf.getChannelData(0)
      for (let i = 0; i < noiseBuf.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4
      }
      const noise = audioCtx.createBufferSource()
      noise.buffer = noiseBuf
      const filter = audioCtx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 4000
      filter.Q.value = 0.5
      const noiseGain = audioCtx.createGain()
      noiseGain.gain.setValueAtTime(0.3, now + 0.4)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(audioCtx.destination)
      noise.start(now + 0.4)

    } else if (tier === 'fire') {
      // Three-note power chord: E4 + B4 + E5, triangle wave
      const freqs = [329.63, 493.88, 659.25]
      freqs.forEach((freq) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        osc.type = 'triangle'
        osc.frequency.value = freq
        gainNode.gain.setValueAtTime(0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      })

    } else if (tier === 'hot') {
      // Two-note ascending chime: C5 → E5, sine wave
      const notes = [523.25, 659.25]
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const startTime = now + i * 0.15
        gainNode.gain.setValueAtTime(0.18, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
        osc.start(startTime)
        osc.stop(startTime + 0.15)
      })
    }
  }, [])

  const playComboBreak = useCallback((prevCombo) => {
    const audioCtx = audioCtxRef.current
    if (!audioCtx || prevCombo < 5) return

    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    osc.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15)
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 0.15)
  }, [])

  return {
    initAudio,
    playBeep,
    playCarveSound,
    playGateHit,
    playCrowdNoise,
    playComboTick,
    playComboMilestone,
    playComboBreak,
    startLobbyMusic,
    stopLobbyMusic
  }
}
