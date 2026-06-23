/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformId, PlatformConfig, DemoEffect, EraId, TechNode, Character, Group, SpecialtyType, PartyEvent, ProductionType } from "./types";

export const HISTORICAL_PLATFORMS: Record<PlatformId, PlatformConfig> = {
  [PlatformId.C64]: {
    id: PlatformId.C64,
    name: "Commodore 64",
    year: 1982,
    cost: 150,
    cpuLimit: 12,
    ramLimitKb: 64,
    graphicsMaxColors: 16,
    audioChannels: 3,
    audioTech: "MOS 6581 SID Chip (Legendary analog filters, 3 voice synth)",
    graphicsTech: "VIC-II (Hardware sprites, scroll registers, raster interrupts)",
    description: "The multi-million selling 8-bit wonder. Mastering its custom chips requires hardcore 6502 assembly and extreme clock-cycle counting."
  },
  [PlatformId.ZX_SPECTRUM]: {
    id: PlatformId.ZX_SPECTRUM,
    name: "Sinclair ZX Spectrum",
    year: 1982,
    cost: 90,
    cpuLimit: 10,
    ramLimitKb: 48,
    graphicsMaxColors: 8,
    audioChannels: 1,
    audioTech: "Single Beeper Port / AY-3-8912 synth on 128k model",
    graphicsTech: "Bitmap video buffer (Strict color attribute grid, 32x24 cells)",
    description: "The iconic British rubber-keyed micro. Highly limited graphics with notorious attribute clash—yet hackers push it to incredible limits."
  },
  [PlatformId.AMIGA_500]: {
    id: PlatformId.AMIGA_500,
    name: "Commodore Amiga 500",
    year: 1987,
    cost: 500,
    cpuLimit: 40,
    ramLimitKb: 512,
    graphicsMaxColors: 32, // or 4096 in HAM
    audioChannels: 4,
    audioTech: "Paula custom audio (4 hardware channels of stereophonic 8-bit PCM)",
    graphicsTech: "OCS chipset (Denis, Agnus, Copper processor & Blitter coprocessor)",
    description: "The absolute darling of the 16-bit scene. Features a Copper chip that runs in sync with video beam, and the Blitter for warp speed pixel operations."
  },
  [PlatformId.ATARI_ST]: {
    id: PlatformId.ATARI_ST,
    name: "Atari 520ST",
    year: 1985,
    cost: 400,
    cpuLimit: 38,
    ramLimitKb: 512,
    graphicsMaxColors: 16,
    audioChannels: 3,
    audioTech: "Yamaha YM2149 PSG programmable sound generator",
    graphicsTech: "Simple frame buffer (No scroll registers, no copper, raw CPU power)",
    description: "The competitor to the Amiga. Lacks custom graphics chips and scroll hardware, so programmers must invent 'borderless' overscans manually."
  },
  [PlatformId.AMIGA_1200]: {
    id: PlatformId.AMIGA_1200,
    name: "Commodore Amiga 1200",
    year: 1992,
    cost: 800,
    cpuLimit: 90,
    ramLimitKb: 2048,
    graphicsMaxColors: 256, // and up to 262,144 in HAM8
    audioChannels: 4,
    audioTech: "Paula sound with 14-bit synthesis tricks",
    graphicsTech: "AGA (Advanced Graphics Architecture, fast page-mode memory)",
    description: "The next-gen Amiga. High bandwidth and gorgeous color palettes. The ultimate playground for chunky-to-planar texture effects."
  },
  [PlatformId.PC_386]: {
    id: PlatformId.PC_386,
    name: "Intel 386 DX PC",
    year: 1989,
    cost: 1500,
    cpuLimit: 80,
    ramLimitKb: 4096,
    graphicsMaxColors: 256,
    audioChannels: 1, // PC Speaker or AdLib
    audioTech: "AdLib FM Music Synthesizer / PC Internal Speaker bleeps",
    graphicsTech: "VGA Mode 13h (320x200 linear pixels, 256 colors from 262k palette)",
    description: "Early PC demoscene era. No custom screen sync chips—just raw CPU speed, flat frame buffers, and sound synthesis adapters."
  },
  [PlatformId.PC_486]: {
    id: PlatformId.PC_486,
    name: "Intel 486 DX2-66 PC",
    year: 1992,
    cost: 2000,
    cpuLimit: 180,
    ramLimitKb: 8192,
    graphicsMaxColors: 256,
    audioChannels: 8,
    audioTech: "Grave UltraSound (Native wavetables, HW mixing) / SoundBlaster 16",
    graphicsTech: "VESA Local Bus SVGA (640x480 high resolution frames, flat buffers)",
    description: "The engine that propelled PCs past Amiga in raw compute. Gravis Ultrasound introduces hardware audio wavetables, fueling multi-track MOD players."
  },
  [PlatformId.PC_PENTIUM]: {
    id: PlatformId.PC_PENTIUM,
    name: "Intel Pentium 133 PC",
    year: 1995,
    cost: 2200,
    cpuLimit: 350,
    ramLimitKb: 16384,
    graphicsMaxColors: 65536,
    audioChannels: 16,
    audioTech: "SoundBlaster AWE32 / Gravis UltraSound MAX stereophonic sound",
    graphicsTech: "PCI Graphic Bus architecture (Fast write buffers, early voxel heights)",
    description: "An absolute powerhouse. The Pentium architecture allows dual assembly instruction pipelining, enabling software texture mapping."
  },
  [PlatformId.PC_PENTIUM_II]: {
    id: PlatformId.PC_PENTIUM_II,
    name: "Intel Pentium II 400 PC",
    year: 1998,
    cost: 1800,
    cpuLimit: 750,
    ramLimitKb: 65536,
    graphicsMaxColors: 16777216,
    audioChannels: 32,
    audioTech: "AC'97 Audio Codecs (High speed streaming, real-time MP3 decoding)",
    graphicsTech: "AGP Bus with 3DFX Voodoo Graphics, Riva TNT (Early 3D hardware)",
    description: "The era of 3D accelerators. Relies on graphics APIs (Glide, Direct3D, early OpenGL) to render hundreds of thousands of textured polygons."
  },
  [PlatformId.PC_PENTIUM_III]: {
    id: PlatformId.PC_PENTIUM_III,
    name: "Pentium III + GeForce 2600",
    year: 2001,
    cost: 1600,
    cpuLimit: 1200,
    ramLimitKb: 262144,
    graphicsMaxColors: 16777216,
    audioChannels: 64,
    audioTech: "DirectSound3D acceleration, software digital DSP filters",
    graphicsTech: "NVIDIA GeForce (Hardware transform & lighting, custom vertex shaders)",
    description: "The peak of the historical demoscene. Graphics cards handle lights, normals, vertex coordinates, and early procedural generation loops."
  }
};

