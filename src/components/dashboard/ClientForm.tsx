"use client";

import toast from "react-hot-toast";

export function ClientForm({ 
  action, 
  children, 
  className 
}: { 
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void | any>; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <form 
      action={async (formData) => {
        try {
          const result = await action(formData);
          if (result && typeof result === "object") {
            if (result.error) toast.error(result.error);
            else if (result.success) toast.success(result.success);
          }
        } catch (error) {
          toast.error("حدث خطأ غير متوقع");
        }
      }} 
      className={className}
    >
      {children}
    </form>
  );
}
