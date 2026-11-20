export function Loader({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-px bg-[#101010]/20 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[#101010] animate-[slide_1.1s_ease-in-out_infinite]" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#101010]/60">
        {label}
      </p>
    </div>
  );
}

export function ModelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="aspect-[3/4] w-full bg-[#101010]/10" />
          <div className="pt-4 space-y-2">
            <div className="h-3 w-16 bg-[#101010]/10" />
            <div className="h-6 w-44 bg-[#101010]/10" />
            <div className="h-3 w-52 bg-[#101010]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
