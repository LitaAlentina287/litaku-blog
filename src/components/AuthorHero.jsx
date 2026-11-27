import { Link } from 'react-router-dom'
import { getProfileImage } from '../lib/articles.js'

export default function AuthorHero({ articleCount, tagCount }) {
  const profileImage = getProfileImage()

  return (
    <section
      className="mb-7 flex flex-col gap-5 rounded-[18px] border border-line bg-surface p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6.5"
      aria-label="Profil penulis"
    >
      <div className="flex items-start gap-4 sm:items-center">
        {profileImage && (
          <img
            src={profileImage}
            alt="Potret Lita Alentina"
            className="h-16 w-16 shrink-0 rounded-full border border-line object-cover object-[center_20%] shadow-xs sm:h-18 sm:w-18"
          />
        )}

        <div>
          <span className="mb-1 inline-block text-[0.74rem] font-semibold tracking-[0.07em] text-accent uppercase">
            Teknik Informatika &middot; TFK 23B UTB &middot; Learning in Public
          </span>
          <h1 className="mb-1 font-serif text-[clamp(1.45rem,2.8vw,1.9rem)] leading-[1.2] font-bold tracking-[-0.02em] text-heading">
            Catatan Belajar Lita Alentina
          </h1>
          <p className="max-w-[60ch] text-[0.94rem] leading-[1.55] text-muted">
            Dokumentasi pengalaman nyata belajar pemrograman, pengembangan web,
            dan komunikasi teknis secara terbuka.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3.5 sm:flex-col sm:items-end">
        <Link
          to="/artikel/biografi-penulis"
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-surface-muted px-3.5 py-2 text-[0.86rem] font-semibold text-heading no-underline transition hover:border-accent hover:text-accent"
        >
          Tentang Penulis <span aria-hidden="true">&rarr;</span>
        </Link>
        <span className="text-[0.82rem] font-medium text-muted">
          {articleCount} Artikel &middot; {tagCount} Topik
        </span>
      </div>
    </section>
  )
}
