"use client";
import Image from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<React.ComponentProps<typeof Image>, "onError" | "src"> {
  src: string;
  fallback?: string;
}

export default function SafeImage({
  src,
  alt,
  fallback = "/bg.png",
  ...props
}: SafeImageProps) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}