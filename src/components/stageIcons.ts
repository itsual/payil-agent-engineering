import {
  BrainCircuit, Container, FlaskConical, GraduationCap, LifeBuoy, MousePointerClick, Network,
  Plug, RefreshCcw, ShieldAlert, UserCheck, Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** One icon per stage, indexed by stage id − 1. */
export const stageIcons: LucideIcon[] = [
  Workflow,          // 01 architecture & state machines
  Plug,              // 02 tools & MCP
  MousePointerClick, // 03 computer use
  BrainCircuit,      // 04 memory
  Network,           // 05 multi-agent
  Container,         // 06 sandboxing
  ShieldAlert,       // 07 security
  UserCheck,         // 08 human approval
  RefreshCcw,        // 09 self-correction
  FlaskConical,      // 10 evals & CI
  LifeBuoy,          // 11 fallbacks
  GraduationCap,     // 12 portfolio
];

export const iconFor = (stageId: number): LucideIcon => stageIcons[stageId - 1] ?? Workflow;
