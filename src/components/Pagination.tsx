import { styles } from "../constants";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
};

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50]
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(total, currentPage * pageSize);

  const go = (next: number) => onPageChange(Math.min(Math.max(1, next), totalPages));

  return (
    <div className={styles.paginationBar}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink-heading">
          <i className="bi bi-list-ul me-1.5 text-brand-600 opacity-90 dark:text-brand-300" aria-hidden />
          {start}–{end} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {onPageSizeChange ? (
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-heading">
              <span>Rows</span>
              <select
                className={`${styles.toolbarControl} min-w-[4.5rem]`}
                value={pageSize}
                onChange={(event) => {
                  onPageSizeChange(Number(event.target.value));
                  onPageChange(1);
                }}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className={styles.paginationPagerChrome}>
            <button
              aria-label="Previous page"
              className={styles.paginationNavButton}
              disabled={currentPage <= 1}
              type="button"
              onClick={() => go(currentPage - 1)}
            >
              <i className="bi bi-chevron-left text-lg leading-none" aria-hidden />
            </button>
            <span className="min-w-[5rem] text-center text-sm font-bold tabular-nums text-ink-heading dark:text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              aria-label="Next page"
              className={styles.paginationNavButton}
              disabled={currentPage >= totalPages}
              type="button"
              onClick={() => go(currentPage + 1)}
            >
              <i className="bi bi-chevron-right text-lg leading-none" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
