/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlatformId {
  C64 = "C64",
  ZX_SPECTRUM = "ZX_SPECTRUM",
  AMIGA_500 = "AMIGA_500",
  AMIGA_1200 = "AMIGA_1200",
  ATARI_ST = "ATARI_ST",
  PC_386 = "PC_386",
  PC_486 = "PC_486",
  PC_PENTIUM = "PC_PENTIUM",
  PC_PENTIUM_II = "PC_PENTIUM_II",
  PC_PENTIUM_III = "PC_PENTIUM_III"
}

export enum EraId {
  ERA_8_BIT = "ERA_8_BIT",       // 1985-1889
  ERA_16_BIT = "ERA_16_BIT",     // 1990-1995
  ERA_PC_DAWN = "ERA_PC_DAWN",   // 1996-2000
  ERA_3D_SHADER = "ERA_3D_SHADER"// 2001-2005
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  year: number;
  cost: number;
  cpuLimit: number;      // Arbitrary power units
  ramLimitKb: number;    // Available RAM
  graphicsMaxColors: number;
  audioChannels: number;
  audioTech: string;
  graphicsTech: string;
  description: string;
}

export enum SkillType {
  Coding = "Coding",
  Music = "Music",
  Graphics = "Graphics",
  Organization = "Organization"
}

export enum SpecialtyType {
  AssemblyWizard = "Assembly Wizard",
  TrackerLegend = "Tracker Legend",
  PixelPerfectionist = "Pixel Perfectionist",
  OpenGLPioneer = "OpenGL Pioneer",
  EffectCoder = "Effect Coder",
  DemoDirector = "Demo Director",
  OrganizerExtraordinaire = "Organizer",
  CrackerSwapper = "Swapper/BBS Op"
}

export interface SkillSet {
  coding: number;       // 1 - 100
  music: number;        // 1 - 100
  graphics: number;     // 1 - 100
  organization: number; // 1 - 100
}

export interface MemoryItem {
  id: string;
  type: "bbs_post" | "demo_release" | "party_event" | "rivalry" | "legendary_release" | "betrayal";
  description: string;
  timestamp: string; // "Y1990 M5" etc.
  strength: number;  // 0 - 100 memory decay indicator
  sentiment: "positive" | "negative" | "neutral";
}

export interface CognitiveModel {
  shortTermMemory: MemoryItem[];
  longTermMemory: MemoryItem[];
  opinionVectors: Record<string, number>; // entity (e.g. group, coder, technology name) -> score (-100 to 100)
  emotionalState: {
    stress: number;      // 0 - 100
    hype: number;        // 0 - 100
    burnout: number;     // 0 - 100 (keeps general track of tension)
    inspiration: number;  // 0 - 100
  };
  trustGraph: Record<string, number>; // otherNPCId -> trust percentage (0 - 100)
}

export interface Character {
  id: string;
  name: string;
  handle: string;
  avatarSeed: number;
  role: "player" | "crew" | "scene_npc";
  groupId: string | null; // null if freelance, special IDs for rivals
  skills: SkillSet;
  specialty: SpecialtyType;
  motivation: number;  // 0 - 100
  burnout: number;     // 0 - 100
  reputation: number;  // 0 - 1000
  friendship: number;  // 0 - 100 with player
  salaryDemand: number; // Cost in pocket change (monthly) or disk supplies
  joiningDate?: string;
  preferredPlatform: PlatformId;
  status: "idle" | "coding" | "arranging" | "drawing" | "burnt_out" | "retired";
  bio: string;
  cognitive?: CognitiveModel;
}

export interface DemoEffect {
  id: string;
  name: string;
  era: EraId;
  minPlatform: PlatformId;
  cpuCost: number;       // power units
  ramCostKb: number;     // RAM cost
  difficulty: number;    // 1 - 100
  originality: number;   // 1 - 100
  audienceAppeal: number; // 1 - 100
  category: "vector" | "raster" | "procedural" | "rendering" | "pixel_trick";
  description: string;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  costPoints: number;
  preRequisiteIds: string[];
  era: EraId;
  platformUnlocks: PlatformId[];
  effectUnlocks: string[]; // List of DemoEffect IDs unlocked
  bonusAttribute?: {
    type: "coding" | "music" | "graphics" | "size_reduction" | "optimization";
    value: number;
  };
  researched: boolean;
}

