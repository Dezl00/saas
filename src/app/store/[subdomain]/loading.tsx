import React from "react";

export default function StoreLoading() {
  return (
    <div className="animate-pulse space-y-4 animate-fade-in">
      {/* Banners Skeleton */}
      <div className="rounded-2xl bg-surface-100 aspect-[2.2/1] w-full" />

      {/* Categories Tabs Skeleton */}
      <div className="sticky top-14 z-20 bg-white py-2.5 flex items-center gap-2 border-b border-surface-100 overflow-hidden">
        <div className="flex-1 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-20 h-9 bg-surface-100 rounded-full shrink-0"
            />
          ))}
        </div>
        <div className="flex items-center border-s border-surface-100 ps-2">
          <div className="w-9 h-9 bg-surface-100 rounded-full" />
        </div>
      </div>

      {/* Menu Items Skeleton — horizontal cards */}
      <div className="space-y-8">
        {/* Category Block 1 */}
        <div>
          <div className="w-28 h-6 bg-surface-100 rounded-lg mb-3" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-surface-100 rounded-2xl overflow-hidden flex flex-row"
              >
                <div className="p-3.5 flex-1 flex flex-col gap-2">
                  <div className="w-3/4 h-4 bg-surface-100 rounded" />
                  <div className="w-full h-3 bg-surface-50 rounded" />
                  <div className="w-1/3 h-4 bg-surface-100 rounded mt-auto" />
                </div>
                <div className="w-28 h-28 bg-surface-100 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Block 2 */}
        <div>
          <div className="w-36 h-6 bg-surface-100 rounded-lg mb-3" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-surface-100 rounded-2xl overflow-hidden flex flex-row"
              >
                <div className="p-3.5 flex-1 flex flex-col gap-2">
                  <div className="w-3/4 h-4 bg-surface-100 rounded" />
                  <div className="w-full h-3 bg-surface-50 rounded" />
                  <div className="w-1/3 h-4 bg-surface-100 rounded mt-auto" />
                </div>
                <div className="w-28 h-28 bg-surface-100 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
