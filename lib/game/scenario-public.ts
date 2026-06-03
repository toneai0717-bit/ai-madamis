// クライアントに渡してよい「公開情報」のみ。真相は scenario-truth.ts(サーバー専用) に隔離する。
import type { PublicSuspect, Option } from "./types";

export const MAX_TURNS = 20;

export const VICTIM = "館主・黒岩剛三";

export const SCENE_INTRO = `深夜、雪深い山中に建つ「霧ヶ峰山荘」。折からの吹雪で道は閉ざされ、外部との連絡も断たれた。
今朝、館主・黒岩剛三が二階の書斎で遺体となって発見された。山荘に残された容疑者は三人。
あなたは偶然居合わせた探偵として、彼らを尋問し、犯人・凶器・動機を見抜かなければならない。`;

export const SUSPECTS_PUBLIC: PublicSuspect[] = [
  { id: "a", name: "黒岩 美咲", title: "被害者の姪" },
  { id: "b", name: "三上 健司", title: "被害者の秘書" },
  { id: "c", name: "白石 涼子", title: "賓客・医師" },
];

export const WEAPON_OPTIONS: Option[] = [
  { id: "statue", label: "ブロンズ像" },
  { id: "knife", label: "ナイフ" },
  { id: "poison", label: "毒物" },
];

export const MOTIVE_OPTIONS: Option[] = [
  { id: "inheritance", label: "遺産相続" },
  { id: "embezzlement", label: "横領の隠蔽" },
  { id: "grudge", label: "医療ミスへの怨恨" },
];

export function suspectName(id: string): string {
  return SUSPECTS_PUBLIC.find((s) => s.id === id)?.name ?? id;
}
export function weaponLabel(id: string): string {
  return WEAPON_OPTIONS.find((w) => w.id === id)?.label ?? id;
}
export function motiveLabel(id: string): string {
  return MOTIVE_OPTIONS.find((m) => m.id === id)?.label ?? id;
}
