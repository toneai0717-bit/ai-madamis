export type Role = "user" | "model";

export interface Msg {
  role: Role;
  text: string;
}

export interface PublicSuspect {
  id: string;
  name: string;
  title: string;
}

export interface Option {
  id: string;
  label: string;
}

export interface TruthSuspect {
  id: string;
  name: string;
  persona: string;
  alibi: string;
  secret: string;
  knownFacts: string[];
  isCulprit: boolean;
}

export interface Truth {
  victim: string;
  culpritId: string;
  trueWeapon: string;
  trueMotive: string;
  trick: string;
  decisiveContradiction: string;
  suspects: TruthSuspect[];
}

export interface VerdictResult {
  correct: { culprit: boolean; weapon: boolean; motive: boolean };
  win: boolean;
  text: string;
}
