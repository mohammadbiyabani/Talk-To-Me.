export interface TechStackItem {
  category: string;
  recommended: string;
  alternatives: string[];
  rationale: string;
  pros: string[];
  cons: string[];
  productionNotes: string;
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  sqlDdl: string;
  roomEntity: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  focus: string;
  milestones: string[];
  deliverables: string[];
}

export interface CryptoStep {
  id: string;
  title: string;
  protocol: string;
  description: string;
  keysInvolved: string[];
  securityGuarantee: string;
}

export type ActiveTab = 
  | 'overview'
  | 'mobile-client'
  | 'security-hardening'
  | 'tech-stack'
  | 'e2ee'
  | 'file-handling'
  | 'ephemeral'
  | 'database'
  | 'roadmap'
  | 'spec-doc';