export const DEMO_EFFECTS: DemoEffect[] = [
  // --- 8-BIT ERA ---
  {
    id: "raster_bars",
    name: "Raster Bars / Copper Bars",
    era: EraId.ERA_8_BIT,
    minPlatform: PlatformId.C64,
    cpuCost: 2,
    ramCostKb: 1,
    difficulty: 10,
    originality: 15,
    audienceAppeal: 35,
    category: "raster",
    description: "Rainbow-like horizontal color bands generated by syncing color registers with the video beam refresh."
  },
  {
    id: "sine_scroller",
    name: "Sine Wave Scroller",
    era: EraId.ERA_8_BIT,
    minPlatform: PlatformId.C64,
    cpuCost: 4,
    ramCostKb: 2,
    difficulty: 15,
    originality: 20,
    audienceAppeal: 40,
    category: "pixel_trick",
    description: "Text scrolltext where each character or vertical line's height fluctuates based on a precalculated trigonometric sine lookup table."
  },
  {
    id: "starfield_2d",
    name: "2D Parallax Starfield",
    era: EraId.ERA_8_BIT,
    minPlatform: PlatformId.ZX_SPECTRUM,
    cpuCost: 3,
    ramCostKb: 1,
    difficulty: 12,
    originality: 12,
    audienceAppeal: 38,
    category: "vector",
    description: "Classic flying star simulation where multiple layers of pixels move at different speeds to simulate 3D space."
  },
  {
    id: "twister",
    name: "Intertwining Twister (A-ST/Amiga)",
    era: EraId.ERA_16_BIT,
    minPlatform: PlatformId.ATARI_ST,
    cpuCost: 15,
    ramCostKb: 16,
    difficulty: 45,
    originality: 55,
    audienceAppeal: 70,
    category: "pixel_trick",
    description: "A twisting, ribbon-like 3D column displaying color shades on its rotating facets."
  },
  {
    id: "animated_plasma",
    name: "Trigonometric Sine Plasma",
    era: EraId.ERA_16_BIT,
    minPlatform: PlatformId.AMIGA_500,
    cpuCost: 20,
    ramCostKb: 32,
    difficulty: 30,
    originality: 35,
    audienceAppeal: 65,
    category: "procedural",
    description: "Psychedelic evolving organic patterns computed by evaluating layered high-speed sine/cosine equations across the entire raster map."
  },
  {
    id: "vector_cube",
    name: "Flat Shaded Vector Cube",
    era: EraId.ERA_16_BIT,
    minPlatform: PlatformId.AMIGA_500,
    cpuCost: 18,
    ramCostKb: 8,
    difficulty: 35,
    originality: 40,
    audienceAppeal: 60,
    category: "vector",
    description: "Real-time 3D rotation of coordinate vertices, projected into screen space and rendered with filled solid colors."
  },
  {
    id: "pixel_fire",
    name: "Nostalgic Doom Fire Screen",
    era: EraId.ERA_16_BIT,
    minPlatform: PlatformId.PC_386,
    cpuCost: 12,
    ramCostKb: 64,
    difficulty: 20,
    originality: 25,
    audienceAppeal: 62,
    category: "procedural",
    description: "An organic combustion effect created by blending and shifting pixel indices upward with a small pseudo-random dampener."
  },
  // --- PC ERA ---
  {
    id: "chunky_to_planar",
    name: "Chunky-to-Planar Subroutines",
    era: EraId.ERA_16_BIT,
    minPlatform: PlatformId.AMIGA_1200,
    cpuCost: 8,
    ramCostKb: 12,
    difficulty: 50,
    originality: 45,
    audienceAppeal: 50,
    category: "pixel_trick",
    description: "Highly optimized assembly code that converts byte-per-pixel buffers into multi-bitplane structures required by Amiga display chips."
  },
  {
    id: "texture_mapper",
    name: "Fast Poly Texture Mapping",
    era: EraId.ERA_PC_DAWN,
    minPlatform: PlatformId.PC_486,
    cpuCost: 50,
    ramCostKb: 128,
    difficulty: 65,
    originality: 70,
    audienceAppeal: 82,
    category: "vector",
    description: "Drawing bitmaps onto 3D polygon structures using lightning-fast linear scanlines containing interpolated coordinates."
  },
  {
    id: "tunnel_effect",
    name: "Precalculated Virtual Tunnel",
    era: EraId.ERA_PC_DAWN,
    minPlatform: PlatformId.PC_386,
    cpuCost: 16,
    ramCostKb: 256,
    difficulty: 30,
    originality: 48,
    audienceAppeal: 74,
    category: "procedural",
    description: "Dizzying infinite cylinder visualization achieved using look-up tables mapping coordinates containing angle and distance."
  },
  {
    id: "voxel_hills",
    name: "Voxel Heightfield Landscapes",
    era: EraId.ERA_PC_DAWN,
    minPlatform: PlatformId.PC_486,
    cpuCost: 120,
    ramCostKb: 512,
    difficulty: 75,
    originality: 80,
    audienceAppeal: 85,
    category: "rendering",
    description: "Majestic volumetric mountain ranges rendered with raycasting heights from a 2D canvas elevation and color map (inspired by Comanche)."
  },
  {
    id: "gouraud_shading",
    name: "Gouraud Polygon Pipeline",
    era: EraId.ERA_PC_DAWN,
    minPlatform: PlatformId.PC_486,
    cpuCost: 40,
    ramCostKb: 128,
    difficulty: 55,
    originality: 50,
    audienceAppeal: 72,
    category: "vector",
    description: "Smooth 3D color gradients computed by interpolating lighting normals across the entire face of triangular mesh models."
  },
  {
    id: "metaballs_2d",
    name: "2D Force-Field Metaballs",
    era: EraId.ERA_PC_DAWN,
    minPlatform: PlatformId.PC_386,
    cpuCost: 35,
    ramCostKb: 64,
    difficulty: 40,
    originality: 45,
    audienceAppeal: 68,
    category: "procedural",
    description: "Liquid-like gooey blobs that merge elegantly, rendered by summing magnetic force vectors from moving control charges at each pixel."
  },
  // --- MODERN SHADER ERA ---
  {
    id: "fractal_renderer",
    name: "Procedural Mandelbrot/Julia Zoomer",
    era: EraId.ERA_3D_SHADER,
    minPlatform: PlatformId.PC_PENTIUM,
    cpuCost: 150,
    ramCostKb: 1024,
    difficulty: 50,
    originality: 45,
    audienceAppeal: 65,
    category: "rendering",
    description: "Endless exploration of complex numbers. Multiplies coordinates iteratively to output infinite crystalline structures."
  },
  {
    id: "raymarching_3d",
    name: "3D Signed Distance Fields Raymarching",
    era: EraId.ERA_3D_SHADER,
    minPlatform: PlatformId.PC_PENTIUM_III,
    cpuCost: 450,
    ramCostKb: 2048,
    difficulty: 90,
    originality: 95,
    audienceAppeal: 96,
    category: "rendering",
    description: "Cutting-edge pixel evaluation where light vectors march forward along signed distance functions to render complex geometry on screen."
  },
  {
    id: "procedural_synth",
    name: "64KB Realtime Music Synth",
    era: EraId.ERA_3D_SHADER,
    minPlatform: PlatformId.PC_PENTIUM_II,
    cpuCost: 80,
    ramCostKb: 12,
    difficulty: 80,
    originality: 90,
    audienceAppeal: 88,
    category: "procedural",
    description: "Avoid raw wave audio entirely. Generate sweeping bass, drums, and synthesizers mathematically in a few hundred bytes of code."
  },
  {
    id: "cloth_physics",
    name: "Mass-Spring Cloth Physics Engine",
    era: EraId.ERA_3D_SHADER,
    minPlatform: PlatformId.PC_PENTIUM_II,
    cpuCost: 160,
    ramCostKb: 1024,
    difficulty: 72,
    originality: 78,
    audienceAppeal: 84,
    category: "vector",
    description: "Simulating gravity, tensions, and wind on a sheet of vertices linked via Verlet integration springs."
  }
];

