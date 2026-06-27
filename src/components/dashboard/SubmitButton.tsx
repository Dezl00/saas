"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function SubmitButton({ 
  children, 
  className, 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : children}
    </button>
  );
}
