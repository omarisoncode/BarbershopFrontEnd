import React from 'react';

const KUWAIT_FLAG_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path fill="#fff" d="M0 0h640v480H0z"/>
    <path fill="#007a3d" d="M0 0h640v160H0z"/>
    <path fill="#ce1126" d="M0 320h640v160H0z"/>
    <path d="M0 0l180 120v240L0 480z"/>
  </svg>
`);

const KUWAIT_FLAG_SRC = `data:image/svg+xml;charset=UTF-8,${KUWAIT_FLAG_SVG}`;

export default function KuwaitFlagBadge({ className = '' }) {
  return (
    <img
      src={KUWAIT_FLAG_SRC}
      alt='Kuwait flag'
      className={className}
      loading='eager'
      decoding='async'
    />
  );
}