export const TECHNOLOGY_TREE: TechNode[] = [
  // 8-BIT ERA TECH (1985–1889)
  {
    id: "raster_sync",
    name: "Raster Interrupt Synchronization",
    description: "Allows executing CPU code precisely when a specific screen line is drawn. Vital for retro stability.",
    costPoints: 20,
    preRequisiteIds: [],
    era: EraId.ERA_8_BIT,
    platformUnlocks: [PlatformId.C64, PlatformId.ZX_SPECTRUM],
    effectUnlocks: ["raster_bars", "sine_scroller"],
    bonusAttribute: { type: "coding", value: 10 },
    researched: false
  },
  {
    id: "custom_spr_tricky",
    name: "VIC-II Sprite Multiplexing",
    description: "Trick the hardware to display more than 8 sprites on screen by swapping coordinates during middle-screen interrupts.",
    costPoints: 40,
    preRequisiteIds: ["raster_sync"],
    era: EraId.ERA_8_BIT,
    platformUnlocks: [PlatformId.C64],
    effectUnlocks: ["starfield_2d"],
    bonusAttribute: { type: "optimization", value: 15 },
    researched: false
  },
  {
    id: "sid_analog_mod",
    name: "SID ADSR Filter Sweeps",
    description: "Mastering the analog envelope capabilities of the Commodore 64 SID chip for juicy bass waveforms.",
    costPoints: 25,
    preRequisiteIds: [],
    era: EraId.ERA_8_BIT,
    platformUnlocks: [PlatformId.C64],
    effectUnlocks: [],
    bonusAttribute: { type: "music", value: 20 },
    researched: false
  },

  // 16-BIT ERA TECH (1990–1995)
  {
    id: "copper_lists",
    name: "Amiga Copper Program Lists",
    description: "Learn to write autonomous micro-code for the Amiga's Copper display processor.",
    costPoints: 50,
    preRequisiteIds: ["raster_sync"],
    era: EraId.ERA_16_BIT,
    platformUnlocks: [PlatformId.AMIGA_500, PlatformId.AMIGA_1200],
    effectUnlocks: ["animated_plasma"],
    bonusAttribute: { type: "graphics", value: 15 },
    researched: false
  },
  {
    id: "blitter_abuse",
    name: "Blitter Co-processor Overdrive",
    description: "Offload pixel-filling, block copies, and line vectors directly to high-speed graphics hardware.",
    costPoints: 60,
    preRequisiteIds: ["copper_lists"],
    era: EraId.ERA_16_BIT,
    platformUnlocks: [PlatformId.AMIGA_500, PlatformId.AMIGA_1200],
    effectUnlocks: ["vector_cube", "twister"],
    bonusAttribute: { type: "optimization", value: 25 },
    researched: false
  },
  {
    id: "tracker_mod_composition",
    name: "4-Channel SoundTracker MOD Engine",
    description: "Pioneered by Karsten Obarski. Uses stereophonic instrument WAV samples triggered across tracks.",
    costPoints: 30,
    preRequisiteIds: [],
    era: EraId.ERA_16_BIT,
    platformUnlocks: [PlatformId.AMIGA_500, PlatformId.ATARI_ST],
    effectUnlocks: [],
    bonusAttribute: { type: "music", value: 25 },
    researched: false
  },
  {
    id: "overscan_trick",
    name: "Border-Busting Overscan Assembly",
    description: "Timing CPU changes near horizontal limits to display artwork inside safety boundaries.",
    costPoints: 45,
    preRequisiteIds: ["raster_sync"],
    era: EraId.ERA_16_BIT,
    platformUnlocks: [PlatformId.ATARI_ST],
    effectUnlocks: [],
    bonusAttribute: { type: "graphics", value: 20 },
    researched: false
  },

  // PC DAWN TECH (1996–2000)
  {
    id: "c2p_assembly",
    name: "Highly Optimized Chunky-to-Planar (C2P)",
    description: "Amiga relies on planar screens; PCs use linear arrays. Custom CPU code bridges the gap.",
    costPoints: 70,
    preRequisiteIds: ["blitter_abuse"],
    era: EraId.ERA_16_BIT,
    platformUnlocks: [PlatformId.AMIGA_1200],
    effectUnlocks: ["chunky_to_planar"],
    bonusAttribute: { type: "coding", value: 25 },
    researched: false
  },
  {
    id: "vga_mode13h_flat",
    name: "Linear Frame Buffer Mode-13h",
    description: "Gain direct access to 64,000 screen pixels under DOS on PC systems. Enables custom software graphics.",
    costPoints: 40,
    preRequisiteIds: [],
    era: EraId.ERA_PC_DAWN,
    platformUnlocks: [PlatformId.PC_386, PlatformId.PC_486],
    effectUnlocks: ["pixel_fire", "tunnel_effect", "metaballs_2d"],
    bonusAttribute: { type: "coding", value: 15 },
    researched: false
  },
  {
    id: "asm3d_pipeline",
    name: "Fixed-Point 3D Vector Math",
    description: "Perform trigonometric operations using integers and bitwise shifts instead of slow float registers.",
    costPoints: 80,
    preRequisiteIds: ["vga_mode13h_flat"],
    era: EraId.ERA_PC_DAWN,
    platformUnlocks: [PlatformId.PC_486, PlatformId.PC_PENTIUM],
    effectUnlocks: ["texture_mapper", "gouraud_shading"],
    bonusAttribute: { type: "optimization", value: 30 },
    researched: false
  },
  {
    id: "gus_hardware_mixing",
    name: "Gravis Ultrasound Audio Streaming",
    description: "Pumps audio samples directly to internal card RAM, saving dozens of CPU clock cycles on PC systems.",
    costPoints: 50,
    preRequisiteIds: ["tracker_mod_composition"],
    era: EraId.ERA_PC_DAWN,
    platformUnlocks: [PlatformId.PC_486, PlatformId.PC_PENTIUM],
    effectUnlocks: [],
    bonusAttribute: { type: "music", value: 30 },
    researched: false
  },
  {
    id: "voxel_heightfield",
    name: "Raycast Volumetric Heightfields",
    description: "DDA calculations that project height buffers slice-by-slice. Yields realistic organic outdoor terrains.",
    costPoints: 100,
    preRequisiteIds: ["asm3d_pipeline"],
    era: EraId.ERA_PC_DAWN,
    platformUnlocks: [PlatformId.PC_486, PlatformId.PC_PENTIUM],
    effectUnlocks: ["voxel_hills"],
    bonusAttribute: { type: "graphics", value: 30 },
    researched: false
  },

  // 3D SHADER TECH (2001–2005)
  {
    id: "compress_cranker",
    name: "LZSS & Huffman Executable Compressors",
    description: "Special tools that compress executables so complex programs can squeeze under extreme small 4KB sizes.",
    costPoints: 80,
    preRequisiteIds: ["asm3d_pipeline"],
    era: EraId.ERA_3D_SHADER,
    platformUnlocks: [PlatformId.PC_PENTIUM, PlatformId.PC_PENTIUM_II],
    effectUnlocks: [],
    bonusAttribute: { type: "size_reduction", value: 35 },
    researched: false
  },
  {
    id: "procedural_textures",
    name: "Noise-Based Procedural Textures",
    description: "Generate bricks, marble, and organic materials mathematically using sine waves and pseudo-random offsets.",
    costPoints: 90,
    preRequisiteIds: ["vga_mode13h_flat"],
    era: EraId.ERA_3D_SHADER,
    platformUnlocks: [PlatformId.PC_PENTIUM_II, PlatformId.PC_PENTIUM_III],
    effectUnlocks: ["fractal_renderer", "cloth_physics"],
    bonusAttribute: { type: "graphics", value: 25 },
    researched: false
  },
  {
    id: "opengl_direct3d",
    name: "OpenGL Hardware Graphics Pipeline",
    description: "Command modern accelerator chips (3dfx Voodoo, GeForce) to compute polygons and smooth vectors.",
    costPoints: 110,
    preRequisiteIds: ["asm3d_pipeline"],
    era: EraId.ERA_3D_SHADER,
    platformUnlocks: [PlatformId.PC_PENTIUM_II, PlatformId.PC_PENTIUM_III],
    effectUnlocks: ["cloth_physics"],
    bonusAttribute: { type: "graphics", value: 35 },
    researched: false
  },
  {
    id: "raymarching_sdf",
    name: "SDF signed distance functions & Shaders",
    description: "The absolute zenith of mathematical graphics. Evaluate complete virtual worlds within single fragment programs.",
    costPoints: 150,
    preRequisiteIds: ["opengl_direct3d", "procedural_textures"],
    era: EraId.ERA_3D_SHADER,
    platformUnlocks: [PlatformId.PC_PENTIUM_III],
    effectUnlocks: ["raymarching_3d", "procedural_synth"],
    bonusAttribute: { type: "coding", value: 40 },
    researched: false
  }
];

