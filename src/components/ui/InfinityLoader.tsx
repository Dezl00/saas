export function InfinityLoader({ colorClass = "text-primary-600" }: { colorClass?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 50"
          className={`w-24 h-12 ${colorClass}`}
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="150"
            strokeDashoffset="150"
            className="animate-infinity-trace"
            d="M 25 25 C 10 10, 10 40, 25 25 C 40 10, 60 40, 75 25 C 90 10, 90 40, 75 25 C 60 10, 40 40, 25 25"
          />
        </svg>
        <p className={`text-sm font-bold animate-pulse ${colorClass}`}>جاري التحميل...</p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes infinity-trace {
          0% { stroke-dashoffset: 150; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -150; }
        }
        .animate-infinity-trace {
          animation: infinity-trace 2s linear infinite;
        }
      `}} />
    </div>
  );
}
