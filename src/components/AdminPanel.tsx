"use client";

import { useState } from "react";
import { useExpoStore } from "@/store/useExpoStore";
import { Developer, RepStatus } from "@/types";

function AdminRepRow({
  rep,
  developer,
}: {
  rep: Developer["reps"][0];
  developer: Developer;
}) {
  const { setRepStatus } = useExpoStore();
  const statusColors: Record<RepStatus, string> = {
    available: "bg-emerald-100 text-emerald-700",
    "in-meeting": "bg-red-100 text-red-700",
    offline: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <img src={rep.avatar} alt={rep.name} className="w-8 h-8 rounded-full bg-blue-100" />
        <span className="text-sm font-medium text-gray-800">{rep.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[rep.status]}`}>
          {rep.status}
        </span>
        <select
          value={rep.status}
          onChange={(e) =>
            setRepStatus(developer.id, rep.id, e.target.value as RepStatus)
          }
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 bg-white"
        >
          <option value="available">Available</option>
          <option value="in-meeting">In Meeting</option>
          <option value="offline">Offline</option>
        </select>
      </div>
    </div>
  );
}

function AdminBoothCard({ developer }: { developer: Developer }) {
  const [expanded, setExpanded] = useState(false);

  const available = developer.reps.filter((r) => r.status === "available").length;
  const total = developer.reps.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <img src={developer.logo} alt={developer.name} className="w-10 h-10 rounded-lg bg-blue-100" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 text-sm">{developer.name}</p>
            <p className="text-xs text-gray-500">Booth #{developer.boothNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${available > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {available}/{total} available
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-2">
            Sales Representatives
          </p>
          {developer.reps.map((rep) => (
            <AdminRepRow key={rep.id} rep={rep} developer={developer} />
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
              Booth Content
            </p>
            <p className="text-sm text-gray-600">{developer.tagline}</p>
            <p className="text-xs text-gray-400 mt-1">
              {developer.content.images.length} images &middot; {developer.content.pricing ? "Pricing set" : "No pricing"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { developers, logoutAdmin } = useExpoStore();
  const [search, setSearch] = useState("");

  const totalAvailable = developers.reduce(
    (sum, dev) => sum + dev.reps.filter((r) => r.status === "available").length,
    0
  );
  const totalInMeeting = developers.reduce(
    (sum, dev) => sum + dev.reps.filter((r) => r.status === "in-meeting").length,
    0
  );
  const totalOffline = developers.reduce(
    (sum, dev) => sum + dev.reps.filter((r) => r.status === "offline").length,
    0
  );

  const filtered = developers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TDE Admin</h1>
              <p className="text-xs text-gray-500">Expo Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/expo"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Expo
            </a>
            <button
              onClick={logoutAdmin}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Available Reps</p>
            <p className="text-2xl font-bold text-emerald-600">{totalAvailable}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">In Meeting</p>
            <p className="text-2xl font-bold text-red-500">{totalInMeeting}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Offline</p>
            <p className="text-2xl font-bold text-gray-400">{totalOffline}</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search developers..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((dev) => (
            <AdminBoothCard key={dev.id} developer={dev} />
          ))}
        </div>
      </div>
    </div>
  );
}