export const INITIAL_NPCS: Record<string, Character> = {
  "purple_motion": {
    id: "purple_motion",
    name: "Jonne Valtonen",
    handle: "Purple Motion",
    avatarSeed: 105,
    role: "scene_npc",
    groupId: "future_crew",
    skills: { coding: 30, music: 98, graphics: 45, organization: 50 },
    specialty: SpecialtyType.TrackerLegend,
    motivation: 95,
    burnout: 10,
    reputation: 880,
    friendship: 45,
    salaryDemand: 80,
    preferredPlatform: PlatformId.PC_486,
    status: "idle",
    bio: "Pioneering PC tracker musician of Future Crew. Creator of breathtaking synth MODs like Starshine and Unreal."
  },
  "skaven": {
    id: "skaven",
    name: "Peter Hajba",
    handle: "Skaven",
    avatarSeed: 204,
    role: "scene_npc",
    groupId: "future_crew",
    skills: { coding: 25, music: 96, graphics: 90, organization: 40 },
    specialty: SpecialtyType.TrackerLegend,
    motivation: 90,
    burnout: 5,
    reputation: 850,
    friendship: 40,
    salaryDemand: 90,
    preferredPlatform: PlatformId.PC_486,
    status: "idle",
    bio: "Incredibly talented tracker tracker audio wizard and pixel artist. Co-designer of classic PC demo effects."
  },
  "unreal_coder": {
    id: "unreal_coder",
    name: "Sami Tammilehto",
    handle: "Psi",
    avatarSeed: 309,
    role: "scene_npc",
    groupId: "future_crew",
    skills: { coding: 97, music: 15, graphics: 40, organization: 60 },
    specialty: SpecialtyType.AssemblyWizard,
    motivation: 92,
    burnout: 12,
    reputation: 920,
    friendship: 30,
    salaryDemand: 100,
    preferredPlatform: PlatformId.PC_486,
    status: "idle",
    bio: "Main code architect behind Second Reality. Known for fast software polygon texture mappers and assembler loops."
  },
  "dxyre": {
    id: "dxyre",
    name: "Eric G.",
    handle: "Dxyre",
    avatarSeed: 401,
    role: "scene_npc",
    groupId: "razor_1911",
    skills: { coding: 40, music: 35, graphics: 88, organization: 66 },
    specialty: SpecialtyType.PixelPerfectionist,
    motivation: 85,
    burnout: 15,
    reputation: 640,
    friendship: 50,
    salaryDemand: 50,
    preferredPlatform: PlatformId.AMIGA_500,
    status: "idle",
    bio: "Prolific artist on Commodore Amiga. Excellent with metal textures and robotic pixel logos."
  },
  "trix_art": {
    id: "trix_art",
    name: "Garry G.",
    handle: "Trix",
    avatarSeed: 502,
    role: "scene_npc",
    groupId: "fairlight",
    skills: { coding: 20, music: 20, graphics: 94, organization: 50 },
    specialty: SpecialtyType.PixelPerfectionist,
    motivation: 88,
    burnout: 8,
    reputation: 780,
    friendship: 52,
    salaryDemand: 70,
    preferredPlatform: PlatformId.C64,
    status: "idle",
    bio: "C64 multi-color pixel master. Known for pushing the VIC-II's palette constraints to complete hyper-real portraits."
  },
  "chaos_coder": {
    id: "chaos_coder",
    name: "Claudio G.",
    handle: "Chaos",
    avatarSeed: 601,
    role: "scene_npc",
    groupId: "farbrausch",
    skills: { coding: 99, music: 40, graphics: 50, organization: 70 },
    specialty: SpecialtyType.OpenGLPioneer,
    motivation: 98,
    burnout: 5,
    reputation: 950,
    friendship: 35,
    salaryDemand: 120,
    preferredPlatform: PlatformId.PC_PENTIUM_III,
    status: "idle",
    bio: "Pioneer of extreme software procedural compression and DirectX API tricks. Main coder behind '.fr-08: Werkzeug'."
  },
  "ranger_c64": {
    id: "ranger_c64",
    name: "Morten S.",
    handle: "Ranger",
    avatarSeed: 703,
    role: "scene_npc",
    groupId: null,
    skills: { coding: 80, music: 40, graphics: 45, organization: 75 },
    specialty: SpecialtyType.AssemblyWizard,
    motivation: 80,
    burnout: 25,
    reputation: 420,
    friendship: 70,
    salaryDemand: 30,
    preferredPlatform: PlatformId.C64,
    status: "idle",
    bio: "Freelance 8-bit assembly freak. Passionate about 6502 register instructions and low-level raster line hacks."
  },
  "audio_drifter": {
    id: "audio_drifter",
    name: "Marc H.",
    handle: "Drifter",
    avatarSeed: 808,
    role: "scene_npc",
    groupId: null,
    skills: { coding: 30, music: 85, graphics: 50, organization: 60 },
    specialty: SpecialtyType.TrackerLegend,
    motivation: 85,
    burnout: 10,
    reputation: 390,
    friendship: 65,
    salaryDemand: 25,
    preferredPlatform: PlatformId.AMIGA_500,
    status: "idle",
    bio: "A highly motivated tracker musician who composes upbeat chiptunes and Amiga synth loops."
  },
  "vectra_pixel": {
    id: "vectra_pixel",
    name: "Sonia R.",
    handle: "Vectra",
    avatarSeed: 909,
    role: "scene_npc",
    groupId: null,
    skills: { coding: 15, music: 20, graphics: 84, organization: 40 },
    specialty: SpecialtyType.PixelPerfectionist,
    motivation: 90,
    burnout: 5,
    reputation: 310,
    friendship: 75,
    salaryDemand: 20,
    preferredPlatform: PlatformId.PC_386,
    status: "idle",
    bio: "Enthusiastic female pixel artist starting in VGA mode 13h. Loves copper colors and space backgrounds."
  },
  "hype_ops": {
    id: "hype_ops",
    name: "Dirk M.",
    handle: "Hype",
    avatarSeed: 101,
    role: "scene_npc",
    groupId: null,
    skills: { coding: 20, music: 30, graphics: 40, organization: 88 },
    specialty: SpecialtyType.OrganizerExtraordinaire,
    motivation: 92,
    burnout: 12,
    reputation: 400,
    friendship: 80,
    salaryDemand: 15,
    preferredPlatform: PlatformId.AMIGA_500,
    status: "idle",
    bio: "An energetic BBS sysop and organizer. Knows every swapper in Europe and spreads disk magazines wide and far."
  }
};

