// Web Audio API minimal tactile synthesizer & ambient steam sound
// ponytail: pure synthetic audio - zero external audio asset overhead, zero network latency

let audioCtx: AudioContext | null = null
let steamNoiseNode: AudioNode | null = null
let steamGainNode: GainNode | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playTactileClick() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  } catch {
    // Audio muted or not allowed
  }
}

export function playAddSuccess() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  } catch {
    // Audio muted or not allowed
  }
}

// Gentle Bamboo Steamer ambient sound generator (filtered pink noise)
export function startSteamAmbience(): boolean {
  try {
    const ctx = getAudioContext()
    if (!ctx) return false

    if (steamNoiseNode) {
      stopSteamAmbience()
    }

    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0

    // Generate warm pink noise (simulating gentle boiling water & rising steam)
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      data[i] = (b0 + b1 + b2) * 0.08
    }

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = buffer
    noiseSource.loop = true

    // Low pass filter for soft bamboo hiss
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, ctx.currentTime)

    steamGainNode = ctx.createGain()
    steamGainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    steamGainNode.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.6)

    noiseSource.connect(filter)
    filter.connect(steamGainNode)
    steamGainNode.connect(ctx.destination)

    noiseSource.start()
    steamNoiseNode = noiseSource
    return true
  } catch {
    return false
  }
}

export function stopSteamAmbience() {
  try {
    const ctx = getAudioContext()
    if (steamGainNode && ctx) {
      steamGainNode.gain.setValueAtTime(steamGainNode.gain.value, ctx.currentTime)
      steamGainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
      setTimeout(() => {
        if (steamNoiseNode) {
          try {
            (steamNoiseNode as AudioBufferSourceNode).stop()
            steamNoiseNode.disconnect()
          } catch {
            // Already stopped
          }
          steamNoiseNode = null
        }
      }, 450)
    }
  } catch {
    // Graceful error ignore
  }
}
