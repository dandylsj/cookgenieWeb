const common = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon() {
  return (
    <svg {...common}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5v-6h5v6H17.5a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function FridgeIcon() {
  return (
    <svg {...common}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <line x1="5" y1="10.5" x2="19" y2="10.5" />
      <line x1="8" y1="5.5" x2="8" y2="7.5" />
      <line x1="8" y1="13.5" x2="8" y2="15.5" />
    </svg>
  )
}

export function RecipeIcon() {
  return (
    <svg {...common}>
      <path d="M6 3v18" />
      <path d="M6 3c-1.5 1-1.5 5 0 6" />
      <path d="M6 9v12" />
      <path d="M18 3c-2.5 0-4 2-4 5s1.5 4 4 4" />
      <path d="M18 3v18" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg {...common}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </svg>
  )
}

export function CartIcon() {
  return (
    <svg {...common}>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2.2l2.1 12h11.4l1.8-8H6" />
    </svg>
  )
}

export function ShareIcon() {
  return (
    <svg {...common}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <line x1="8.2" y1="10.8" x2="15.8" y2="6.7" />
      <line x1="8.2" y1="13.2" x2="15.8" y2="17.3" />
    </svg>
  )
}

export function SettingsIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.6 7.3l2.1 1.2M17.3 15.5l2.1 1.2M4.6 16.7l2.1-1.2M17.3 8.5l2.1-1.2M3.5 12h2.4M18.1 12h2.4" />
    </svg>
  )
}

export function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