export const INITIAL_GROUPS: Record<string, Group> = {
  "future_crew": {
    id: "future_crew",
    name: "Future Crew",
    isPlayerGroup: false,
    fanbase: 1200,
    reputation: 950,
    memberIds: ["purple_motion", "skaven", "unreal_coder"],
    releaseIds: [],
    hqLocation: "Finland",
    motto: "Simply the king of PC real-time rendering."
  },
  "razor_1911": {
    id: "razor_1911",
    name: "Razor 1911",
    isPlayerGroup: false,
    fanbase: 1100,
    reputation: 800,
    memberIds: ["dxyre"],
    releaseIds: [],
    hqLocation: "Norway / Sweden",
    motto: "Demolishing boundaries since the 1911 era."
  },
  "fairlight": {
    id: "fairlight",
    name: "Fairlight",
    isPlayerGroup: false,
    fanbase: 1050,
    reputation: 880,
    memberIds: ["trix_art"],
    releaseIds: [],
    hqLocation: "Sweden",
    motto: "A legendary family of coders, crackers, and pixel pioneers."
  },
  "farbrausch": {
    id: "farbrausch",
    name: "Farbrausch",
    isPlayerGroup: false,
    fanbase: 950,
    reputation: 920,
    memberIds: ["chaos_coder"],
    releaseIds: [],
    hqLocation: "Germany",
    motto: "Procedural beauty packed in few kilobytes."
  }
};

