"use client";

import { useState } from "react";
import { Sparkles, Dices, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function GenerateImageButton({ itemId, hasImage }: { itemId: string, hasImage: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("جاري توليد الصورة السحرية...");

    try {
      // Send a random seed to ensure a different image if regenerated
      const seed = Math.floor(Math.random() * 1000000);
      
      const res = await fetch(`/api/menu/items/${itemId}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل التوليد");
      }

      toast.success("تم توليد الصورة وحفظها بنجاح!", { id: toastId });
      // Refresh the page to show the new image
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      title={hasImage ? "توليد صورة أخرى" : "توليد صورة بالذكاء الاصطناعي"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        hasImage 
          ? "bg-surface-100 text-surface-600 hover:bg-surface-200" 
          : "bg-primary-100 text-primary-700 hover:bg-primary-200"
      } disabled:opacity-50`}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : hasImage ? (
        <Dices className="w-4 h-4 text-purple-600" />
      ) : (
        <Sparkles className="w-4 h-4 text-yellow-500" />
      )}
      <span className="hidden sm:inline">{hasImage ? "صورة أخرى" : "توليد صورة"}</span>
    </button>
  );
}
