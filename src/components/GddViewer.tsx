/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, HelpCircle, Terminal, FileText, Cpu, List, Compass, Star } from "lucide-react";

export default function GddViewer() {
  const [activeSpecTab, setActiveSpecTab] = useState<string>("overview");

  const specsList = [
    { id: "overview", label: "01. Game Concept", icon: BookOpen },
    { id: "core_loop", label: "02. Gameplay Loop", icon: Terminal },
    { id: "sim_architecture", label: "03. Systems Architecture", icon: Cpu },
    { id: "character_systems", label: "04. Character & AI Mechanics", icon: HelpCircle },
    { id: "technology_tree", label: "05. Tech & Effects Tree", icon: Compass },
    { id: "party_events", label: "06. Party & Release Systems", icon: Star },
    { id: "progression_roadmap", label: "07. MVP & Dev Roadmap", icon: List },
    { id: "pseudocodes", label: "08. Pseudocodes & Persistence", icon: FileText }
  ];

  return (
    <div id="gdd-container" className="flex flex-col md:flex-row bg-slate-950 border-2 border-amber-500/40 rounded-lg p-3 text-slate-200 font-mono text-sm shadow-xl min-h-[480px]">
      {/* File sidebar selector */}
      <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
        <div className="hidden md:block text-[10px] text-amber-500 font-bold mb-2 tracking-widest uppercase border-b border-amber-500/30 pb-1">
          AMIGADOS DOCUMENTS
        </div>
        {specsList.map((spec) => {
          const Icon = spec.icon;
          return (
            <button
              key={spec.id}
              onClick={() => setActiveSpecTab(spec.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 text-xs transition active:scale-95 whitespace-nowrap min-w-[120px] ${
                activeSpecTab === spec.id
                  ? "bg-amber-600/25 border border-amber-500 text-amber-300"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{spec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main read zone */}
      <div className="flex-1 mt-3 md:mt-0 md:pl-4 overflow-y-auto max-h-[500px] text-xs leading-relaxed text-slate-300">
        {activeSpecTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              DEMOSCENE SIMULATOR (1985-2005) - SYSTEM DESIGN DOCUMENT
            </h3>
            <div className="bg-slate-900/40 p-2.5 border border-slate-800 rounded">
              <span className="text-amber-500 font-bold">HISTORICAL CONTEXT:</span>
              <p className="mt-1">
                The computer demoscene is an international non-commercial digital subculture born in the mid-1980s. Hackers cracked copy-protection on software, attaching decorative intro sequences ("cracktros") showcasing graphics, chip tunes, and texts. This splintered into an autonomous creative community dedicated to writing extreme, real-time code expressions that maximize limited hardware.
              </p>
            </div>
            <p>
              In <strong className="text-slate-100">Demoscene Simulator</strong>, the player controls a lonely teenager with custom aspirations, working from their bedroom. Through training assembly tricks, forming crews, corresponding via BBS networks, battling at local halls, and managing burnout, they experience twenty years of hardware acceleration (from the C64's 1MHz to the Pentium III's first vertex shader chips).
            </p>
            <div>
              <span className="text-emerald-400 font-bold block">CORE GAME EXPERIENCE:</span>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-400">
                <li><strong className="text-slate-200">Engineering-Driven Play:</strong> Selecting and coordinating complex demoscene code tricks (2D scrolltexts, flat cubes, texture mappers or SDF raymarching) inside active, realistic byte and power thresholds.</li>
                <li><strong className="text-slate-200">Atmospheric Authenticity:</strong> Retro visual interfaces modeled after FastTracker II, Deluxe Paint, Amiga Workbench, and BBS terminal readers.</li>
                <li><strong className="text-slate-200">Procedural Living World:</strong> Hundreds of distinct simulated scene figures with varying friendships, egos, rivalries, platform focus, and salaries.</li>
              </ul>
            </div>
          </div>
        )}

        {activeSpecTab === "core_loop" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              02. THE CORE GAMEPLAY LOOP
            </h3>
            <p>
              The loop resolves as a modular calendar progression. The simulation runs on a monthly tick where characters gain experience, BBS boards spread rumor disks, and crews draft plans.
            </p>
            <div className="bg-slate-900/80 p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="px-1.5 py-0.5 bg-emerald-950 rounded text-[10px]">STEP 1</span>
                <span>RESEARCH & DESIGN</span>
              </div>
              <p className="text-slate-400 pl-4">
                Research digital algorithms (raster synchronization, fixed math, 3D pipelines) and buy upgraded computer rigs. Keep a balance of RAM usage and CPU clock frequency limit buffers.
              </p>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mt-2">
                <span className="px-1.5 py-0.5 bg-emerald-950 rounded text-[10px]">STEP 2</span>
                <span>TEAMWORK & COORDINATION</span>
              </div>
              <p className="text-slate-400 pl-4">
                Divide monthly labor. Tell your coder to write chunky-to-planar code blocks, your graphician to pixel metal interfaces, and your tracker to compile stereo track mod patterns.
              </p>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mt-2">
                <span className="px-1.5 py-0.5 bg-emerald-950 rounded text-[10px]">STEP 3</span>
                <span>PARTY SUBMISSION & PARTY WARS</span>
              </div>
              <p className="text-slate-400 pl-4">
                Pack your production under size-restricted buffers (4KB, 64KB, or larger Megademo). Attend annual parties (Mekka-Symposium, Breakpoint, Assembly). See rival groups release competing demos and watch voting boards change!
              </p>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mt-2">
                <span className="px-1.5 py-0.5 bg-emerald-950 rounded text-[10px]">STEP 4</span>
                <span>SCENE FEEDBACK & CHARTS REPUTATION</span>
              </div>
              <p className="text-slate-400 pl-4">
                Read scene reviews in underground scroll magazines, collect cash prizes, BBS downloads rise, and unlock higher prestige sceners to recruit!
              </p>
            </div>
          </div>
        )}

        {activeSpecTab === "sim_architecture" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              03. DETAILED SIMULATION ARCHITECTURE
            </h3>
            <p>
              Unlike traditional tycoon games, variables are linked mathematically to mimic historical chip-level programming.
            </p>
            <div className="space-y-3">
              <div>
                <span className="text-slate-100 font-bold">Production Size & Speed Calculations:</span>
                <p className="text-slate-400 mt-0.5">
                  The binary file size of a demo is calculated dynamically based on effect algorithms and compression nodes.
                  <br />
                  <code className="text-[11px] text-amber-400 block bg-black/60 p-1 rounded mt-1">
                    Size = Sum(EffectBaseRamCost) * (1 - CompressionLevel * 0.15) * (1 - ResearchBonus)
                  </code>
                  If the size exceeds the standard platform boundaries (e.g. 4096 bytes for a 4K Intro), the production receives massive penalties in the Technical Optimization chart category!
                </p>
              </div>

              <div>
                <span className="text-slate-100 font-bold">Ecosystem Agent Cycles:</span>
                <p className="text-slate-400 mt-0.5">
                  Rival crew groups are simulated every month. They will research technologies at their own rates, recruit freelance sceners, write text critiques on BBS boards, and enter productions into parties to compete with the player.
                </p>
              </div>

              <div>
                <span className="text-slate-100 font-bold">Visual Rendering Engine Logic:</span>
                <p className="text-slate-400 mt-0.5">
                  Instead of showing boring bar meters, the game converts the active release's effect arrays into live Canvas variables, drawing actual procedural formulas. This provides instantaneous visual feedback on the quality, style, and beauty of the player's coding.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSpecTab === "character_systems" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              04. CHARACTER SYSTEM & EMERGENCIES
            </h3>
            <p>
              A true scener cannot be paid in standard commercial currency; they thrive on reputation, hardware access, motivation, and crew status.
            </p>
            <div className="space-y-3 text-slate-400">
              <p>
                Each NPC scener has an <strong className="text-slate-200">Ego Score (0-100)</strong>. Sceners with high egos require their releases to focus heavily on their primary strength (e.g., a musician demands 16-channel tracking instead of low-byte chiptunes) or they risk suffering a massive blow to their motivation.
              </p>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] font-sans">
                <span className="text-amber-500 font-bold block font-mono">EMERGENT ANECDOTE SYSTEM:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><strong>Talent Poaching:</strong> A rival group (e.g., Fairlight) might send an encrypted invitation to your pixel artist, offering them faster computers if your crew's reputation stays stagnant.</li>
                  <li><strong>Party Disasters:</strong> A coder drinks too many energy drinks right before the demo deadline, triggering a 20% risk of crashing loops that you must fix through last-minute assembly debugs!</li>
                  <li><strong>Group Splits & Comebacks:</strong> Members can get burnt out. If burnout reaches 100, they temporarily retire to get a real life job, and you must search BBS boards to hire new, young talent.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSpecTab === "technology_tree" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              05. TECHNOLOGY & EFFECT KNOWLEDGE GRAPH
            </h3>
            <p>
              Technology is divided into historical development eras. Mastering nodes unlocks specific real-time graphic effects that can be packed inside productions.
            </p>
            <div className="border border-slate-800 rounded p-2.5 bg-slate-900/50">
              <span className="text-emerald-400 font-bold">1985–1989 (8-Bit Zenith)</span>
              <p className="text-slate-400 pl-4 mt-0.5">Focus: Raster horizontal synchronization, Sprite multiplexing, Analog synth manipulation.</p>

              <span className="text-emerald-400 font-bold block mt-2">1990–1995 (16-Bit Gold)</span>
              <p className="text-slate-400 pl-4 mt-0.5">Focus: Amiga Copper Lists, Blitter processor abuse, chunky-to-planar (C2P), 4-Channel Tracker MOD composition.</p>

              <span className="text-emerald-400 font-bold block mt-2">1996–2000 (PC Dawn & 3D SVGA)</span>
              <p className="text-slate-400 pl-4 mt-0.5">Focus: Linear Mode-13h (320x200), Voxel heightfield casting, fixed-point math pipelines, hardware sound wave tracking.</p>

              <span className="text-emerald-400 font-bold block mt-2">2001–2005 (Modern Shaders / Raymarching)</span>
              <p className="text-slate-400 pl-4 mt-0.5">Focus: Direct3D pipelines, OpenGL wrappers, Procedural mathematical textures, Executable assembly crunchers, Signed Distance SDF Raymarching.</p>
            </div>
          </div>
        )}

        {activeSpecTab === "party_events" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              06. DEMOPARTIES & RELEASE PLATFORMS
            </h3>
            <p>
              Underground demoparties are the core of competitive demoscene culture. A party takes place at specific times of the year and runs live voter tables.
            </p>
            <div className="space-y-3">
              <div className="p-2 border border-blue-900 bg-blue-950/40 rounded">
                <span className="text-blue-300 font-bold">COMPETITIVE CATEGORIES:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
                  <li><strong>Megademo:</strong> Unlimited size. Evaluated on overall director flow, transitions, and length.</li>
                  <li><strong>64KB Intro:</strong> Massive compression focus. Must balance procedural noise generators and code.</li>
                  <li><strong>4KB Intro:</strong> Hardcore assembly. Extremely strict bytes limits (4096 bytes).</li>
                  <li><strong>Slide Show:</strong> Art-focused. Displays high detail retro pixel renders.</li>
                </ul>
              </div>
              <div>
                <span className="text-slate-100 font-bold">The Voting Algorithm:</span>
                <p className="text-slate-400">
                  NPC groups (Future Crew, Razor, Farbrausch) also release masterpieces. The judging engine calculates each entry's score based on the host platform's hardware match. Code, graphics, originality, and audio parameters are weighted inside a compound gaussian curve.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSpecTab === "progression_roadmap" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              07. DEVELOPMENT PLANS & MVP SPECIFICATION
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-emerald-400 font-bold">MVP PHASE (Our Current Visual Slice):</span>
                <p className="text-slate-400 mt-1">
                  Fully interactive web emulator executing procedural C64/Amiga/Pentium engine loops in Canvas. Real-time calendar progression, tech researching dashboard, recruitment pool, and a fully reactive party competition scoreboard with procedurally generated news magazines!
                </p>
              </div>

              <div>
                <span className="text-sky-400 font-bold">VERTICAL SLICE ADDITIONS (Commercial Expansion):</span>
                <p className="text-slate-400 mt-1">
                  Introduction of multi-branch storylines, detailed assembly compiler sub-games (write tiny instruction logic), visual Deluxe Paint editing grids, SoundTracker audio track mixer, and localized BBS connection terminal networks with custom ANSI menus.
                </p>
              </div>

              <div>
                <span className="text-purple-400 font-bold">FULL ROADMAP (Complete Multiplatform Release):</span>
                <p className="text-slate-400 mt-1">
                  Cloud multiplayer scoreboard allowing live sceners worldwide to run actual WebGL intros head-to-head, custom soundtrack licensing from legendary retro tracker musicians, and support for running authentic emulator payloads.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSpecTab === "pseudocodes" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 border-b border-amber-500/30 pb-1">
              08. ARCHITECTURE PSEUDOCODE GUIDE
            </h3>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[10px] space-y-3">
              <div>
                <span className="text-amber-500 font-mono">// A. The Demo Evaluation Calculation Loop</span>
                <pre className="text-slate-400 overflow-x-auto whitespace-pre">
{`function evaluateProduction(prod, platform, crew) {
  let codeBase = crew.codingSkill * (platform.cpuLimit / 50.0);
  let artBase  = crew.graphicsSkill * (platform.graphicsMaxColors / 16.0);
  let soundBase = crew.musicSkill * (platform.audioChannels / 4.0);

  // Apply Tech Research Modifiers
  let codeMod = 1.0 + (techBonus.coding / 100.0);
  let optMod  = 1.0 + (techBonus.optimization / 100.0);

  let techScore = (codeBase * codeMod) * (1.0 + prod.optimizationLevel * 0.1);
  let artScore  = artBase * (1.0 + prod.artEffort * 0.05);
  let audioScore = soundBase * (1.0 + prod.musicEffort * 0.05);

  // Apply critical Size Penalty
  let sizeLimit = (prod.type === "4KB") ? 4096 : (prod.type === "64KB") ? 65536 : Infinity;
  let finalSize = calculateSizeInBytes(prod);
  if (finalSize > sizeLimit) {
    techScore *= 0.2; // Massive algorithmic disqualification penalty!
  }

  return (techScore * 0.4) + (artScore * 0.3) + (audioScore * 0.3);
}`}
                </pre>
              </div>

              <div>
                <span className="text-amber-500 font-mono">// B. Save-Game Persistence Schema</span>
                <pre className="text-slate-400 overflow-x-auto whitespace-pre">
{`interface SaveGameSchema {
  version: "1.0.0";
  timestamp: number;
  playerState: {
    handle: string;
    money: number;
    rep: number;
    platform: string;
    ownedRigs: string[];
  };
  researchedTechs: string[]; // List of unlocked tech nodes
  activeCrewIds: string[];  // Hired characters
  newsArchives: string[];   // Generated scenedisks logs
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
