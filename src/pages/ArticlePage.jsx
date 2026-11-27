import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import MarkdownRenderer from '../components/MarkdownRenderer.jsx'
import ReadingProgress from '../components/ReadingProgress.jsx'
import {
  formatArticleDate,
  getAdjacentArticles,
  getArticleBySlug,
  getProfileImage,
} from '../lib/articles.js'

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)
  const profileImage = getProfileImage()

  useEffect(() => {
    document.title = article
      ? `${article.title} | LitaKu`
      : 'Artikel Tidak Ditemukan | LitaKu'
  }, [article])

  if (!article) {
    return (
      <section className="mx-auto max-w-[720px] rounded-2xl border border-dashed border-line bg-surface px-7 py-11 text-center">
        <h1 className="mb-2 font-serif text-2xl font-bold text-heading">
          Artikel tidak ditemukan
        </h1>
        <p className="text-muted">
          Maaf, artikel dengan alamat{' '}
          <code className="rounded bg-code px-1.5 py-0.5 font-mono text-sm text-heading">
            {slug}
          </code>{' '}
          tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-4.5 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-muted no-underline transition-colors hover:text-accent"
        >
          &larr; Kembali ke daftar artikel
        </Link>
      </section>
    )
  }

  const formattedDate = formatArticleDate(article.date)
  const { newer, older } = getAdjacentArticles(article.slug)

  return (
    <>
      <ReadingProgress />

      <article>
        <div className="mx-auto max-w-[740px]">
          <nav className="mb-6" aria-label="Navigasi artikel">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-muted no-underline transition-colors hover:text-accent"
            >
              &larr; Semua artikel
            </Link>
          </nav>

          <header className="mb-7 border-b border-line pb-6">
            <h1 className="mb-3.5 font-serif text-[clamp(1.95rem,4.2vw,2.65rem)] leading-[1.18] font-bold tracking-[-0.025em] text-heading">
              {article.title}
            </h1>

            {article.summary && (
              <p className="mb-5 text-[1.1rem] leading-[1.55] text-muted">
                {article.summary}
              </p>
            )}

            <div className="mb-4.5 flex flex-wrap items-center gap-3">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Lita Alentina"
                  className="h-10 w-10 shrink-0 rounded-full border border-line object-cover object-[center_20%]"
                />
              )}
              <div className="text-[0.86rem]">
                <div className="font-semibold text-heading">
                  Lita Alentina{' '}
                  <span className="font-normal text-muted">
                    &middot; Mahasiswa Teknik Informatika (TFK 23B UTB)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-muted">
                  {formattedDate && (
                    <time dateTime={article.date}>{formattedDate}</time>
                  )}
                  <span aria-hidden="true">&middot;</span>
                  <span>{article.readingTime} menit baca</span>
                </div>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[0.78rem] text-ink no-underline transition-colors hover:bg-surface-hover hover:text-heading"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {article.cover && (
            <figure className="mb-8.5">
              <img
                src={article.cover}
                alt={article.coverAlt || article.title}
                style={{ objectPosition: article.coverPosition || 'center 24%' }}
                className="mx-auto block max-h-[440px] w-auto max-w-full rounded-2xl border border-line shadow-md dark:shadow-xl"
              />
              {article.coverAlt && (
                <figcaption className="mt-2.5 text-center text-[0.86rem] text-muted">
                  {article.coverAlt}
                </figcaption>
              )}
            </figure>
          )}

          <MarkdownRenderer content={article.content} />

          <aside
            className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center"
            aria-label="Tentang penulis"
          >
            {profileImage && (
              <img
                src={profileImage}
                alt="Lita Alentina"
                className="h-[76px] w-[76px] shrink-0 rounded-full border-2 border-line object-cover object-[center_20%]"
              />
            )}
            <div>
              <p className="mb-0.5 text-[0.78rem] font-semibold tracking-[0.06em] text-accent uppercase">
                Ditulis oleh
              </p>
              <h2 className="mb-1.5 font-serif text-[1.18rem] font-bold text-heading">
                Lita Alentina
              </h2>
              <p className="mb-2 text-[0.94rem] text-muted">
                Mahasiswa Teknik Informatika yang menulis catatan perjalanan
                belajar pemrograman, materi perkuliahan, dan dokumentasi proyek
                web.
              </p>
              {article.slug !== 'biografi-penulis' && (
                <Link
                  to="/artikel/biografi-penulis"
                  className="text-[0.9rem] font-semibold text-accent no-underline hover:underline"
                >
                  Baca biografi penulis &rarr;
                </Link>
              )}
            </div>
          </aside>

          {(newer || older) && (
            <nav
              className="mt-7 grid grid-cols-1 gap-4 border-t border-line pt-7 sm:grid-cols-2"
              aria-label="Artikel terkait"
            >
              <div>
                {newer && (
                  <Link
                    to={`/artikel/${encodeURIComponent(newer.slug)}`}
                    className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-4.5 py-4 no-underline transition hover:-translate-y-px hover:border-accent"
                  >
                    <span className="text-[0.82rem] text-muted">
                      &larr; Lebih baru
                    </span>
                    <span className="font-serif text-base font-bold text-heading">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="sm:text-right">
                {older && (
                  <Link
                    to={`/artikel/${encodeURIComponent(older.slug)}`}
                    className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-4.5 py-4 no-underline transition hover:-translate-y-px hover:border-accent"
                  >
                    <span className="text-[0.82rem] text-muted">
                      Lebih lama &rarr;
                    </span>
                    <span className="font-serif text-base font-bold text-heading">
                      {older.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </article>
    </>
  )
}
