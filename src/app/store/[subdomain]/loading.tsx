import React from "react";

export default function StoreLoading() {
  return (
    <div className="animate-pulse space-y-6 animate-fade-in">
      {/* Categories Tabs Skeleton */}
      <div className="sticky top-16 z-20 bg-surface-50 py-2 flex items-center gap-2 border-b border-surface-200 overflow-hidden">
        <div className="flex-1 flex items-center gap-2 pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-24 h-10 bg-surface-200 rounded-2xl shrink-0"
            />
          ))}
        </div>
        <div className="flex items-center gap-1 border-s border-surface-200 ps-2">
          <div className="w-10 h-10 bg-surface-200 rounded-xl" />
          <div className="w-10 h-10 bg-surface-200 rounded-xl sm:hidden" />
        </div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="space-y-12">
        {/* Category Block 1 */}
        <div>
          <div className="w-32 h-8 bg-surface-200 rounded-lg mb-4" />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-surface-200 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-surface-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-3/4 h-5 bg-surface-200 rounded" />
                  <div className="w-1/4 h-4 bg-surface-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Block 2 */}
        <div>
          <div className="w-40 h-8 bg-surface-200 rounded-lg mb-4" />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-surface-200 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-surface-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-3/4 h-5 bg-surface-200 rounded" />
                  <div className="w-1/4 h-4 bg-surface-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
