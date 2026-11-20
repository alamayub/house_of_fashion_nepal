import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { setSearch } from '../../features/models/modelsSlice.ts';

export function ModelSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((s) => s.modelsFilter.search);

  return (
    <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
      <Search
        className="w-4 h-4 text-[#101010]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search by name, model ID (HOF-01), category, or city..."
        aria-label="Search models"
        className="w-full pl-10 pr-10 py-3 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#632B37] transition-colors"
      />
      {search && (
        <button
          type="button"
          onClick={() => dispatch(setSearch(''))}
          aria-label="Clear search query"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#101010]/50 hover:text-[#101010] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
