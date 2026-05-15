/**
 * Page Loader Component
 *
 * Reusable loading spinner for route transitions and dynamic import fallbacks.
 * Matches the MENGO dark theme with lime accent.
 */

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#C8FF2E] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm text-[#878e9a] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}