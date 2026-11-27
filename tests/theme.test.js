import assert from 'node:assert/strict'
import test from 'node:test'
import {
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  getInitialTheme,
  isValidTheme,
  resolveInitialTheme,
  saveThemePreference,
  toggleTheme,
} from '../src/lib/theme.js'

test('THEME_OPTIONS only exposes light and dark themes', () => {
  assert.deepEqual(
    THEME_OPTIONS.map((option) => option.id),
    ['light', 'dark'],
  )
})

test('isValidTheme validates only light and dark theme ids', () => {
  assert.equal(isValidTheme('light'), true)
  assert.equal(isValidTheme('dark'), true)
  assert.equal(isValidTheme('sepia'), false)
  assert.equal(isValidTheme('system'), false)
  assert.equal(isValidTheme(null), false)
})

test('resolveInitialTheme uses saved theme or falls back to OS preference', () => {
  assert.equal(resolveInitialTheme('light', true), 'light')
  assert.equal(resolveInitialTheme('dark', false), 'dark')
  assert.equal(resolveInitialTheme('sepia', true), 'dark')
  assert.equal(resolveInitialTheme(null, true), 'dark')
  assert.equal(resolveInitialTheme(null, false), 'light')
})

test('getInitialTheme and saveThemePreference read/write safely from storage', () => {
  const memory = new Map()
  const mockStorage = {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, val) => memory.set(key, String(val)),
  }

  assert.equal(getInitialTheme(mockStorage, false), 'light')
  assert.equal(getInitialTheme(mockStorage, true), 'dark')

  saveThemePreference('dark', mockStorage)
  assert.equal(memory.get(THEME_STORAGE_KEY), 'dark')
  assert.equal(getInitialTheme(mockStorage, false), 'dark')

  saveThemePreference('sepia', mockStorage)
  assert.equal(getInitialTheme(mockStorage, false), 'dark')
})

test('toggleTheme switches between light and dark themes', () => {
  assert.equal(toggleTheme('light'), 'dark')
  assert.equal(toggleTheme('dark'), 'light')
})
