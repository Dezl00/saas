"use client";

import { useState } from "react";
import { Share2, Download, X, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export function ShareStoreButton({ storeUrl, storeName }: { storeUrl: string, storeName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const downloadQRCode = () => {
    const canvas = document.getElementById("store-qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${storeName || "store"}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName || "متجري",
          text: "اطلب الآن من متجرنا بكل سهولة!",
          url: storeUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(storeUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-white text-surface-700 font-bold rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        مشاركة المتجر
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-100">
              <h3 className="font-bold text-surface-950 text-lg">مشاركة المتجر</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-surface-500 hover:bg-surface-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Section */}
            <div className="p-8 flex flex-col items-center justify-center bg-surface-50">
              <div className="relative group">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-surface-100">
                  <QRCodeCanvas
                    id="store-qr-code"
                    value={storeUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                </div>
                {/* Download Button inside QR wrapper */}
                <button
                  onClick={downloadQRCode}
                  className="absolute -top-3 -end-3 p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 focus:opacity-100"
                  title="تنزيل رمز QR"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <p className="text-surface-500 text-sm mt-4 text-center">
                امسح الرمز بكاميرا الهاتف لزيارة المتجر
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-surface-100 space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5" />
                مشاركة مع الأصدقاء
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(storeUrl);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-surface-100 hover:bg-surface-200 text-surface-700 font-bold rounded-xl transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5 text-success-600" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    نسخ الرابط
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
