import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan | LitaKu'
  }, [])

  return (
    <section className="mx-auto max-w-[720px] rounded-2xl border border-dashed border-line bg-surface px-7 py-11 text-center">
      <h1 className="mb-2 font-serif text-2xl font-bold text-heading">
        Halaman tidak ditemukan
      </h1>
      <p className="text-muted">
        Halaman yang Anda cari tidak tersedia di blog ini.
      </p>
      <Link
        to="/"
        className="mt-4.5 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-muted no-underline transition-colors hover:text-accent"
      >
        &larr; Kembali ke beranda
      </Link>
    </section>
  )
}
