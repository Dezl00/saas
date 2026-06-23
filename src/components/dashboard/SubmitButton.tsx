"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function SubmitButton({ 
  children, 
  className, 
  successMessage = "تم الحفظ بنجاح" 
}: { 
  children: React.ReactNode; 
  className?: string;
  successMessage?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      toast.success(successMessage);
    }
    wasPending.current = pending;
  }, [pending, successMessage]);

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : children}
    </button>
  );
}
