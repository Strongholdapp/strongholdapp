/* ============================================================
   Icons.js , ícones de linha em SVG (mesmos traços do PWA).
   Sem emoji na navegação: é o que dá cara de app de verdade.
   ============================================================ */

import React from "react";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Mask, Rect } from "react-native-svg";
import { colors } from "../theme/theme";

const base = (size, color) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export function HomeIcon({ size = 23, color = colors.muted2 }) {
  return (
    <Svg {...base(size, color)}>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5.5 9.2V20h13V9.2" />
    </Svg>
  );
}

export function ReportIcon({ size = 23, color = colors.muted2 }) {
  return (
    <Svg {...base(size, color)}>
      <Path d="M3 17l6-6 4 4 8-8" />
      <Path d="M17 7h4v4" />
    </Svg>
  );
}

export function ShieldIcon({ size = 23, color = colors.muted2 }) {
  return (
    <Svg {...base(size, color)}>
      <Path d="M12 3l7 2.6v5.2c0 4.6-3 8.1-7 9.9-4-1.8-7-5.3-7-9.9V5.6z" />
    </Svg>
  );
}

export function UsersIcon({ size = 23, color = colors.muted2 }) {
  return (
    <Svg {...base(size, color)}>
      <Circle cx="9" cy="8" r="3" />
      <Path d="M3.6 19.5a5.4 5.4 0 0 1 10.8 0" />
      <Path d="M16 6a3 3 0 0 1 0 5.8" />
      <Path d="M17.6 19.5a5.4 5.4 0 0 0-2.8-4.6" />
    </Svg>
  );
}

export function UserIcon({ size = 23, color = colors.muted2 }) {
  return (
    <Svg {...base(size, color)}>
      <Circle cx="12" cy="8" r="3.2" />
      <Path d="M5.7 19.6a6.3 6.3 0 0 1 12.6 0" />
    </Svg>
  );
}

/** Logo da marca: escudo dourado com a cruz vazada (mesmo SVG do funil). */
export function Logo({ size = 34 }) {
  const shield =
    "M256 122 C300 150 330 150 372 152 L372 288 C372 366 320 416 256 456 C192 416 140 366 140 288 L140 152 C182 150 212 150 256 122 Z";
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="shieldGold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ecc05a" />
          <Stop offset="1" stopColor="#d3a23c" />
        </LinearGradient>
        <Mask id="crossCut">
          <Path d={shield} fill="#fff" />
          <Rect x="229" y="196" width="54" height="214" fill="#000" />
          <Rect x="184" y="246" width="144" height="54" fill="#000" />
        </Mask>
      </Defs>
      <Path d={shield} fill="url(#shieldGold)" mask="url(#crossCut)" />
    </Svg>
  );
}

export default { HomeIcon, ReportIcon, ShieldIcon, UsersIcon, UserIcon, Logo };
