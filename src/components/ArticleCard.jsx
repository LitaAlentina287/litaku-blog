import { Link } from 'react-router-dom'
import { formatArticleDate } from '../lib/articles.js'

function getCardTagClass(isSelected) {
  const base =
    'inline-flex cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-[0.78rem] transition-colors'
  return isSelected
    ? `${base} border-accent bg-accent-soft font-semibold text-accent`
    : `${base} border-line bg-surface-muted text-ink hover:bg-surface-hover hover:text-heading`
}

export default function ArticleCard({
  article,
  selectedTag,
  onSelectTag,
  featured = false,
  wide = featured,
}) {
  const formattedDate = formatArticleDate(article.date)
  const articleUrl = `/artikel/${encodeURIComponent(article.slug)}`

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:hover:shadow-xl ${
        wide ? 'md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)]' : ''
      }`}
    >
      {article.cover && (
        <Link
          to={articleUrl}
          className={`block overflow-hidden bg-surface-muted ${
            wide
              ? 'aspect-[16/10] min-h-[220px] md:aspect-auto md:h-full md:min-h-[290px]'
              : 'aspect-[16/10]'
          }`}
          tabIndex={-1}
        >
          <img
            src={article.cover}
            alt={article.coverAlt || article.title}
            style={{ objectPosition: article.coverPosition || 'center 24%' }}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>
      )}

      <div
        className={`flex flex-1 flex-col ${
          wide ? 'justify-center p-6 sm:p-7.5' : 'p-5.5 sm:p-6'
        }`}
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-2 text-[0.84rem] text-muted">
          {featured && (
            <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.76rem] font-semibold text-accent">
              Terbaru
            </span>
          )}
          {formattedDate && (
            <time dateTime={article.date}>{formattedDate}</time>
          )}
          <span aria-hidden="true">&middot;</span>
          <span>{article.readingTime} menit baca</span>
        </div>

        <h2
          className={`mb-2.5 font-serif leading-[1.3] font-bold tracking-[-0.015em] text-heading ${
            featured ? 'text-[1.65rem]' : 'text-[1.32rem]'
          }`}
        >
          <Link
            to={articleUrl}
            className="no-underline transition-colors hover:text-accent"
          >
            {article.title}
          </Link>
        </h2>

        {article.summary && (
          <p className="mb-4.5 flex-1 text-[0.96rem] text-muted">
            {article.summary}
          </p>
        )}

        <div className="flex items-end justify-between gap-3 border-t border-line pt-3.5">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => {
                const isSelected =
                  selectedTag.toLowerCase() === tag.toLowerCase()
                return (
                  <button
                    key={tag}
                    type="button"
                    className={getCardTagClass(isSelected)}
                    onClick={() => onSelectTag(isSelected ? '' : tag)}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>
          )}

          <Link
            to={articleUrl}
            className="shrink-0 text-[0.88rem] font-semibold text-accent no-underline hover:underline"
          >
            Baca <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
