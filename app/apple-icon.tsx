import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same artwork as app/icon.svg, full-bleed (iOS rounds the corners itself).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#ebe5f5"/>
  <g transform="translate(32 32) scale(0.86) translate(-32 -32)">
    <circle cx="24" cy="25" r="15" fill="#cfc6e2"/>
    <circle cx="22" cy="23" r="15" fill="#ffb59a"/>
    <path d="M11 31 L6 42 L19 36 Z" fill="#ffb59a"/>
    <ellipse cx="17" cy="16" rx="5" ry="3" fill="#ffffff" opacity="0.45"/>
    <circle cx="42" cy="41" r="17" fill="#cbc1e0"/>
    <path d="M51 51 L59 59 L45 55 Z" fill="#cbc1e0"/>
    <circle cx="40" cy="39" r="17" fill="#9fd8c8"/>
    <path d="M49 49 L57 57 L43 53 Z" fill="#9fd8c8"/>
    <ellipse cx="34" cy="30" rx="6" ry="3.5" fill="#ffffff" opacity="0.5"/>
    <g fill="none" stroke="#1f5a4b" stroke-width="3.4" stroke-linecap="round">
      <path d="M31 36 q4.5 -4 9 0 t9 0"/>
      <path d="M31 44 q4.5 -4 9 0 t9 0"/>
    </g>
  </g>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={180} height={180} alt="" />,
    size,
  );
}