export enum ProductionType {
  Demo = "Mega-Demo",
  Intro64k = "64KB Intro",
  Intro4k = "4KB Intro",
  MusicDisk = "Music Disk",
  Cracktro = "Cracktro/Trainer",
  ArtSlide = "Slide Show"
}

export interface Production {
  id: string;
  name: string;
  year: number;
  month: number;
  type: ProductionType;
  platform: PlatformId;
  groupName: string;
  effects: string[]; // DemoEffect ids included
  codingEffort: number;
  artEffort: number;
  musicEffort: number;
  optimizationLevel: number; // 1 - 5
  compressionLevel: number;  // 1 - 5
  sizeB: number; // Actual size in bytes calculated
  scoreTechnical: number; // 0 - 100
  scoreAesthetic: number; // 0 - 100
  scoreAudio: number;     // 0 - 100
  scoreOriginality: number; // 0 - 100
  totalScore: number;     // calculated average/weighted
  reputationGained: number;
  placement?: number; // Post-party competition ranking
  partyName?: string;
}

export interface Group {
  id: string;
  name: string;
  isPlayerGroup: boolean;
  fanbase: number;
  reputation: number;
  memberIds: string[];
  releaseIds: string[];
  hqLocation: string;
  motto: string;
}

export interface SceneMagazine {
  id: string;
  title: string;
  year: number;
  month: number;
  headline: string;
  body: string;
  type: "review" | "scandal" | "tech_breakthrough" | "party_results" | "editorial";
}

export interface PartyEvent {
  id: string;
  name: string;
  month: number; // 1 - 12
  isAnnual: boolean;
  platformFocus: "all" | "amiga" | "c64" | "pc";
  attendance: number;
  prestige: number; // 0 - 100
  competitions: {
    type: ProductionType;
    prizePool: number;
    entrants: string[]; // list of prod IDs
  }[];
  headlineNews: string;
  location: string;
}

export interface SaveGame {
  playerMoney: number;
  playerReputation: number;
  currentYear: number;
  currentMonth: number;
  currentPlatform: PlatformId;
  playerHandle: string;
  playerRealName: string;
  playerGroupCreated: boolean;
  playerGroupId: string;
  ownedPlatforms: PlatformId[];
  researchedTechIds: string[];
  characters: Record<string, Character>;
  groups: Record<string, Group>;
  releases: Record<string, Production>;
  newsLog: SceneMagazine[];
  currentDateStr: string;
}

export type SocialNodeType = "npc" | "group" | "tool" | "demo" | "event";

export interface SocialNode {
  id: string;
  type: SocialNodeType;
  label: string;
  reputation?: number;
  groupName?: string;
  details?: string;
}

export type SocialEdgeType = "friendship" | "rivalry" | "collaboration" | "influence" | "inspiration" | "technical_dependency";

export interface SocialEdge {
  id: string;
  source: string;
  sourceType: SocialNodeType;
  target: string;
  targetType: SocialNodeType;
  type: SocialEdgeType;
  weight: number; // 0 - 100 rating
  details?: string;
}

export interface SocialGraph {
  nodes: SocialNode[];
  edges: SocialEdge[];
}

export type BBSInfoType = 
  | "rumor"
  | "leak"
  | "technical_discovery"
  | "demo_announcement"
  | "party_gossip"
  | "tool_release"
  | "criticism";

export interface BBSMessage {
  sender: string;
  text: string;
  color?: string;
}

export interface BBSThread {
  id: string;
  board: string;
  topic: string;
  year: number;
  month: number;
  actorId: string;
  messages: BBSMessage[];
  interacted: boolean;
  playerActionTaken: string | null;
  dramaFinished: boolean;
  choices: Array<{
    text: string;
    type: string;
    effectDescription: string;
  }>;
  followed?: boolean;
  
  // Information Economy fields
  infoType: BBSInfoType;
  credibilityScore: number;     // 0 - 100
  propagationSpeed: number;     // 1 - 100
  distortionRate: number;       // 0 - 100
  influenceWeight: number;      // 1 - 100
  viralSpreadRank: number;      // 1 = normal, 2 = trending, 3 = viral, 4 = epidemic
  isSuppressed: boolean;
  originalTopic: string;
  mutationCount: number;
}