export const PARTY_CALENDAR: PartyEvent[] = [
  {
    id: "breakpoint",
    name: "Breakpoint",
    month: 4, // Easter / April
    isAnnual: true,
    platformFocus: "amiga",
    attendance: 1200,
    prestige: 80,
    competitions: [
      { type: ProductionType.Demo, prizePool: 800, entrants: [] },
      { type: ProductionType.Intro64k, prizePool: 400, entrants: [] }
    ],
    headlineNews: "Breakpoint gathers hackers in Germany for non-stop floppy swap and massive Amiga competitions.",
    location: "Bingen, Germany"
  },
  {
    id: "assembly_summer",
    name: "Assembly Summer",
    month: 8, // August
    isAnnual: true,
    platformFocus: "all",
    attendance: 3500,
    prestige: 98,
    competitions: [
      { type: ProductionType.Demo, prizePool: 2500, entrants: [] },
      { type: ProductionType.Intro64k, prizePool: 1200, entrants: [] },
      { type: ProductionType.Intro4k, prizePool: 800, entrants: [] }
    ],
    headlineNews: "Assembly hosts the peak competition of the year in Helsinki. Thousands of computers wired to local network hubs.",
    location: "Helsinki, Finland"
  },
  {
    id: "the_party",
    name: "The Party",
    month: 12, // December
    isAnnual: true,
    platformFocus: "all",
    attendance: 2000,
    prestige: 85,
    competitions: [
      { type: ProductionType.Demo, prizePool: 1500, entrants: [] },
      { type: ProductionType.Intro64k, prizePool: 750, entrants: [] },
      { type: ProductionType.Cracktro, prizePool: 300, entrants: [] }
    ],
    headlineNews: "Danish end-of-year spectacle featuring legendary 16-bit and PC demo battles inside active ice hockey arenas.",
    location: "Aars, Denmark"
  }
];

