import React, { useState, useEffect, useCallback, useRef } from 'react';

const GAME_HEIGHT = 600;
const GAME_WIDTH = 400;
const SKIER_Y = 480;
const GATE_SPAWN_Y = -50;
const OPTIMAL_HIT_Y = 330;
const GATE_Y = 430;

const PERFECT_WINDOW = 25;
const GOOD_WINDOW = 50;
const LATE_WINDOW = 90;

const INITIAL_SPEED = 2.5;
const MAX_SPEED = 8;
const ACCELERATION = 0.008;
const TURN_DECELERATION = 0.15;

const MIN_GATE_SPACING = 130;
const MAX_GATE_SPACING = 200;

const SKIER_CENTER_X = GAME_WIDTH / 2;
const LEFT_POSITION = GAME_WIDTH * 0.22;
const RIGHT_POSITION = GAME_WIDTH * 0.78;

const TOTAL_GATES = 20;

// Audio context for sound effects
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
  return null;
};

// Sound effect generators
const playBeep = (audioCtx, frequency, duration, volume = 0.3) => {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
};

const playCarveSound = (audioCtx, intensity) => {
  if (!audioCtx) return;
  const noise = audioCtx.createBufferSource();
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < buffer.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800 + intensity * 400;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.1 + intensity * 0.15;
  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noise.start();
};

const playGateHit = (audioCtx) => {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
  oscillator.type = 'square';
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.15);
};

// Generate snow particles
const generateSnowParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    speed: 0.5 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.5
  }));
};

const generateSparkles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.5
  }));
};

const generateTrees = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.2 - 50,
    size: 0.4 + Math.random() * 0.4,
    offset: Math.random() * 15
  }));
};

const generateCrowd = (count) => {
  const jacketColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
  const hatColors = ['#1f2937', '#dc2626', '#1d4ed8', '#047857', '#7c3aed', '#be185d'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: (i / count) * GAME_HEIGHT * 1.5 - 100,
    xOffset: Math.random() * 20,
    jacketColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    hatColor: hatColors[Math.floor(Math.random() * hatColors.length)],
    hasHat: Math.random() > 0.3,
    hasScarf: Math.random() > 0.5,
    scarfColor: jacketColors[Math.floor(Math.random() * jacketColors.length)],
    height: 0.7 + Math.random() * 0.3,
    armRaise: Math.random(),
    cheerOffset: Math.random() * Math.PI * 2,
  }));
};

const SPARKLES = generateSparkles(40);
const LEFT_TREES = generateTrees(6);
const RIGHT_TREES = generateTrees(6);
const LEFT_CROWD = generateCrowd(15);
const RIGHT_CROWD = generateCrowd(15);

// Spectator Component
const Spectator = ({ x, y, data, cheering, globalCheerPhase }) => {
  const cheerAmount = cheering ? Math.sin(globalCheerPhase + data.cheerOffset) * 0.5 + 0.5 : 0;
  const armAngle = cheering ? -45 - cheerAmount * data.armRaise * 60 : -20;
  const bodyBob = cheering ? Math.sin(globalCheerPhase * 2 + data.cheerOffset) * 2 : 0;
  
  return (
    <g transform={`translate(${x + data.xOffset}, ${y + bodyBob}) scale(${data.height})`}>
      <ellipse cx="0" cy="32" rx="6" ry="2" fill="rgba(0,0,0,0.15)" />
      <rect x="-4" y="18" width="3" height="12" rx="1" fill="#1f2937" />
      <rect x="1" y="18" width="3" height="12" rx="1" fill="#1f2937" />
      <path 
        d="M -6 5 Q -8 12 -6 18 L 6 18 Q 8 12 6 5 Q 3 2 0 2 Q -3 2 -6 5 Z"
        fill={data.jacketColor}
      />
      {data.hasScarf && (
        <ellipse cx="0" cy="3" rx="5" ry="2" fill={data.scarfColor} />
      )}
      <circle cx="0" cy="-2" r="5" fill="#FDBF94" />
      <circle cx="-1.5" cy="-3" r="0.8" fill="#1f2937" />
      <circle cx="1.5" cy="-3" r="0.8" fill="#1f2937" />
      {cheering ? (
        <ellipse cx="0" cy="1" rx="1.5" ry="1.5" fill="#1f2937" />
      ) : (
        <path d="M -1.5 1 Q 0 2 1.5 1" fill="none" stroke="#1f2937" strokeWidth="0.8" />
      )}
      {data.hasHat && (
        <>
          <ellipse cx="0" cy="-5" rx="6" ry="2" fill={data.hatColor} />
          <path d="M -5 -5 Q -5 -10 0 -11 Q 5 -10 5 -5" fill={data.hatColor} />
          <circle cx="0" cy="-12" r="2" fill="white" />
        </>
      )}
      <g transform={`rotate(${armAngle}, -6, 8)`}>
        <rect x="-9" y="6" width="4" height="10" rx="2" fill={data.jacketColor} />
      </g>
      <g transform={`rotate(${-armAngle}, 6, 8) scale(-1, 1)`}>
        <rect x="-9" y="6" width="4" height="10" rx="2" fill={data.jacketColor} />
      </g>
    </g>
  );
};

