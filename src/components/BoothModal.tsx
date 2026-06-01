"use client";

import { useState } from "react";
import { useExpoStore } from "@/store/useExpoStore";
import { Developer, SalesRep } from "@/types";

function RepCard({ rep, developer }: { rep: SalesRep; developer: Developer }) {
  const { toggleRepStatus, isAdmin } = useExpoStore();

  const statusColors = {
    available: "bg-emerald-500",
    "in-meeting": "bg-red-500",
    offline: "bg-gray-400",
  };

  const statusLabels = {
    available: "Available",
    "in-meeting": "In Meeting",
    offline: "Offline",
  };

  const handleJoin = () => {
    if (rep.status === "available") {
      toggleRepStatus(developer.id, rep.id);
      window.open(rep.meetLink, "_blank");
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="relative">
        <img
          src={rep.avatar}
          alt={rep.name}
          className="w-12 h-12 rounded-full bg-blue-100"
        />
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusColors[rep.status]}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{rep.name}</p>
        <p className={`text-sm ${rep.status === "available" ? "text-emerald-600" : rep.status === "in-meeting" ? "text-red-500" : "text-gray-400"}`}>
          {statusLabels[rep.status]}
        </p>
      </div>
      <div className="flex gap-2">
        {rep.status === "available" ? (
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Join Meeting
          </button>
        ) : (
          <span className="px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg">
            {rep.status === "in-meeting" ? "Busy" : "Offline"}
          </span>
        )}
        {isAdmin && (
          <button
            onClick={() => toggleRepStatus(developer.id, rep.id)}
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors"
            title="Toggle status (admin)"
          >
            Toggle
          </button>
        )}
      </div>
    </div>
  );
}

export default function BoothModal() {
  const { selectedDeveloper, selectDeveloper, joinWaitlist, waitlist, visitor } =
    useExpoStore();
  const [activeTab, setActiveTab] = useState<"info" | "gallery" | "reps">("info");
  const [currentImage, setCurrentImage] = useState(0);

  if (!selectedDeveloper) return null;

  const dev = selectedDeveloper;
  const bothBusy = dev.reps.every((r) => r.status !== "available");
  const onWaitlist = waitlist.some(
    (w) => w.developerId === dev.id && w.visitorEmail === visitor?.email
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => selectDeveloper(null)}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex items-end">
          <button
            onClick={() => selectDeveloper(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <img
              src={dev.logo}
              alt={dev.name}
              className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20"
            />
            <div>
              <p className="text-white/60 text-sm font-medium">
                Booth #{dev.boothNumber}
              </p>
              <h2 className="text-2xl font-bold text-white">{dev.name}</h2>
              <p className="text-white/80 text-sm">{dev.tagline}</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-100">
          {(["info", "gallery", "reps"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "reps" ? "Sales Reps" : tab === "info" ? "Project Info" : "Gallery"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "info" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  About the Project
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dev.content.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-800 font-medium">
                    {dev.content.pricing}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Brochure
                </button>
                <button className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Video
                </button>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={dev.content.images[currentImage]}
                  alt={`${dev.name} render ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                  {currentImage + 1} / {dev.content.images.length}
                </div>
              </div>
              <div className="flex gap-2">
                {dev.content.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === i
                        ? "border-blue-500 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reps" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {dev.reps.map((rep) => (
                  <RepCard key={rep.id} rep={rep} developer={dev} />
                ))}
              </div>

              {bothBusy && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-amber-800 font-medium mb-2">
                    Both representatives are currently busy
                  </p>
                  {onWaitlist ? (
                    <p className="text-amber-600 text-sm">
                      You&apos;re on the waitlist. We&apos;ll notify you when
                      someone is free.
                    </p>
                  ) : (
                    <button
                      onClick={() => joinWaitlist(dev.id)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Join Waitlist
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
