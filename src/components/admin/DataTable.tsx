import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import { ActionMenu, type ActionMenuItem } from './ActionMenu.tsx';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: (row: T) => string | number | boolean | null | undefined;
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

export interface DataTableFilter<T> {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  predicate: (row: T, activeValue: string) => boolean;
}

export interface DataTableBulkAction<T> {
  id: string;
  label: string;
  variant?: 'default' | 'danger';
  onAction: (selectedRows: T[], clearSelection: () => void) => void | Promise<void>;
}

export interface DataTableExportConfig<T> {
  filename: string;
  columns: Array<{
    label: string;
    value: (row: T) => string | number | boolean | undefined | null;
  }>;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;

  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPredicate?: (row: T, query: string) => boolean;

  // Filters
  filters?: DataTableFilter<T>[];

  // Sorting
  defaultSort?: {
    columnId: string;
    direction: SortDirection;
  };

  // Pagination
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  itemLabel?: string;

  // Selection & Actions
  selectable?: boolean;
  bulkActions?: DataTableBulkAction<T>[];
  rowActions?: (row: T) => ReactNode;
  rowActionItems?: (row: T) => ActionMenuItem[];
  actionMenuLabel?: string;
  actionMenuVariant?: 'button' | 'icon';
  rowActionsHeader?: string;
  toolbarActions?: ReactNode;
  toolbarActionItems?: ActionMenuItem[];
  toolbarMenuLabel?: string;
  exportConfig?: DataTableExportConfig<T>;

  // Expandable details
  renderExpandedRow?: (row: T) => ReactNode;
  expandRowAriaLabel?: (row: T, expanded: boolean) => string;

