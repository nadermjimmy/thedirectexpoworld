"use client";

import dynamic from "next/dynamic";
import { useExpoStore } from "@/store/useExpoStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BoothModal from "@/components/BoothModal";
import NotificationPanel from "@/components/NotificationPanel";

const ExpoScene = dynamic(() => import("@/components/ExpoScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading Expo Hall...</p>
      </div>
    </div>
  ),
});

export default function ExpoPage() {
  const visitor = useExpoStore((s) => s.visitor);
  const router = useRouter();

  useEffect(() => {
    if (!visitor) {
      router.push("/");
    }
  }, [visitor, router]);

  if (!visitor) return null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">TDE Expo World</h1>
              <p className="text-xs text-gray-500">Welcome, {visitor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </div>

      {/* Help hint */}
      <div className="absolute bottom-4 left-4 z-30 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200/50">
        <p className="text-xs text-gray-500">
          Click a booth to view details &middot; Scroll to zoom &middot; Drag to pan
        </p>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 pt-12">
        <ExpoScene />
      </div>

      {/* Overlays */}
      <NotificationPanel />
      <BoothModal />
    </div>
  );
}
