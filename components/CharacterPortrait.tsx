// キャラクターごとのSVGポートレート（ノワール調シルエット）
// 絵文字不使用、SVGのみ

interface PortraitProps {
  size?: number;
  className?: string;
}

// 黒岩 美咲 — 若い女性、長髪、腕組み、鋭い目つき
export function MisakiPortrait({ size = 80, className = "" }: PortraitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景円 */}
      <circle cx="40" cy="40" r="40" fill="#1d2330" />
      {/* 肩・胴 */}
      <path d="M10 80 Q15 58 22 54 Q31 50 40 50 Q49 50 58 54 Q65 58 70 80Z" fill="#2a3140" />
      {/* 首 */}
      <rect x="35" y="42" width="10" height="10" rx="2" fill="#9aa2b1" />
      {/* 顔 */}
      <ellipse cx="40" cy="34" rx="14" ry="16" fill="#9aa2b1" />
      {/* 長髪（左） */}
      <path d="M26 30 Q22 20 25 10 Q30 4 36 6 Q32 14 30 28Z" fill="#3a4255" />
      {/* 長髪（右） */}
      <path d="M54 30 Q58 20 55 10 Q50 4 44 6 Q48 14 50 28Z" fill="#3a4255" />
      {/* 前髪 */}
      <path d="M28 26 Q32 16 40 14 Q48 16 52 26 Q46 22 40 22 Q34 22 28 26Z" fill="#3a4255" />
      {/* 目（鋭め） */}
      <path d="M32 32 Q34 30 37 31" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 31 Q46 30 48 32" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      {/* 瞳 */}
      <circle cx="34.5" cy="32" r="1.5" fill="#1d2330" />
      <circle cx="45.5" cy="32" r="1.5" fill="#1d2330" />
      {/* 口（への字） */}
      <path d="M37 40 Q40 38 43 40" stroke="#7a8899" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 三上 健司 — 中年男性、短髪、慇懃な笑み
export function MikamiPortrait({ size = 80, className = "" }: PortraitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景円 */}
      <circle cx="40" cy="40" r="40" fill="#1d2330" />
      {/* 肩・スーツ */}
      <path d="M8 80 Q14 56 22 52 Q31 49 40 49 Q49 49 58 52 Q66 56 72 80Z" fill="#2a3140" />
      {/* ネクタイ */}
      <path d="M38 49 L40 58 L42 49Z" fill="#d98a3d" opacity="0.7" />
      {/* 首 */}
      <rect x="36" y="43" width="8" height="8" rx="1" fill="#8a9aaa" />
      {/* 顔（やや丸め） */}
      <ellipse cx="40" cy="33" rx="13" ry="15" fill="#8a9aaa" />
      {/* 短髪 */}
      <path d="M27 30 Q27 16 40 14 Q53 16 53 30 Q50 22 40 21 Q30 22 27 30Z" fill="#3a4255" />
      {/* もみあげ */}
      <rect x="27" y="28" width="3" height="8" rx="1.5" fill="#3a4255" />
      <rect x="50" y="28" width="3" height="8" rx="1.5" fill="#3a4255" />
      {/* 目（細め、穏やか） */}
      <path d="M32 31 Q35 29 38 31" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 31 Q45 29 48 31" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="31" r="1.5" fill="#1d2330" />
      <circle cx="45" cy="31" r="1.5" fill="#1d2330" />
      {/* 薄い笑み */}
      <path d="M36 40 Q40 43 44 40" stroke="#6a7a8a" strokeWidth="1.2" strokeLinecap="round" />
      {/* 眉（平静） */}
      <path d="M31 27 Q35 26 38 27" stroke="#3a4255" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M42 27 Q45 26 49 27" stroke="#3a4255" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 白石 涼子 — 落ち着いた女性医師、髪をまとめている
export function ShiraishiPortrait({ size = 80, className = "" }: PortraitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景円 */}
      <circle cx="40" cy="40" r="40" fill="#1d2330" />
      {/* 肩・上着 */}
      <path d="M10 80 Q16 58 24 54 Q32 50 40 50 Q48 50 56 54 Q64 58 70 80Z" fill="#2a3140" />
      {/* 白衣の襟ライン */}
      <path d="M32 50 Q36 46 40 50 Q44 46 48 50" stroke="#4a5568" strokeWidth="1.5" fill="none" />
      {/* 首 */}
      <rect x="36" y="43" width="8" height="9" rx="2" fill="#9aabb5" />
      {/* 顔（整った楕円） */}
      <ellipse cx="40" cy="33" rx="13" ry="15" fill="#9aabb5" />
      {/* まとめ髪（後ろ） */}
      <ellipse cx="40" cy="19" rx="12" ry="8" fill="#3a4255" />
      {/* お団子 */}
      <circle cx="40" cy="12" r="5" fill="#3a4255" />
      {/* サイドの後れ毛 */}
      <path d="M27 26 Q24 32 26 38" stroke="#3a4255" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M53 26 Q56 32 54 38" stroke="#3a4255" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* 目（静か・観察眼） */}
      <path d="M32 32 Q35 30 38 32" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 32 Q45 30 48 32" stroke="#1d2330" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="32" r="1.5" fill="#1d2330" />
      <circle cx="45" cy="32" r="1.5" fill="#1d2330" />
      {/* 落ち着いた口元 */}
      <path d="M37 40 Q40 41 43 40" stroke="#7a8a95" strokeWidth="1.2" strokeLinecap="round" />
      {/* 眉（涼しげ） */}
      <path d="M31 27 Q35 25 38 26" stroke="#3a4255" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M42 26 Q45 25 49 27" stroke="#3a4255" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// IDからポートレートを返すユーティリティ
export function PortraitById({ id, size, className }: { id: string; size?: number; className?: string }) {
  if (id === "a") return <MisakiPortrait size={size} className={className} />;
  if (id === "b") return <MikamiPortrait size={size} className={className} />;
  return <ShiraishiPortrait size={size} className={className} />;
}
