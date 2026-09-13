const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

/** 카테고리별 커스텀 라인 아이콘. 실제 사진 대신 일관된 스타일의 그림으로 재료 종류를 구분한다. */
export function MeatGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M9 15c-2.5-2.5-2.7-6.4-.4-8.7a5.8 5.8 0 0 1 8.2 0c2.4 2.4 2.2 6.5-.5 9.1L12 20l-5-5z" />
      <circle cx="12.3" cy="10.2" r="1.6" />
    </svg>
  )
}

export function FishGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M3 12c3-4 8-6 12-4.5 2 .8 3.6 2.4 4.5 4.5-1 2-2.6 3.6-4.6 4.4C11 18 6 16 3 12Z" />
      <path d="M19.5 12 22 9.5M19.5 12 22 14.5" />
      <circle cx="8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function EggGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M12 3c3.3 3.6 5.5 8 5.5 11.2A5.5 5.5 0 0 1 12 20a5.5 5.5 0 0 1-5.5-5.8C6.5 11 8.7 6.6 12 3Z" />
    </svg>
  )
}

export function VegetableGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M12 8c3 0 6 2 6 6.5S15.5 21 12.5 21 7 18 7 14.2 9 8 12 8Z" />
      <path d="M12 8c0-2 .5-3.6 2-5M12 8c-1.4-1-2-2.6-2-4.6" />
    </svg>
  )
}

export function FruitGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M12 9.5c3.6 0 6.5 2.6 6.5 6.2S16 21 13 21c-.7 0-1.4-.2-2-.5-.6.3-1.3.5-2 .5-3 0-5.5-1.7-5.5-5.3S8.4 9.5 12 9.5Z" />
      <path d="M12 9.5V6.5M12 6.5c0-1.4 1-2.5 2.6-2.9" />
    </svg>
  )
}

export function DairyGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M9 3h6v3.2L17 9v10a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V9l2-2.8Z" />
      <line x1="7" y1="12.5" x2="17" y2="12.5" />
    </svg>
  )
}

export function GrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M4 17c0-5 3.6-9 8-9s8 4 8 9v1H4Z" />
      <path d="M8 18v-4.5M12 18V11M16 18v-4.5" />
    </svg>
  )
}

export function NoodleGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M4 12c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M5 12l1 6.5a1 1 0 0 0 1 .9h10a1 1 0 0 0 1-.9L19 12" />
      <path d="M9 8.5c0 1.3.8 1.3.8 2.6M13 7.8c0 1.4.9 1.4.9 2.8" />
    </svg>
  )
}

export function ProcessedGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <rect x="6" y="7" width="12" height="13" rx="1.5" />
      <path d="M8 7V4.5h8V7" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  )
}

export function SeasoningGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M9.5 3h5l.7 3.2c1.6 1 2.8 3 2.8 5.7 0 5-3.4 9.1-6 9.1s-6-4-6-9.1c0-2.7 1.2-4.7 2.8-5.7L9.5 3Z" />
      <line x1="9" y1="10.5" x2="15" y2="10.5" />
    </svg>
  )
}

export function DessertGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M7 11h10l-1 8.2a1 1 0 0 1-1 .8H9a1 1 0 0 1-1-.8L7 11Z" />
      <path d="M6.5 11a5.5 5.5 0 0 1 11 0" />
      <path d="M12 5.5V3" />
    </svg>
  )
}

export function DrinkGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M8 3h8l-1 5.5H9L8 3Z" />
      <path d="M9 8.5 9.9 20a1 1 0 0 0 1 .9h2.2a1 1 0 0 0 1-.9l.9-11.5" />
      <line x1="9.6" y1="13.5" x2="14.4" y2="13.5" />
    </svg>
  )
}

export function DefaultGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
      <path d="M6 8h12l-1 11.2a1.5 1.5 0 0 1-1.5 1.3h-7A1.5 1.5 0 0 1 7 19.2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}