  // States
  isLoading?: boolean;
  skeletonRows?: number;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

function escapeCsvCell(raw: string | number | boolean | undefined | null): string {
  const str = raw === undefined || raw === null ? '' : String(raw);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchAriaLabel = 'Search table',
  searchValue,
  onSearchChange,
  searchPredicate,
  filters = [],
  defaultSort,
  defaultPageSize = 8,
  pageSizeOptions = [5, 8, 15, 25],
  itemLabel = 'records',
  selectable = false,
  bulkActions = [],
  rowActions,
  rowActionItems,
  actionMenuLabel = 'Actions',
  actionMenuVariant = 'button',
  rowActionsHeader = 'Actions',
  toolbarActions,
  toolbarActionItems,
  toolbarMenuLabel = 'More Actions',
  exportConfig,
  renderExpandedRow,
  expandRowAriaLabel,
  isLoading = false,
  skeletonRows = 5,
  error = null,
  emptyTitle = 'No matching records found',
  emptyDescription = 'Adjust your search or active filters, or add a new entry.',
  emptyAction,
}: DataTableProps<T>) {
  const prefersReducedMotion = useReducedMotion();
  const [internalSearch, setInternalSearch] = useState('');
  const activeSearch = searchValue !== undefined ? searchValue : internalSearch;

  const [internalFilters, setInternalFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of filters) {
      initial[f.id] = f.defaultValue ?? 'All';
    }
    return initial;
  });

  const [sortState, setSortState] = useState<{
    columnId: string;
    direction: SortDirection;
  } | null>(defaultSort ?? null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [bulkBusyId, setBulkBusyId] = useState<string | null>(null);

  const getFilterValue = (f: DataTableFilter<T>): string => {
    if (f.value !== undefined) return f.value;
    return internalFilters[f.id] ?? f.defaultValue ?? 'All';
  };

  const setFilterValue = (f: DataTableFilter<T>, nextValue: string) => {
    if (f.onChange) {
      f.onChange(nextValue);
    } else {
      setInternalFilters((prev) => ({ ...prev, [f.id]: nextValue }));
    }
    setCurrentPage(1);
  };

  const handleSearchInput = (next: string) => {
    if (onSearchChange) {
      onSearchChange(next);
    } else {
      setInternalSearch(next);
    }
    setCurrentPage(1);
  };

  const hasActiveSearchOrFilters = useMemo(() => {
    if (activeSearch.trim().length > 0) return true;
    return filters.some((f) => {
      const def = f.defaultValue ?? 'All';
      return getFilterValue(f) !== def;
    });
  }, [activeSearch, filters, internalFilters]);

  const handleResetFilters = () => {
    if (onSearchChange) {
      onSearchChange('');
    } else {
      setInternalSearch('');
    }
    for (const f of filters) {
      const def = f.defaultValue ?? 'All';
      if (f.onChange) {
        f.onChange(def);
      } else {
        setInternalFilters((prev) => ({ ...prev, [f.id]: def }));
      }
    }
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    const query = activeSearch.trim().toLowerCase();

    return data.filter((row) => {
      for (const f of filters) {
        const val = getFilterValue(f);
        const def = f.defaultValue ?? 'All';
        if (val !== def && !f.predicate(row, val)) {
          return false;
        }
      }

      if (!query) return true;

      if (searchPredicate) {
        return searchPredicate(row, query);
      }

      return columns.some((col) => {
        if (!col.accessor) return false;
        const raw = col.accessor(row);
        if (raw === null || raw === undefined) return false;
        return String(raw).toLowerCase().includes(query);
      });
    });
  }, [data, activeSearch, filters, internalFilters, searchPredicate, columns]);

  const sortedData = useMemo(() => {
    if (!sortState) return filteredData;
    const col = columns.find((c) => c.id === sortState.columnId);
    if (!col) return filteredData;

    const getVal = (row: T): string | number => {
      if (col.sortValue) return col.sortValue(row);
      if (col.accessor) {
        const raw = col.accessor(row);
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'boolean') return raw ? 1 : 0;
        return raw ? String(raw).toLowerCase() : '';
      }
      return '';
    };

    const dir = sortState.direction === 'asc' ? 1 : -1;
    return [...filteredData].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * dir;
      }
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [filteredData, sortState, columns]);

  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  // Prune stale selections when rows are removed
  useEffect(() => {
    if (selectedIds.size === 0) return;
    const validIds = new Set(data.map((row) => getRowId(row)));
    let changed = false;
    const next = new Set<string>();
    selectedIds.forEach((id) => {
      if (validIds.has(id)) {
        next.add(id);
      } else {
        changed = true;
      }
    });
    if (changed) {
      setSelectedIds(next);
    }
  }, [data, getRowId, selectedIds]);

  const selectedRows = useMemo(
    () => data.filter((row) => selectedIds.has(getRowId(row))),
    [data, selectedIds, getRowId],
  );

  const pageRowIds = useMemo(
    () => paginatedRows.map((row) => getRowId(row)),
    [paginatedRows, getRowId],
  );

  const allOnPageSelected =
    pageRowIds.length > 0 && pageRowIds.every((id) => selectedIds.has(id));
  const someOnPageSelected =
    pageRowIds.some((id) => selectedIds.has(id)) && !allOnPageSelected;

  const toggleSelectPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageRowIds.forEach((id) => next.delete(id));
      } else {
        pageRowIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandRow = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (columnId: string) => {
    setSortState((prev) => {
      if (!prev || prev.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }
      return null;
    });
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    if (!exportConfig) return;
    const headerRow = exportConfig.columns.map((c) => escapeCsvCell(c.label)).join(',');
    const bodyRows = sortedData.map((row) =>
      exportConfig.columns.map((c) => escapeCsvCell(c.value(row))).join(','),
    );
    const csvContent = [headerRow, ...bodyRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportConfig.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalItems);
  const hasActionsColumn = Boolean(rowActions || rowActionItems);
  const totalColSpan =
    columns.length +
    (selectable ? 1 : 0) +
    (renderExpandedRow ? 1 : 0) +
    (hasActionsColumn ? 1 : 0);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: Array<number | 'ellipsis'> = [1];
    const left = Math.max(2, safePage - 1);
    const right = Math.min(totalPages - 1, safePage + 1);
    if (left > 2) pages.push('ellipsis');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="space-y-4">
      {/* Toolbar: Search, Filters, Export & Primary Actions */}
      <div className="p-4 sm:p-5 bg-[#FAF8F4] border border-[#101010]/15 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
          {searchable && (
            <div className="relative flex-1 min-w-0 sm:min-w-[220px] max-w-md">
              <Search className="w-4 h-4 text-[#101010]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={activeSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchAriaLabel}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]"
              />
              {activeSearch && (
                <button
                  type="button"
                  onClick={() => handleSearchInput('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#101010]/45 hover:text-[#101010]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {filters.map((f) => (
                <div key={f.id} className="min-w-[140px] flex-1 sm:flex-initial sm:min-w-[165px]">
                  <SearchableSelect
                    ariaLabel={f.label}
                    value={getFilterValue(f)}
                    onChange={(val) => setFilterValue(f, val)}
                    options={f.options}
                    searchPlaceholder={`Search ${f.label.toLowerCase()}...`}
                    tone="ivory"
                    size="md"
                    menuMinWidth={210}
                    className="text-xs uppercase tracking-[0.14em]"
                  />
                </div>
              ))}

              {hasActiveSearchOrFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs uppercase tracking-[0.14em] text-[#632B37] border border-[#632B37]/30 hover:border-[#632B37] bg-[#FAF8F4] transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {(exportConfig || toolbarActionItems?.length || toolbarActions) && (
          <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
            {exportConfig && (
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={sortedData.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#101010]/20 bg-[#F5F1EA] text-xs uppercase tracking-[0.14em] hover:border-[#101010] transition-colors whitespace-nowrap shrink-0 disabled:opacity-45"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}
            {toolbarActionItems && toolbarActionItems.length > 0 && (
              <ActionMenu
                items={toolbarActionItems}
                label={toolbarMenuLabel}
                triggerVariant="button"
                align="right"
              />
            )}
            {toolbarActions}
          </div>
        )}
      </div>

      {/* Contextual Bulk Action Bar */}
      <AnimatePresence initial={false}>
        {selectable && selectedRows.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-[#101010] text-[#FAF8F4] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono tabular-nums uppercase tracking-[0.14em]">
                  {selectedRows.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[#B6A48D] hover:text-[#FAF8F4] underline underline-offset-4 whitespace-nowrap cursor-pointer"
                >
                  Clear selection
                </button>
              </div>

              {bulkActions.length > 0 && (
                <ActionMenu
                  label={bulkBusyId ? 'Updating...' : 'Bulk Actions'}
                  ariaLabel="Bulk actions for selected rows"
                  triggerVariant="dark"
                  align="right"
                  disabled={bulkBusyId !== null}
                  items={bulkActions.map((action) => ({
                    id: action.id,
                    label: action.label,
                    variant: action.variant,
                    onClick: async () => {
                      setBulkBusyId(action.id);
                      try {
                        await action.onAction(selectedRows, () =>
                          setSelectedIds(new Set()),
                        );
                      } finally {
                        setBulkBusyId(null);
                      }
                    },
                  }))}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="px-4 py-3 bg-[#FAF8F4] border border-[#632B37] text-xs text-[#632B37]"
        >
          {error}
        </div>
      )}

      {/* Table Surface */}
      <div className="bg-[#FAF8F4] border border-[#101010]/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#101010]/15 bg-[#F5F1EA]/65 text-[11px] uppercase tracking-[0.16em] text-[#101010]/65">
                {selectable && (
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all rows on this page"
                      checked={allOnPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someOnPageSelected;
                      }}
                      onChange={toggleSelectPage}
                      className="w-4 h-4 accent-[#632B37] cursor-pointer align-middle"
                    />
                  </th>
                )}
                {renderExpandedRow && (
                  <th className="py-3.5 px-2 w-9" aria-label="Expand details" />
                )}
                {columns.map((col) => {
                  const isSortable = Boolean(
                    col.sortable && (col.sortValue || col.accessor),
                  );
                  const isSorted = sortState?.columnId === col.id;
                  const alignClass =
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';

                  return (
                    <th
                      key={col.id}
                      aria-sort={
                        isSorted
                          ? sortState.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : undefined
                      }
                      className={`py-3.5 px-4 font-medium whitespace-nowrap ${alignClass} ${col.headerClassName || ''}`}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.id)}
                          className={`inline-flex items-center gap-1.5 uppercase tracking-[0.16em] hover:text-[#101010] transition-colors ${
                            col.align === 'right' ? 'flex-row-reverse' : ''
                          } ${isSorted ? 'text-[#632B37] font-semibold' : ''}`}
                        >
                          <span>{col.header}</span>
                          {isSorted ? (
                            sortState.direction === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 shrink-0" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-45" />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
                {hasActionsColumn && (
                  <th className="py-3.5 px-4 text-right font-medium whitespace-nowrap">
                    {rowActionsHeader}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#101010]/10 text-sm">
              {isLoading ? (
                Array.from({ length: skeletonRows }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    {Array.from({ length: totalColSpan }).map((__, cellIdx) => (
                      <td key={`cell-${cellIdx}`} className="py-4 px-4">
                        <div className="h-4 bg-[#101010]/10 w-full max-w-[140px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={totalColSpan} className="py-12 px-6 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="font-serif text-2xl text-[#101010]">
                        {emptyTitle}
                      </p>
                      <p className="text-xs text-[#101010]/65 leading-relaxed">
                        {emptyDescription}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        {hasActiveSearchOrFilters && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-4 py-2 border border-[#101010]/25 text-xs uppercase tracking-[0.14em] hover:border-[#101010]"
                          >
                            Reset Search &amp; Filters
                          </button>
                        )}
                        {emptyAction && (
                          <button
                            type="button"
                            onClick={emptyAction.onClick}
                            className="px-5 py-2 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors"
                          >
                            {emptyAction.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  const id = getRowId(row);
                  const isSelected = selectedIds.has(id);
                  const isExpanded = expandedIds.has(id);

                  return (
                    <Fragment key={id}>
                      <tr
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-[#632B37]/[0.05]'
                            : 'hover:bg-[#F5F1EA]/60'
                        }`}
                      >
                        {selectable && (
                          <td className="py-3.5 pl-4 pr-2 align-middle">
                            <input
                              type="checkbox"
                              aria-label={`Select row ${id}`}
                              checked={isSelected}
                              onChange={() => toggleSelectRow(id)}
                              className="w-4 h-4 accent-[#632B37] cursor-pointer align-middle"
                            />
                          </td>
                        )}
                        {renderExpandedRow && (
                          <td className="py-3.5 px-2 align-middle">
                            <button
                              type="button"
                              onClick={() => toggleExpandRow(id)}
                              aria-expanded={isExpanded}
                              aria-label={
                                expandRowAriaLabel
                                  ? expandRowAriaLabel(row, isExpanded)
                                  : isExpanded
                                    ? `Collapse details for ${id}`
                                    : `Expand details for ${id}`
                              }
                              className="p-1.5 text-[#101010]/55 hover:text-[#101010] transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        )}
                        {columns.map((col) => {
                          const alignClass =
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                                ? 'text-center'
                                : 'text-left';
                          return (
                            <td
                              key={col.id}
                              className={`py-3.5 px-4 align-middle ${alignClass} ${col.cellClassName || ''}`}
                            >
                              {col.render(row)}
                            </td>
                          );
                        })}
                        {hasActionsColumn && (
                          <td className="py-3.5 px-4 text-right align-middle whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {rowActions?.(row)}
                              {rowActionItems && (
                                <ActionMenu
                                  items={rowActionItems(row)}
                                  label={actionMenuLabel}
                                  ariaLabel={`Actions for ${id}`}
                                  triggerVariant={actionMenuVariant}
                                  align="right"
                                />
                              )}
                            </div>
                          </td>
                        )}
                      </tr>

                      {renderExpandedRow && isExpanded && (
                        <tr className="bg-[#F5F1EA]/80">
                          <td
                            colSpan={totalColSpan}
                            className="p-0 border-t border-[#101010]/10"
                          >
                            <motion.div
                              initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 py-4">{renderExpandedRow(row)}</div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-5 py-3.5 border-t border-[#101010]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#101010]/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <span className="font-mono tabular-nums">
              {totalItems === 0
                ? `0 ${itemLabel}`
                : `Showing ${startIndex}–${endIndex} of ${totalItems} ${itemLabel}`}
            </span>

            <div className="inline-flex items-center gap-2">
              <span className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/55">
                Per page
              </span>
              <div className="w-[74px]">
                <SearchableSelect
                  ariaLabel="Rows per page"
                  value={String(pageSize)}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                  options={pageSizeOptions.map((opt) => ({
                    value: String(opt),
                    label: String(opt),
                  }))}
                  searchable={false}
                  tone="ivory"
                  size="sm"
                  menuMinWidth={110}
                  className="font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Previous page"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#101010]/20 bg-[#F5F1EA] text-xs uppercase tracking-[0.12em] hover:border-[#101010] disabled:opacity-40 whitespace-nowrap"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {pageNumbers.map((pageNum, idx) =>
              pageNum === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-[#101010]/45 font-mono"
                >
                  &hellip;
                </span>
              ) : (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  aria-current={safePage === pageNum ? 'page' : undefined}
                  className={`min-w-[30px] h-7 px-2 border font-mono text-xs tabular-nums transition-colors ${
                    safePage === pageNum
                      ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                      : 'bg-[#F5F1EA] text-[#101010]/75 border-[#101010]/20 hover:border-[#101010]'
                  }`}
                >
                  {pageNum}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              aria-label="Next page"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#101010]/20 bg-[#F5F1EA] text-xs uppercase tracking-[0.12em] hover:border-[#101010] disabled:opacity-40 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
