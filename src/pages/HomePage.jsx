import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard.jsx'
import AuthorHero from '../components/AuthorHero.jsx'
import SearchAndFilter from '../components/SearchAndFilter.jsx'
import {
  filterArticles,
  getAllArticles,
  getAllTags,
} from '../lib/articles.js'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const selectedTag = searchParams.get('tag') ?? ''

  const allArticles = getAllArticles()
  const allTags = useMemo(() => getAllTags(allArticles), [allArticles])

  const filteredArticles = useMemo(
    () => filterArticles(allArticles, { query, selectedTag }),
    [allArticles, query, selectedTag],
  )

  const hasActiveFilter = Boolean(query.trim() || selectedTag)
  const featuredArticle =
    !hasActiveFilter && filteredArticles.length > 0 ? filteredArticles[0] : null
  const remainingArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles

  useEffect(() => {
    document.title = 'LitaKu | Learning in Public Mahasiswa Teknik Informatika'
  }, [])

  function updateFilters(nextQuery, nextTag) {
    const nextParams = new URLSearchParams()
    if (nextQuery) nextParams.set('q', nextQuery)
    if (nextTag) nextParams.set('tag', nextTag)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div>
      <AuthorHero
        articleCount={allArticles.length}
        tagCount={allTags.length}
      />

      <SearchAndFilter
        query={query}
        onQueryChange={(nextQuery) => updateFilters(nextQuery, selectedTag)}
        tags={allTags}
        selectedTag={selectedTag}
        onSelectTag={(nextTag) => updateFilters(query, nextTag)}
        totalCount={allArticles.length}
        filteredCount={filteredArticles.length}
      />

      {allArticles.length === 0 ? (
        <div className="mx-auto max-w-[720px] rounded-2xl border border-dashed border-line bg-surface px-7 py-11 text-center">
          <h2 className="mb-2 font-serif text-xl font-bold text-heading">
            Belum ada artikel
          </h2>
          <p className="text-muted">Belum ada tulisan yang diterbitkan saat ini.</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="mx-auto max-w-[720px] rounded-2xl border border-dashed border-line bg-surface px-7 py-11 text-center">
          <h2 className="mb-2 font-serif text-xl font-bold text-heading">
            Tidak ada artikel yang cocok
          </h2>
          <p className="text-muted">
            Coba gunakan kata kunci lain atau bersihkan filter tag yang aktif.
          </p>
          <button
            type="button"
            className="mt-3.5 cursor-pointer rounded-lg bg-accent-soft px-4 py-2 font-semibold text-accent hover:underline"
            onClick={() => updateFilters('', '')}
          >
            Tampilkan semua artikel
          </button>
        </div>
      ) : (
        <section className="flex flex-col gap-6" aria-label="Daftar artikel">
          {featuredArticle && (
            <ArticleCard
              article={featuredArticle}
              selectedTag={selectedTag}
              onSelectTag={(nextTag) => updateFilters(query, nextTag)}
              featured
            />
          )}

          {remainingArticles.length === 1 ? (
            <ArticleCard
              article={remainingArticles[0]}
              selectedTag={selectedTag}
              onSelectTag={(nextTag) => updateFilters(query, nextTag)}
              wide
            />
          ) : (
            remainingArticles.length > 1 && (
              <div
                className={`grid grid-cols-1 gap-5.5 md:grid-cols-2 ${
                  remainingArticles.length === 3 ? 'lg:grid-cols-3' : ''
                }`}
              >
                {remainingArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    selectedTag={selectedTag}
                    onSelectTag={(nextTag) => updateFilters(query, nextTag)}
                  />
                ))}
              </div>
            )
          )}
        </section>
      )}
    </div>
  )
}
