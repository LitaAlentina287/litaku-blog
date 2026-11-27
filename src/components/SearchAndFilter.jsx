function getTagPillClass(isActive) {
  const base =
    'inline-flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-[0.84rem] transition-colors'
  return isActive
    ? `${base} border-accent bg-accent-soft font-semibold text-accent`
    : `${base} border-line bg-surface text-ink hover:bg-surface-hover hover:text-heading`
}

export default function SearchAndFilter({
  query,
  onQueryChange,
  tags,
  selectedTag,
  onSelectTag,
  totalCount,
  filteredCount,
}) {
  const hasActiveFilter = Boolean(query.trim() || selectedTag)

  return (
    <section
      className="mb-7.5 flex flex-col gap-3.5"
      aria-label="Pencarian dan filter artikel"
    >
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3.5 h-[17px] w-[17px] -translate-y-1/2 fill-none stroke-muted stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <label htmlFor="article-search" className="sr-only">
          Cari artikel
        </label>
        <input
          id="article-search"
          type="search"
          className="w-full rounded-xl border border-line bg-surface py-3 pr-10.5 pl-10.5 text-heading shadow-xs transition placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:outline-none"
          placeholder="Cari judul, ringkasan, atau tag..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button
            type="button"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-surface-muted hover:text-heading"
            onClick={() => onQueryChange('')}
            aria-label="Hapus kata kunci pencarian"
          >
            &times;
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter tag artikel"
        >
          <button
            type="button"
            className={getTagPillClass(selectedTag === '')}
            aria-pressed={selectedTag === ''}
            onClick={() => onSelectTag('')}
          >
            Semua ({totalCount})
          </button>
          {tags.map((tag) => {
            const isActive =
              selectedTag.toLowerCase() === tag.name.toLowerCase()
            return (
              <button
                key={tag.name}
                type="button"
                className={getTagPillClass(isActive)}
                aria-pressed={isActive}
                onClick={() => onSelectTag(isActive ? '' : tag.name)}
              >
                #{tag.name} ({tag.count})
              </button>
            )
          })}
        </div>
      )}

      {hasActiveFilter && (
        <div className="flex items-center justify-between gap-3 text-[0.875rem] text-muted">
          <span>
            Menampilkan {filteredCount} dari {totalCount} artikel
          </span>
          <button
            type="button"
            className="cursor-pointer font-semibold text-accent hover:underline"
            onClick={() => {
              onQueryChange('')
              onSelectTag('')
            }}
          >
            Reset filter
          </button>
        </div>
      )}
    </section>
  )
}
