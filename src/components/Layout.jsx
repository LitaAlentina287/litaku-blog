import { Link, NavLink } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher.jsx'

function getNavLinkClass({ isActive }) {
  const base =
    'rounded-lg px-3 py-1.5 text-[0.92rem] font-medium no-underline transition-colors'
  return isActive
    ? `${base} bg-accent-soft text-accent`
    : `${base} text-muted hover:bg-surface-muted hover:text-heading`
}

export default function Layout({ theme, onThemeChange, children }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-header backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1020px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3.5 sm:gap-7">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-heading no-underline"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent font-serif text-[1.05rem] font-bold text-accent-contrast shadow-xs"
                aria-hidden="true"
              >
                L
              </span>
              <span className="font-serif text-[1.3rem] font-bold tracking-[-0.02em]">
                LitaKu
              </span>
            </Link>

            <nav className="flex items-center gap-1.5" aria-label="Navigasi utama">
              <NavLink to="/" end className={getNavLinkClass}>
                Artikel
              </NavLink>
              <NavLink
                to="/artikel/biografi-penulis"
                className={getNavLinkClass}
              >
                Biografi
              </NavLink>
            </nav>
          </div>

          <ThemeSwitcher theme={theme} onChange={onThemeChange} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1020px] flex-1 px-4 pt-7 pb-14 sm:px-6 sm:pt-9 sm:pb-18">
        {children}
      </main>

      <footer className="border-t border-line py-6.5 text-[0.88rem] text-muted">
        <div className="mx-auto flex w-full max-w-[1020px] flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <strong className="font-serif text-heading">LitaKu</strong> &middot;
            Catatan belajar Teknik Informatika &amp; <em>Learning in Public</em>.
          </div>
          <div className="flex items-center gap-4.5">
            <Link
              to="/"
              className="text-muted no-underline transition-colors hover:text-accent"
            >
              Semua Artikel
            </Link>
            <Link
              to="/artikel/biografi-penulis"
              className="text-muted no-underline transition-colors hover:text-accent"
            >
              Biografi Penulis
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
