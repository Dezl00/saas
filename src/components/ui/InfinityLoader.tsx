export function InfinityLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-delayed-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 50"
          className="w-24 h-12 text-primary-600"
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
        <p className="text-sm font-bold text-primary-600 animate-pulse">جاري التحميل...</p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes delayed-fade-in {
          0% { opacity: 0; }
          70% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-delayed-fade-in {
          animation: delayed-fade-in 0.6s ease-in-out forwards;
        }
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
