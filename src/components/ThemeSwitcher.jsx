import { toggleTheme } from '../lib/theme.js'

export default function ThemeSwitcher({ theme, onChange }) {
  const isDark = theme === 'dark'
  const label = isDark ? 'Ubah ke tema terang' : 'Ubah ke tema gelap'

  return (
    <button
      type="button"
      className="inline-flex h-9.5 w-9.5 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-surface text-heading shadow-xs transition-colors hover:border-accent hover:bg-surface-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      onClick={() => onChange(toggleTheme(theme))}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[18px] w-[18px] fill-none stroke-current stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[18px] w-[18px] fill-none stroke-current stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
        </svg>
      )}
    </button>
  )
}
