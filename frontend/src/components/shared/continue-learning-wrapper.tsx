"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with localStorage
const ContinueLearning = dynamic(
  () => import("./continue-learning").then((mod) => ({ default: mod.ContinueLearning })),
  { ssr: false }
);

export function ContinueLearningWrapper() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ContinueLearning />
      </div>
    </section>
  );
}
