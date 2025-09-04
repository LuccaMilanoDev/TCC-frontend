"use client";

import React from "react";

type LoadingProps = {
  text?: string;
  fullScreen?: boolean;
};

export default function Loading({ text = "Carregando...", fullScreen = true }: LoadingProps) {
  const content = (
    <div className="flex items-center justify-center gap-3 p-4 bg-white/90 rounded-md shadow">
      <span className="inline-block h-5 w-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" aria-hidden />
      <span className="text-sm text-gray-800 font-medium">{text}</span>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-[1px]">
      {content}
    </div>
  );
}
