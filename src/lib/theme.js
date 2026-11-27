export const THEME_STORAGE_KEY = 'blogku-theme'

export const THEME_OPTIONS = [
  { id: 'light', label: 'Terang', description: 'Tema terang' },
  { id: 'dark', label: 'Gelap', description: 'Tema gelap' },
]

const VALID_THEME_IDS = new Set(THEME_OPTIONS.map((option) => option.id))

/**
 * Check whether a theme id is supported ('light' or 'dark').
 */
export function isValidTheme(themeId) {
  return typeof themeId === 'string' && VALID_THEME_IDS.has(themeId)
}

/**
 * Resolve initial theme from saved value or OS preference fallback.
 */
export function resolveInitialTheme(savedTheme, prefersDark = false) {
  if (isValidTheme(savedTheme)) return savedTheme
  return prefersDark ? 'dark' : 'light'
}

/**
 * Read initial theme from localStorage with OS color-scheme fallback.
 */
export function getInitialTheme(
  storage = globalThis.localStorage,
  prefersDark,
) {
  const systemPrefersDark =
    typeof prefersDark === 'boolean'
      ? prefersDark
      : typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches

  try {
    const saved = storage?.getItem(THEME_STORAGE_KEY)
    return resolveInitialTheme(saved, systemPrefersDark)
  } catch {
    return resolveInitialTheme(null, systemPrefersDark)
  }
}

/**
 * Persist selected theme ('light' or 'dark') safely to localStorage.
 */
export function saveThemePreference(
  themeId,
  storage = globalThis.localStorage,
) {
  if (!isValidTheme(themeId)) return
  try {
    storage?.setItem(THEME_STORAGE_KEY, themeId)
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

/**
 * Toggle between light and dark themes.
 */
export function toggleTheme(currentTheme) {
  return currentTheme === 'dark' ? 'light' : 'dark'
}

/**
 * Apply the selected theme to the document root.
 */
export function applyThemePreference(themeId) {
  const effective = isValidTheme(themeId) ? themeId : 'light'
  if (typeof document === 'undefined') return effective

  document.documentElement.dataset.theme = effective
  document.documentElement.style.colorScheme = effective
  return effective
}
