// 現場捜査スポット（クライアントに渡してOKな情報）
export interface SceneLocation {
  id: string;
  name: string;
  desc: string;
  clue: string;        // 調査後に表示するテキスト
  hasClue: boolean;    // 本当に有益な手がかりかどうか（UI演出用）
}

export const SCENE_LOCATIONS: SceneLocation[] = [
  // ── 有力手がかり ──────────────────────────────────────
  {
    id: "study_desk",
    name: "書斎の机",
    desc: "遺体のそばにあった机",
    clue: "引き出しに鍵のかかった帳簿があった。表紙には『H会計 — 三上』と走り書きがある。鍵は見当たらない。",
    hasClue: true,
  },
  {
    id: "fireplace",
    name: "書斎の暖炉",
    desc: "まだ灰が残っている",
    clue: "灰の中に、半分焼けた書類の切れ端。辛うじて読める文字は『横領』『2,800万』——残りは炭になっている。",
    hasClue: true,
  },
  {
    id: "corridor",
    name: "二階廊下",
    desc: "書斎へと続く廊下",
    clue: "カーペットに微かな泥の跡。書斎の扉の前から、21号室（三上の部屋）の方向へと続いている。",
    hasClue: true,
  },
  // ── 示唆あり ──────────────────────────────────────────
  {
    id: "mikami_door",
    name: "三上の部屋",
    desc: "21号室のドア前",
    clue: "施錠されている。ドアの隙間から、かすかに紙が焦げるような匂いがした。",
    hasClue: true,
  },
  {
    id: "kitchen",
    name: "台所",
    desc: "一階の調理場",
    clue: "流しにウィスキーのグラスが二つ、洗わずに置かれている。棚には三上がよく飲む銘柄のボトル。偶然かもしれない。",
    hasClue: true,
  },
  // ── 空振り（雰囲気のみ）────────────────────────────────
  {
    id: "misaki_room",
    name: "美咲の部屋",
    desc: "廊下の奥の部屋",
    clue: "ノックすると怒鳴り声が返ってきた。「誰？今は入らないで！誰も信用できない」——足音が遠ざかっていった。",
    hasClue: false,
  },
  {
    id: "entrance",
    name: "玄関ホール",
    desc: "山荘の入口",
    clue: "吹雪は一層激しくなっていた。出入口は完全に雪で塞がれている。警察はまだ来られない。",
    hasClue: false,
  },
  {
    id: "lounge_trash",
    name: "サロンのゴミ箱",
    desc: "一階サロンの隅",
    clue: "丸めた紙が一枚。広げると、三上の筆跡で「12日までに処理すること」とだけ書かれている。何の12日かは不明。",
    hasClue: false,
  },
];

// 自動発火するGMイベント（triggerAt = その残り回数になった瞬間に表示）
export interface GmEvent {
  id: string;
  triggerAt: number; // remaining がこの値になった時に発火
  title: string;
  text: string;
}

export const GM_EVENTS: GmEvent[] = [
  {
    id: "ev1",
    triggerAt: 14, // 6回消費後
    title: "目撃",
    text: "三上が廊下を早足で歩いていた。その手には薄い書類の束。あなたと目が合うと、何事もなかったように微笑んだ——書類をコートの内側に素早く仕舞い込むのを、あなたは見逃さなかった。",
  },
  {
    id: "note",
    triggerAt: 11, // 9回消費後
    title: "密告メモ",
    text: "あなたの部屋のドアの隙間に、折りたたんだ紙切れが差し込まれていた。\n\n「三上健司を信用するな。帳簿の数字が合わない。——名無し」\n\n差出人は不明。事実を告げているのか、罠なのか。",
  },
  {
    id: "ev2",
    triggerAt: 7, // 13回消費後
    title: "密談",
    text: "美咲が白石の腕を掴み、廊下の隅でひそひそ声を交わしているのを目撃した。白石が静かに頷く。美咲があなたに気づき、二人は揃って押し黙った。",
  },
];