// Compact Skier Component
const Skier = ({ lean, x }) => {
  const bodyTilt = lean * 25;
  const hipShift = lean * 4;
  const armBalance = lean * 18;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: SKIER_Y,
        left: x,
        transform: `translateX(-50%)`,
        overflow: 'visible',
        width: 70,
        height: 80,
      }}
      viewBox="-35 -65 70 80"
    >
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBF94" />
          <stop offset="100%" stopColor="#E8A878" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
      
      <ellipse cx={lean * 2} cy="10" rx={14 + Math.abs(lean) * 2} ry="4" fill="rgba(0,0,0,0.2)" />
      
      <g transform={`rotate(${bodyTilt})`}>
        {/* Skis */}
        <g transform={`skewX(${lean * -10})`}>
          <rect x="-28" y="2" width="48" height="4" rx="2" fill="#1f2937" />
          <rect x="4" y="2" width="48" height="4" rx="2" fill="#1f2937" />
        </g>
        
        {/* Boots */}
        <rect x="-8" y="-8" width="7" height="10" rx="2" fill="#374151" />
        <rect x="1" y="-8" width="7" height="10" rx="2" fill="#374151" />
        
        {/* Legs */}
        <g transform={`translate(${hipShift * 0.5}, 0)`}>
          <rect x="-7" y="-22" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
          <rect x="1" y="-22" width="6" height="16" rx="2" fill="url(#pantsGrad)" />
        </g>
        
        {/* Torso */}
        <g transform={`translate(${hipShift}, -28)`}>
          <path 
            d="M -8 16 Q -10 8 -7 0 Q -4 -6 0 -8 Q 4 -6 7 0 Q 10 8 8 16 Q 4 18 0 18 Q -4 18 -8 16 Z"
            fill="url(#suitGrad)"
          />
          <rect x="-5" y="2" width="10" height="10" rx="1" fill="white" />
          <text x="0" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#111" fontFamily="Arial">42</text>
        </g>
        
        {/* Arms/Poles */}
        <g transform={`translate(-8, -36) rotate(${-35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="10" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="6" y2="45" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="6" cy="42" r="3" fill="none" stroke="#666" strokeWidth="1" />
        </g>
        <g transform={`translate(8, -36) rotate(${35 + armBalance})`}>
          <rect x="-2" y="0" width="4" height="10" rx="2" fill="url(#suitGrad)" />
          <line x1="0" y1="10" x2="-6" y2="45" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="-6" cy="42" r="3" fill="none" stroke="#666" strokeWidth="1" />
        </g>
        
        {/* Head */}
        <g transform={`translate(${hipShift * 0.2}, -44)`}>
          <ellipse cx="0" cy="0" rx="8" ry="7" fill="url(#helmetGrad)" />
          <path d="M -7 1 Q -8 -1 -6 -3 Q 0 -5 6 -3 Q 8 -1 7 1 Q 6 3 0 4 Q -6 3 -7 1 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
        </g>
      </g>
    </svg>
  );
};

// Gate Component
const SlalomGate = ({ x, y, side, hit, hitTime }) => {
  const isLeft = side === 'left';
  const poleColor = isLeft ? '#dc2626' : '#1d4ed8';
  const poleColorLight = isLeft ? '#ef4444' : '#3b82f6';
  
  const timeSinceHit = hit ? Date.now() - hitTime : 0;
  const bendPhase = Math.min(timeSinceHit / 250, 1);
  
  let bendAngle = 0;
  if (hit) {
    if (bendPhase < 0.3) {
      bendAngle = (bendPhase / 0.3) * (isLeft ? 50 : -50);
    } else if (bendPhase < 0.5) {
      bendAngle = isLeft ? 50 : -50;
    } else {
      const returnPhase = (bendPhase - 0.5) / 0.5;
      const overshoot = Math.sin(returnPhase * Math.PI * 2) * (1 - returnPhase) * 12;
      bendAngle = (isLeft ? 50 : -50) * (1 - returnPhase) + overshoot;
    }
  }
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -100%)',
        overflow: 'visible',
        width: 80,
        height: 85,
      }}
      viewBox="-40 -80 80 85"
    >
      <ellipse cx={bendAngle * 0.2} cy={6} rx={12} ry={4} fill="rgba(0,0,0,0.15)" />
      
      <g>
        <ellipse cx="0" cy="1" rx="8" ry="3" fill="#6b7280" />
        <rect x="-3" y="-5" width="6" height="6" rx="1" fill="#374151" />
      </g>
      
      <g style={{ transformOrigin: '0px -2px', transform: `rotate(${bendAngle}deg)` }}>
        <rect x="-2.5" y="-75" width="5" height="73" rx="2.5" fill={poleColor} />
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="-2.5" y={-75 + i * 18} width="5" height="7" fill="white" opacity="0.9" />
        ))}
        
        <g transform={`translate(${isLeft ? 4 : -28}, -70)`}>
          <rect x="0" y="0" width="24" height="16" rx="2" fill={poleColorLight} />
          <rect x="1" y="1" width="22" height="14" rx="1" fill={isLeft ? '#fecaca' : '#bfdbfe'} />
        </g>
      </g>
    </svg>
  );
};

// Format time as MM:SS.ss
const formatTime = (ms) => {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
};

// Format split time difference
const formatSplit = (diff) => {
  const prefix = diff >= 0 ? '+' : '';
  return `${prefix}${diff.toFixed(2)}`;
};

export default function SlalomTrainer() {
  const [gameState, setGameState] = useState('start'); // start, countdown, playing, finished, gameOver
  const [countdownValue, setCountdownValue] = useState(3);
  const [gates, setGates] = useState([]);
  const [gateCount, setGateCount] = useState(0);
  const [gatesCleared, setGatesCleared] = useState(0);
  const [misses, setMisses] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [groundOffset, setGroundOffset] = useState(0);
  const [raceTime, setRaceTime] = useState(0);
  const [splitTimes, setSplitTimes] = useState([]);
  const [lastSplit, setLastSplit] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  
  const [skierX, setSkierX] = useState(SKIER_CENTER_X);
  const [skierLean, setSkierLean] = useState(0);
  const [skierTrail, setSkierTrail] = useState([]);
  const [carvePhase, setCarvePhase] = useState(null);
  
  const [crowdCheering, setCrowdCheering] = useState(false);
  const [cheerPhase, setCheerPhase] = useState(0);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 });
  const [snowParticles, setSnowParticles] = useState(() => generateSnowParticles(30));
  const [lastFeedback, setLastFeedback] = useState(null);
  
  const audioCtxRef = useRef(null);
  const gameLoopRef = useRef(null);
  const carveAnimationRef = useRef(null);
  const raceStartTimeRef = useRef(null);
  const lastGateSpawnRef = useRef(0);
  const nextGateSideRef = useRef('left');
  const nextGateSpacingRef = useRef(150);
  const gateIdRef = useRef(0);
  const cheerTimeoutRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Countdown sequence
  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    
    if (countdownValue > 0) {
      playBeep(audioCtxRef.current, 440, 0.2, 0.3);
      const timer = setTimeout(() => setCountdownValue(countdownValue - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      playBeep(audioCtxRef.current, 880, 0.4, 0.4);
      raceStartTimeRef.current = Date.now();
      setGameState('playing');
    }
  }, [gameState, countdownValue]);

  // Update race time
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setRaceTime(Date.now() - raceStartTimeRef.current);
    }, 10);
    
    return () => clearInterval(timer);
  }, [gameState]);

  // Animate cheering
  useEffect(() => {
    if (!crowdCheering) return;
    
    let animationId;
    const animateCheer = () => {
      setCheerPhase(prev => prev + 0.15);
      animationId = requestAnimationFrame(animateCheer);
    };
    
    animationId = requestAnimationFrame(animateCheer);
    return () => cancelAnimationFrame(animationId);
  }, [crowdCheering]);

  // Snow particle animation
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const animateSnow = () => {
      setSnowParticles(particles => 
        particles.map(p => ({
          ...p,
          y: (p.y + p.speed + speed * 0.5) % GAME_HEIGHT,
          x: p.x + p.drift + (skierLean * 0.3)
        }))
      );
    };
    
    const interval = setInterval(animateSnow, 50);
    return () => clearInterval(interval);
  }, [gameState, speed, skierLean]);

  // Camera shake decay
  useEffect(() => {
    if (cameraShake.x === 0 && cameraShake.y === 0) return;
    
    const decay = () => {
      setCameraShake(prev => ({
        x: prev.x * 0.85,
        y: prev.y * 0.85
      }));
    };
    
    const timer = setTimeout(decay, 16);
    return () => clearTimeout(timer);
  }, [cameraShake]);

  // Carve animation
  useEffect(() => {
    if (!carvePhase) return;
    
    const animateCarve = () => {
      setCarvePhase(prev => {
        if (!prev) return null;
        
        const newProgress = prev.progress + 0.03;
        
        if (newProgress >= 1) {
          if (prev.phase === 'approach') {
            return {
              phase: 'gate',
              startX: prev.targetX,
              targetX: prev.gateX + (prev.gateSide === 'left' ? 20 : -20),
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX
            };
          } else if (prev.phase === 'gate') {
            return {
              phase: 'exit',
              startX: prev.targetX,
              targetX: prev.exitX,
              progress: 0,
              gateX: prev.gateX,
              gateSide: prev.gateSide,
              exitX: prev.exitX
            };
          } else {
            return null;
          }
        }
        
        return { ...prev, progress: newProgress };
      });
      
      carveAnimationRef.current = requestAnimationFrame(animateCarve);
    };
    
    carveAnimationRef.current = requestAnimationFrame(animateCarve);
    return () => {
      if (carveAnimationRef.current) cancelAnimationFrame(carveAnimationRef.current);
    };
  }, [carvePhase?.phase]);

  // Update skier position from carve
  useEffect(() => {
    if (!carvePhase) return;
    
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easedProgress = easeInOutCubic(carvePhase.progress);
    const newX = carvePhase.startX + (carvePhase.targetX - carvePhase.startX) * easedProgress;
    
    setSkierX(newX);
    
    const direction = carvePhase.targetX - carvePhase.startX;
    const leanIntensity = carvePhase.phase === 'gate' ? 1.3 : 0.7;
    setSkierLean(Math.sign(direction) * leanIntensity);
    
    // Play carve sound
    if (Math.abs(direction) > 5 && carvePhase.progress < 0.1) {
      playCarveSound(audioCtxRef.current, Math.abs(leanIntensity));
    }
    
    if (gameState === 'playing') {
      setSkierTrail(trail => {
        const newPoint = { x: newX, y: SKIER_Y, age: 0 };
        return [...trail, newPoint]
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < 35)
          .slice(-35);
      });
    }
  }, [carvePhase, gameState]);

  useEffect(() => {
    if (!carvePhase) setSkierLean(prev => prev * 0.9);
  }, [carvePhase]);

  // Handle input
  const handleInput = useCallback((inputSide) => {
    if (gameState !== 'playing') return;
    
    setGates(prev => {
      const updated = [...prev];
      
      const targetGate = updated.find(g => 
        !g.hit && 
        g.side === inputSide && 
        g.y > OPTIMAL_HIT_Y - LATE_WINDOW && 
        g.y < GATE_Y + 25
      );
      
      if (targetGate) {
        targetGate.hit = true;
        targetGate.hitTime = Date.now();
        
        playGateHit(audioCtxRef.current);
        setCameraShake({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 4 });
        
        const isLeftGate = inputSide === 'left';
        const approachX = isLeftGate ? RIGHT_POSITION : LEFT_POSITION;
        const exitX = isLeftGate ? LEFT_POSITION : RIGHT_POSITION;
        
        setCarvePhase({
          phase: 'approach',
          startX: skierX,
          targetX: approachX,
          progress: 0,
          gateX: targetGate.x,
          gateSide: inputSide,
          exitX: exitX
        });
        
        // Slow down during turn
        setSpeed(prev => Math.max(INITIAL_SPEED, prev - TURN_DECELERATION));
        
        const distance = Math.abs(targetGate.y - OPTIMAL_HIT_Y);
        const currentTime = Date.now() - raceStartTimeRef.current;
        
        let timePenalty = 0;
        let feedback = '';
        let feedbackColor = '';
        
        if (distance <= PERFECT_WINDOW) {
          feedback = 'PERFECT';
          feedbackColor = '#22c55e';
          setCrowdCheering(true);
          if (cheerTimeoutRef.current) clearTimeout(cheerTimeoutRef.current);
          cheerTimeoutRef.current = setTimeout(() => setCrowdCheering(false), 1200);
        } else if (distance <= GOOD_WINDOW) {
          timePenalty = 0.15;
          feedback = 'GOOD';
          feedbackColor = '#3b82f6';
        } else if (distance <= LATE_WINDOW) {
          timePenalty = 0.35;
          feedback = distance < OPTIMAL_HIT_Y ? 'EARLY' : 'LATE';
          feedbackColor = '#f59e0b';
        }
        
        setLastFeedback({ text: feedback, color: feedbackColor, penalty: timePenalty, id: Date.now() });
        setGatesCleared(prev => prev + 1);
        
        // Record split time
        const splitTime = currentTime + timePenalty * 1000;
        setSplitTimes(prev => [...prev, splitTime]);
        setLastSplit({ time: splitTime, gate: gatesCleared + 1 });
        
      } else {
        const wobbleX = inputSide === 'left' ? skierX - 15 : skierX + 15;
        setCarvePhase({
          phase: 'exit',
          startX: skierX,
          targetX: wobbleX,
          progress: 0,
          gateX: skierX,
          gateSide: inputSide,
          exitX: skierX
        });
      }
      
      return updated;
    });
  }, [gameState, skierX, gatesCleared]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleInput('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleInput('right');
      } else if (e.key === ' ' && (gameState === 'start' || gameState === 'finished' || gameState === 'gameOver')) {
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, gameState]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const gameLoop = () => {
      setGroundOffset(prev => (prev + speed) % 40);
      
      // Accelerate
      setSpeed(prev => Math.min(MAX_SPEED, prev + ACCELERATION));
      
      setGates(prev => {
        let newMisses = 0;
        
        let updated = prev.map(gate => ({ ...gate, y: gate.y + speed }));
        
        updated = updated.filter(gate => {
          if (!gate.hit && gate.y > GATE_Y + 40) {
            newMisses++;
            return false;
          }
          return gate.y < GAME_HEIGHT + 80;
        });
        
        if (newMisses > 0) {
          setMisses(m => m + newMisses);
          setLastFeedback({ text: 'MISS', color: '#ef4444', penalty: 2.0, id: Date.now() });
        }
        
        // Spawn gates up to TOTAL_GATES
        if (gateCount < TOTAL_GATES) {
          lastGateSpawnRef.current += speed;
          if (lastGateSpawnRef.current >= nextGateSpacingRef.current) {
            const side = nextGateSideRef.current;
            nextGateSideRef.current = side === 'left' ? 'right' : 'left';
            
            const baseX = side === 'left' ? GAME_WIDTH * 0.32 : GAME_WIDTH * 0.68;
            const variation = (Math.random() - 0.5) * 25;
            
            gateIdRef.current += 1;
            
            const newGate = {
              id: gateIdRef.current,
              y: GATE_SPAWN_Y,
              x: baseX + variation,
              side: side,
              hit: false,
              hitTime: null,
              gateNumber: gateCount + 1
            };
            
            updated = [...updated, newGate];
            setGateCount(c => c + 1);
            
            nextGateSpacingRef.current = MIN_GATE_SPACING + Math.random() * (MAX_GATE_SPACING - MIN_GATE_SPACING);
            lastGateSpawnRef.current = 0;
          }
        }
        
        return updated;
      });
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, speed, gateCount]);

  // Check finish/game over
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (misses >= 3) {
      setGameState('gameOver');
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    } else if (gatesCleared >= TOTAL_GATES) {
      const finalTime = Date.now() - raceStartTimeRef.current;
      setRaceTime(finalTime);
      if (!bestTime || finalTime < bestTime) {
        setBestTime(finalTime);
      }
      setGameState('finished');
      setCrowdCheering(true);
      playBeep(audioCtxRef.current, 880, 0.5, 0.4);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [misses, gatesCleared, gameState, bestTime]);

  const startGame = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    
    setGates([]);
    setGateCount(0);
    setGatesCleared(0);
    setMisses(0);
    setSpeed(INITIAL_SPEED);
    setRaceTime(0);
    setSplitTimes([]);
    setLastSplit(null);
    setLastFeedback(null);
    setSkierX(SKIER_CENTER_X);
    setSkierLean(0);
    setSkierTrail([]);
    setCarvePhase(null);
    setGroundOffset(0);
    setCrowdCheering(false);
    setCameraShake({ x: 0, y: 0 });
    setCountdownValue(3);
    lastGateSpawnRef.current = 0;
    nextGateSideRef.current = 'left';
    nextGateSpacingRef.current = 150;
    gateIdRef.current = 0;
    setGameState('countdown');
  };

  const Tree = ({ x, y, size, flipped }) => (
    <g transform={`translate(${x}, ${y}) scale(${flipped ? -size : size}, ${size})`}>
      <ellipse cx="0" cy="40" rx="10" ry="3" fill="rgba(0,0,0,0.1)" />
      <rect x="-2" y="25" width="4" height="12" fill="#5D4037" />
      <polygon points="0,-18 -15,8 15,8" fill="#2E7D32" />
      <polygon points="0,-18 -11,4 11,4" fill="white" opacity="0.35" />
      <polygon points="0,-2 -18,22 18,22" fill="#388E3C" />
      <polygon points="0,-2 -13,16 13,16" fill="white" opacity="0.25" />
      <polygon points="0,12 -20,35 20,35" fill="#43A047" />
    </g>
  );

  const speedKmh = (speed * 12).toFixed(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div 
        className="relative overflow-hidden rounded-lg cursor-pointer select-none"
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`
        }}
        onClick={(e) => {
          if (gameState !== 'playing') return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          handleInput(x < GAME_WIDTH / 2 ? 'left' : 'right');
        }}
      >
        {/* Sky */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 40%, #dbeafe 70%, #f0f9ff 100%)'
        }} />
        
        {/* Mountains */}
        <svg className="absolute top-0 left-0 w-full" style={{ height: 100 }}>
          <polygon points="0,100 40,50 80,75 130,30 180,60 230,40 280,55 340,35 400,100" fill="#94a3b8" opacity="0.6" />
          <polygon points="0,100 60,65 110,45 160,70 210,50 270,60 320,45 400,100" fill="#64748b" opacity="0.5" />
          <polygon points="130,30 120,45 140,45" fill="white" opacity="0.7" />
          <polygon points="230,40 220,52 240,52" fill="white" opacity="0.7" />
          <polygon points="340,35 328,50 352,50" fill="white" opacity="0.7" />
        </svg>
        
        {/* Snow slope */}
        <div className="absolute inset-0" style={{
          top: 70,
          background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 80%, #94a3b8 100%)'
        }} />
        
        {/* Grooming lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: 70 }}>
          {[...Array(18)].map((_, i) => {
            const baseY = i * 40 + groundOffset - 40;
            const scale = 0.25 + (baseY / GAME_HEIGHT) * 0.75;
            const w = GAME_WIDTH * scale;
            const xStart = (GAME_WIDTH - w) / 2;
            return (
              <line key={i} x1={xStart + 50} y1={baseY} x2={xStart + w - 50} y2={baseY}
                stroke="#94a3b8" strokeWidth="1" opacity={0.15 + (baseY / GAME_HEIGHT) * 0.15} />
            );
          })}
        </svg>
        
        {/* Snow sparkles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {SPARKLES.map(s => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.size} fill="white" opacity={s.opacity} />
          ))}
        </svg>
        
        {/* Falling snow */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {snowParticles.map(p => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="white" opacity={0.7} />
          ))}
        </svg>
        
        {/* Trees */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 45, height: GAME_HEIGHT }}>
          {LEFT_TREES.map(tree => {
            const scrollY = (tree.y + groundOffset * 1.8) % (GAME_HEIGHT + 80) - 40;
            return <Tree key={tree.id} x={8 + tree.offset * 0.4} y={scrollY} size={tree.size} flipped={false} />;
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 45, height: GAME_HEIGHT }}>
          {RIGHT_TREES.map(tree => {
            const scrollY = (tree.y + groundOffset * 1.8) % (GAME_HEIGHT + 80) - 40;
            return <Tree key={tree.id} x={37 - tree.offset * 0.4} y={scrollY} size={tree.size} flipped={true} />;
          })}
        </svg>
        
        {/* Crowd */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 55, height: GAME_HEIGHT }}>
          {LEFT_CROWD.map(person => {
            const scrollY = (person.y + groundOffset * 1.3) % (GAME_HEIGHT + 120) - 60;
            return <Spectator key={person.id} x={30} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />;
          })}
        </svg>
        <svg className="absolute right-0 top-0 pointer-events-none" style={{ width: 55, height: GAME_HEIGHT }}>
          {RIGHT_CROWD.map(person => {
            const scrollY = (person.y + groundOffset * 1.3) % (GAME_HEIGHT + 120) - 60;
            return <Spectator key={person.id} x={22} y={scrollY} data={person} cheering={crowdCheering} globalCheerPhase={cheerPhase} />;
          })}
        </svg>
        
        {/* Safety netting */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="48" y1="0" x2="48" y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.7" />
          <line x1={GAME_WIDTH - 48} y1="0" x2={GAME_WIDTH - 48} y2={GAME_HEIGHT} stroke="#f97316" strokeWidth="2" opacity="0.7" />
        </svg>
        
        {/* Timing zone indicator */}
        {gameState === 'playing' && (
          <div className="absolute left-12 right-12 border-t-2 border-dashed" style={{ top: OPTIMAL_HIT_Y, borderColor: 'rgba(34, 197, 94, 0.5)' }} />
        )}
        
        {/* Skier trail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {skierTrail.length > 2 && (
            <>
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x + 1} ${p.y - (skierTrail.length - i) * speed * 0.5 + 1}`).join(' L ')}`}
                fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d={`M ${skierTrail.map((p, i) => `${p.x} ${p.y - (skierTrail.length - i) * speed * 0.5}`).join(' L ')}`}
                fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              />
            </>
          )}
          {Math.abs(skierLean) > 0.5 && [...Array(8)].map((_, i) => (
            <circle key={i}
              cx={skierX + (skierLean * -25) + (Math.random() - 0.5) * 20}
              cy={SKIER_Y + 8 + Math.random() * 15}
              r={2 + Math.random() * 4} fill="white" opacity={0.5 + Math.random() * 0.3}
            />
          ))}
        </svg>
        
        {/* Gates */}
        {gates.map(gate => (
          <SlalomGate key={gate.id} x={gate.x} y={gate.y} side={gate.side} hit={gate.hit} hitTime={gate.hitTime} />
        ))}
        
        {/* Skier */}
        <Skier lean={skierLean} x={skierX} />
        
        {/* Feedback */}
        {lastFeedback && (
          <div key={lastFeedback.id} className="absolute left-1/2 text-2xl font-bold pointer-events-none"
            style={{ top: OPTIMAL_HIT_Y - 50, transform: 'translateX(-50%)', color: lastFeedback.color,
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)', animation: 'feedbackPop 0.4s ease-out forwards' }}>
            {lastFeedback.text}
            {lastFeedback.penalty > 0 && <span className="text-sm ml-1">+{lastFeedback.penalty.toFixed(2)}s</span>}
          </div>
        )}
        
        {/* Broadcast-style HUD */}
        {gameState === 'playing' && (
          <>
            {/* Top bar - Time */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded">
              <div className="text-white font-mono text-2xl font-bold">{formatTime(raceTime)}</div>
            </div>
            
            {/* Left panel - Gates */}
            <div className="absolute top-14 left-2 bg-black/60 px-3 py-2 rounded text-white">
              <div className="text-xs opacity-70">GATES</div>
              <div className="text-xl font-bold">{gatesCleared}<span className="text-sm font-normal">/{TOTAL_GATES}</span></div>
            </div>
            
            {/* Right panel - Speed */}
            <div className="absolute top-14 right-2 bg-black/60 px-3 py-2 rounded text-white text-right">
              <div className="text-xs opacity-70">SPEED</div>
              <div className="text-xl font-bold">{speedKmh}<span className="text-sm font-normal"> km/h</span></div>
            </div>
            
            {/* Misses */}
            <div className="absolute bottom-3 left-2 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 ${i < misses ? 'bg-red-500 border-red-400' : 'bg-transparent border-white/40'}`} />
              ))}
            </div>
            
            {/* Best time */}
            {bestTime && (
              <div className="absolute bottom-3 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                BEST: {formatTime(bestTime)}
              </div>
            )}
          </>
        )}
        
        {/* Countdown */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-white" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
              {countdownValue || 'GO!'}
            </div>
          </div>
        )}
        
        {/* Start screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <div className="text-5xl mb-2">⛷️</div>
            <h2 className="text-3xl font-bold mb-1">SLALOM</h2>
            <p className="text-slate-300 mb-4">Timing Trainer</p>
            <div className="text-center mb-4 px-6 text-slate-300 text-sm space-y-1">
              <p><span className="text-red-400 font-bold">← LEFT</span> for red gates</p>
              <p><span className="text-blue-400 font-bold">RIGHT →</span> for blue gates</p>
              <p className="text-green-400 mt-2">Time your turn BEFORE the gate!</p>
            </div>
            <div className="text-slate-400 text-xs mb-4">{TOTAL_GATES} gates • 3 misses = DNF</div>
            {bestTime && <div className="text-yellow-400 text-sm mb-2">Best: {formatTime(bestTime)}</div>}
            <button onClick={startGame} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-lg">
              START RUN
            </button>
          </div>
        )}
        
        {/* Finished screen */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <div className="text-green-400 text-xl mb-1">🏁 FINISH</div>
            <div className="text-5xl font-bold font-mono text-yellow-400 mb-2">{formatTime(raceTime)}</div>
            {bestTime === raceTime && <div className="text-green-400 text-lg mb-2">🏆 NEW BEST!</div>}
            <div className="text-slate-300 text-sm mb-4">
              Gates: {gatesCleared}/{TOTAL_GATES} • Misses: {misses}
            </div>
            <button onClick={startGame} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
              TRY AGAIN
            </button>
          </div>
        )}
        
        {/* Game over screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <div className="text-red-400 text-2xl mb-2">DNF</div>
            <div className="text-slate-300 mb-1">Too many missed gates</div>
            <div className="text-slate-400 text-sm mb-4">
              Gates cleared: {gatesCleared}/{TOTAL_GATES}
            </div>
            <button onClick={startGame} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold">
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
      
      {/* Controls hint */}
      <div className="mt-3 text-slate-500 text-xs text-center">
        A/← Left • D/→ Right • Space to start
      </div>
      
      <style>{`
        @keyframes feedbackPop {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.15); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(-15px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
