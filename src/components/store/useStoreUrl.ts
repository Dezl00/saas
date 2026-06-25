"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export function useStoreUrl() {
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [basePath, setBasePath] = useState(`/store/${subdomain}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.location.pathname.startsWith("/store/")) {
        setBasePath("");
      }
    }
  }, []);

  const getUrl = (path: string) => {
    // If path is empty, return basePath (or "/" if basePath is empty)
    if (!path || path === "/") {
      return basePath || "/";
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${basePath}${cleanPath}`;
  };

  return { getUrl, subdomain };
}