export const HISTORIC_RIVAL_RELEASES: Record<string, any>[] = [
  {
    name: "Second Reality",
    group: "Future Crew",
    platform: PlatformId.PC_486,
    score: 98,
    year: 1993,
    month: 8,
    description: "Undisputed masterpiece of PC rendering history, introduced voxel mountains and rotating spheres."
  },
  {
    name: "State of the Art",
    group: "Spaceballs",
    platform: PlatformId.AMIGA_500,
    score: 92,
    year: 1992,
    month: 4,
    description: "Shocked the Amiga group by emphasizing stylistic vector animations and techno beats over dry maths code."
  },
  {
    name: "Hardwired",
    group: "The Silents & Crionics",
    platform: PlatformId.AMIGA_500,
    score: 95,
    year: 1991,
    month: 12,
    description: "An incredible Amiga presentation showcasing dynamic scaling, zoom routines, and vector polygons."
  },
  {
    name: ".fr-08: Werkzeug",
    group: "Farbrausch",
    platform: PlatformId.PC_PENTIUM_III,
    score: 96,
    year: 2000,
    month: 12,
    description: "A gorgeous 64KB masterpiece with custom procedural music synthesizers and full texture rendering."
  },
  {
    name: "Panic",
    group: "Future Crew",
    platform: PlatformId.PC_386,
    score: 85,
    year: 1992,
    month: 8,
    description: "High speed VGA effects that demonstrated what PC CPUs could do without custom math chipsets."
  },
  {
    name: "Deus Ex Machina",
    group: "Crest",
    platform: PlatformId.C64,
    score: 90,
    year: 2000,
    month: 8,
    description: "Pushed 1MHz 6502 assembler to display incredible voxel fields and fluid pixel routines."
  }
];
