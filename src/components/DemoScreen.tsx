/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { Play, Square, Volume2, VolumeX, Monitor } from "lucide-react";

interface DemoScreenProps {
  effects: string[]; // List of effect IDs to enable
  demoName?: string;
  groupName?: string;
}

export default function DemoScreen({ effects = [], demoName = "UNTITLED", groupName = "CREW" }: DemoScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [glitchAmount, setGlitchAmount] = useState(0);

  // Audio Context refs for lazy synthesis
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // Core effect states
  const frameRef = useRef(0);
  const textRef = useRef(`*** DEMOSCENE SIMULATOR (1985-2005) *** RELEASE: "${demoName.toUpperCase()}" BY ${groupName.toUpperCase()} *** SHOUTOUTS TO FUTURE CREW, FARBRAUSCH, FAIRLIGHT, RAZOR 1911, KEFRENS, TRSI, MAJIC 12, COSMIC SLATE, BLACK LOTUS, ASD... CODE: OK, GRAPHICS: PIXEL PERFECT, SOUND: CHIP SYNTHESIS TRICKS! ***`);
  const textOffsetRef = useRef(0);

  // Canvas update loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let id: number;
    let width = canvas.width;
    let height = canvas.height;

    // Fire effect pixel buffer setup
    const fireWidth = 80;
    const fireHeight = 50;
    const firePixels = new Uint8Array(fireWidth * fireHeight);
    firePixels.fill(0);

    const run = () => {
      if (!isPlaying) return;

      frameRef.current++;
      const f = frameRef.current;

      // Clear or darken
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, width, height);

      // 1. ADVANCED RASTER BARS
      if (effects.includes("raster_bars")) {
        const barCount = 6;
        for (let i = 0; i < barCount; i++) {
          const y = height / 2 + Math.sin(f * 0.04 + i * 0.4) * (height / 2.5);
          const size = 12 + Math.sin(f * 0.07 + i) * 6;
          const r = Math.floor(128 + Math.sin(f * 0.05 + i) * 127);
          const g = Math.floor(128 + Math.sin(f * 0.03 + i + 2) * 127);
          const b = Math.floor(128 + Math.cos(f * 0.06 + i * 1.5) * 127);

          // Render horizontal beam
          const gradient = ctx.createLinearGradient(0, y - size, 0, y + size);
          gradient.addColorStop(0, "rgba(0,0,0,0)");
          gradient.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, y - size, width, size * 2);
        }
      }

      // 2. PARALLAX STARFIELD
      if (effects.includes("starfield_2d") || effects.includes("custom_spr_tricky")) {
        const starCount = 35;
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < starCount; i++) {
          const speed = (i % 3) + 1;
          const x = (i * 137 + f * speed) % width;
          const y = (i * 59) % height;
          const size = speed === 3 ? 2 : 1;
          ctx.fillStyle = speed === 3 ? "#ffffff" : speed === 2 ? "#aaaaaa" : "#666666";
          ctx.fillRect(x, y, size, size);
        }
      }

      // 3. TRIGONOMETRIC SINE PLASMA
      if (effects.includes("animated_plasma")) {
        // Draw low-res plasma cells to save performance while maintaining retro vibe
        const gridSize = 4;
        for (let x = 0; x < width; x += gridSize) {
          for (let y = 0; y < height; y += gridSize) {
            // Evaluates compound wave patterns
            const v1 = Math.sin(x * 0.035 + f * 0.05);
            const v2 = Math.sin(0.02 * (y * Math.sin(f * 0.01) + x * Math.cos(f * 0.02)));
            const cx = x - width / 2;
            const cy = y - height / 2;
            const v3 = Math.sin(Math.sqrt(cx * cx + cy * cy) * 0.04 - f * 0.08);

            const v = (v1 + v2 + v3) / 3;
            const r = Math.floor((Math.sin(v * Math.PI) + 1) * 127);
            const g = Math.floor((Math.sin(v * Math.PI + (2 * Math.PI) / 3) + 1) * 127);
            const b = Math.floor((Math.sin(v * Math.PI + (4 * Math.PI) / 3) + 1) * 127);

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }

      // 4. RETRO DOOM PIXEL FIRE
      if (effects.includes("pixel_fire")) {
        // Core fire logic: seed bottom row
        for (let x = 0; x < fireWidth; x++) {
          firePixels[(fireHeight - 1) * fireWidth + x] = Math.random() > 0.35 ? 36 : 0;
        }

        // Propagate upward with some decay
        for (let y = 0; y < fireHeight - 1; y++) {
          for (let x = 0; x < fireWidth; x++) {
            const index = y * fireWidth + x;
            const belowIndex = (y + 1) * fireWidth + x;
            const rand = Math.floor(Math.random() * 3);
            const src = firePixels[belowIndex];
            const dst = src - (rand & 1); // small delay
            const targetX = (x + (rand - 1) + fireWidth) % fireWidth;
            firePixels[y * fireWidth + targetX] = dst < 0 ? 0 : dst;
          }
        }

        // Render fire pixels onto main canvas
        const fireColors = [
          "#070707", "#1f0707", "#2f0f07", "#470f07", "#571707", "#671f07", "#771f07", "#8f2707",
          "#9f2f07", "#af3f07", "#bf4707", "#c74707", "#df4f07", "#df5707", "#df5708", "#df5f07",
          "#df6708", "#df6f08", "#df7708", "#df7f08", "#df8708", "#df8f08", "#df9709", "#df9f09",
          "#dfa709", "#dfaf09", "#dfb70a", "#dfbf0a", "#dfc70a", "#dfcf0b", "#dfd70b", "#dfdf0b",
          "#efe71b", "#efe72b", "#efe73b", "#efe74b", "#ffffff"
        ];

        const pixelW = width / fireWidth;
        const pixelH = height / fireHeight;

        for (let y = 0; y < fireHeight; y++) {
          for (let x = 0; x < fireWidth; x++) {
            const intensity = firePixels[y * fireWidth + x];
            if (intensity > 0) {
              ctx.fillStyle = fireColors[Math.min(intensity, fireColors.length - 1)];
              ctx.fillRect(x * pixelW, y * pixelH, pixelW + 0.5, pixelH + 0.5);
            }
          }
        }
      }

      // 5. 3D VECTOR ROTATING CUBE
      if (effects.includes("vector_cube") || effects.includes("cloth_physics") || effects.includes("asm3d_pipeline") || effects.includes("texture_mapper") || effects.includes("gouraud_shading")) {
        // Render detailed rotating 3D vector shape
        const vertices = [
          [-40, -40, -40], [40, -40, -40], [40, 40, -40], [-40, 40, -40],
          [-40, -40, 40], [40, -40, 40], [40, 40, 40], [-40, 40, 40],
          [0, -70, 0], [0, 70, 0] // 3D Gem top & bottom pins for extra flair
        ];
        // Connect vertices
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front
          [4, 5], [5, 6], [6, 7], [7, 4], // back
          [0, 4], [1, 5], [2, 6], [3, 7], // links
          [8, 0], [8, 1], [8, 4], [8, 5], // pyramid top
          [9, 2], [9, 3], [9, 6], [9, 7]  // pyramid bottom
        ];

        // Trigonometric rotation
        const angleX = f * 0.015;
        const angleY = f * 0.02;
        const angleZ = f * 0.01;

        const projected: [number, number][] = [];

        vertices.forEach((vert) => {
          let x = vert[0];
          let y = vert[1];
          let z = vert[2];

          // Rotate X
          const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
          const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);

          // Rotate Y
          const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
          const z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

          // Rotate Z
          const x3 = x2 * Math.cos(angleZ) - y1 * Math.sin(angleZ);
          const y3 = x2 * Math.sin(angleZ) + y1 * Math.cos(angleZ);

          // Perspective projection
          const dist = 180;
          const scale = dist / (dist + z2);
          const projX = width / 2 + x3 * scale * 1.5;
          const projY = height / 2 + y3 * scale * 1.5;
          projected.push([projX, projY]);
        });

        // Draw edges
        ctx.strokeStyle = "#4ef2d2";
        ctx.lineWidth = 1.5;
        edges.forEach(([u, v]) => {
          ctx.beginPath();
          ctx.moveTo(projected[u][0], projected[u][1]);
          ctx.lineTo(projected[v][0], projected[v][1]);
          ctx.stroke();
        });

        // Draw node points
        ctx.fillStyle = "#ffffff";
        projected.forEach(([x, y]) => {
          ctx.fillRect(x - 2, y - 2, 4, 4);
        });
      }

      // 6. TUNNEL / VOXEL VIEWPORT
      if (effects.includes("tunnel_effect") || effects.includes("voxel_hills") || effects.includes("raymarching_3d")) {
        const cx = width / 2;
        const cy = height / 2;
        const radiusStep = 8;
        const layerCount = 12;

        for (let i = 0; i < layerCount; i++) {
          const r = ((i * radiusStep + f * 1.5) % (layerCount * radiusStep)) + 5;
          const angleOffset = f * 0.02 + i * 0.15;

          // Simple low-overhead textured ring simulation
          ctx.strokeStyle = `hsla(${(i * 30 + f) % 360}, 85%, 60%, ${1 - r / (layerCount * radiusStep)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.8, angleOffset, angleOffset + Math.PI * 1.5);
          ctx.stroke();
        }
      }

      // 7. SINE WAVE SCROLLER
      if (effects.includes("sine_scroller")) {
        ctx.font = "bold 14px 'JetBrains Mono', 'Fira Code', monospace";
        ctx.fillStyle = "#ffdd55";
        ctx.shadowColor = "#ff5500";
        ctx.shadowBlur = 4;

        textOffsetRef.current -= 1.8;
        if (textOffsetRef.current < -ctx.measureText(textRef.current).width) {
          textOffsetRef.current = width;
        }

        const startX = textOffsetRef.current;
        const text = textRef.current;

        let curX = startX;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const charW = ctx.measureText(char).width;

          // Adjust height according to sine curve based on screen position
          const waveY = height - 25 + Math.sin((curX * 0.015) + (f * 0.07)) * 14;

          // Render individual character
          ctx.fillText(char, curX, waveY);
          curX += charW;
        }
        ctx.shadowBlur = 0; // Reset
      }

      // HUD / Status info for maximum cyber retro fidelity
      ctx.fillStyle = "rgba(0, 255, 100, 0.75)";
      ctx.font = "9px 'JetBrains Mono', 'Fira Code', monospace";
      ctx.fillText(`FPS: 60  EFF: ${effects.length}  MONITOR ID: S-CRT-CRT`, 6, 12);
      ctx.fillText(`PROD: ${demoName.substring(0, 15).toUpperCase()} (${groupName.substring(0, 10).toUpperCase()})`, width - 110, 12);

      // Recursive loop
      id = requestAnimationFrame(run);
    };

    // Begin looping
    id = requestAnimationFrame(run);

    return () => cancelAnimationFrame(id);
  }, [isPlaying, effects, demoName, groupName]);

  // Audio synthesis loop (Nostalgic 8-bit tracking melodies)
  useEffect(() => {
    if (!audioEnabled || !isPlaying) {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      return;
    }

    // Lazy initialization of HTML Audio Context
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const actx = new AudioCtx();
      audioContextRef.current = actx;

      // Note frequencies (pentatonic scale for awesome sound without discord)
      const scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
      let step = 0;

      // Synthesizer scheduler loop
      synthIntervalRef.current = setInterval(() => {
        if (!actx || actx.state === "suspended") return;

        const time = actx.currentTime;

        // Custom bass note
        const bassNode = actx.createOscillator();
        const bassGain = actx.createGain();
        bassNode.type = "sawtooth";
        // Root chord progressions
        const baseNote = step % 16 < 8 ? scale[1] / 2 : scale[3] / 2;
        bassNode.frequency.setValueAtTime(baseNote, time);

        // Enveloping
        bassGain.gain.setValueAtTime(0.12, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        bassNode.connect(bassGain);
        bassGain.connect(actx.destination);
        bassNode.start(time);
        bassNode.stop(time + 0.35);

        // Arpeggiator pulse on certain beats
        if (step % 2 === 0) {
          const arpOsc = actx.createOscillator();
          const arpGain = actx.createGain();

          const scaleIndex = (step * 3 + (step % 4 === 0 ? 2 : 0)) % scale.length;
          const frequency = scale[scaleIndex];

          arpOsc.type = "square";
          arpOsc.frequency.setValueAtTime(frequency, time);

          arpGain.gain.setValueAtTime(0.06, time);
          arpGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

          arpOsc.connect(arpGain);
          arpGain.connect(actx.destination);
          arpOsc.start(time);
          arpOsc.stop(time + 0.2);
        }

        // Noise snare on major beats
        if (step % 4 === 2) {
          // Simulate noise with a highpass/sine combination or fast frequencies
          const snareOsc = actx.createOscillator();
          const snareGain = actx.createGain();
          snareOsc.type = "triangle";
          snareOsc.frequency.setValueAtTime(800, time);
          snareOsc.frequency.exponentialRampToValueAtTime(100, time + 0.08);

          snareGain.gain.setValueAtTime(0.2, time);
          snareGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

          snareOsc.connect(snareGain);
          snareGain.connect(actx.destination);
          snareOsc.start(time);
          snareOsc.stop(time + 0.1);
        }

        step++;
      }, 140); // 140ms step rate (classic FastTracker tempo!)

    } catch (e) {
      console.error("Web Audio API failed configuration context: ", e);
    }

    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioEnabled, isPlaying]);

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  return (
    <div id="retro-demoscreen" className="relative flex flex-col bg-[#18181b] border-2 border-[#3f3f46] shadow-[0_0_35px_rgba(34,211,238,0.15)] rounded-md p-3.5 select-none overflow-hidden">
      {/* Top monitor bezel details */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#27272a] text-[#a1a1aa] font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span className="font-bold tracking-tight">PREVIEW: <span className="text-[#22d3ee]">DEMO_VIEWPORT_AGA_SYNC</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[#4ade80] font-bold">RASTER_SYNC: OK</span>
        </div>
      </div>

      {/* Actual Retro Monitor Sandbox */}
      <div className="relative mt-2.5 bg-black rounded border border-[#27272a] overflow-hidden shadow-inner" style={{ aspectRatio: "4/3" }}>
        <canvas
          ref={canvasRef}
          width={360}
          height={270}
          className="w-full h-full object-cover transition-all"
          style={{
            imageRendering: "pixelated",
            filter: `contrast(1.23) brightness(1.1) saturate(1.2)`
          }}
        />

        {/* Scanlines layer */}
        {scanlines && (
          <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(rgba(18,22,34,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px]" />
        )}

        {/* Outer glass curved reflection */}
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-white/0 via-white/2 to-white/8" />

        {/* Render overlay, if we have empty effect list */}
        {effects.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#09090b]/95 text-center text-[#a1a1aa] font-mono">
            <span className="text-[#ef4444] animate-pulse text-sm font-bold tracking-widest mb-1.5">[ NO CODE WAVEFORMS DETECTED ]</span>
            <p className="text-[11px] max-w-[270px] leading-relaxed">Add code effects below (e.g. Copper Bars, Starfields, Custom Fire, Vector Rotating Cube) to compile visual outputs.</p>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex items-center justify-between gap-2 mt-2 bg-[#09090b] p-1.5 rounded text-xs font-mono text-[#d4d4d8] border border-[#27272a]">
        <div className="flex items-center gap-1.5">
          <button
            id="btn-play-pause"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded transition active:scale-95 cursor-pointer ${isPlaying ? "bg-[#facc15]/10 text-[#facc15] hover:bg-[#facc15]/20 border border-[#facc15]/30" : "bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20 border border-[#4ade80]/30"}`}
            title={isPlaying ? "Pause rendering code" : "Resume rendering code"}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            id="btn-toggle-sound"
            onClick={toggleAudio}
            className={`p-1.5 rounded transition flex items-center gap-1.5 active:scale-95 cursor-pointer text-[10.5px] font-bold ${audioEnabled ? "bg-[#818cf8]/15 text-[#818cf8] animate-pulse border border-[#818cf8]/40" : "bg-[#27272a]/60 text-[#71717a] border border-[#3f3f46]/30"}`}
            title="Toggle Tracker synthesizer output loops"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{audioEnabled ? "AUDIO SYNTH: LIVE" : "SYNTH OFF"}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="flex items-center gap-1.5 select-none pointer-events-auto cursor-pointer">
            <input
              type="checkbox"
              checked={scanlines}
              onChange={(e) => setScanlines(e.target.checked)}
              className="rounded bg-[#1a1b1e] border-[#3f3f46] text-[#22d3ee] focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
            />
            <span className="text-[10px] text-[#a1a1aa] font-bold">CRT_LINES</span>
          </label>
        </div>
      </div>
    </div>
  );
}
