"use client";

import React, { useState } from "react";
import {
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type StationStatus = "Active" | "Inactive" | "Defective";

interface Station {
  id: string;
  name: string;
  status: StationStatus;
  warning?: string;
  defectNotes?: string;
}

interface Studio {
  id: string;
  name: string;
  isLocked: boolean;
  stations: Station[];
  allowManualOverride: boolean;
}

const initialStudios: Studio[] = [
  {
    id: "studio-1",
    name: "Studio 1",
    isLocked: false,
    allowManualOverride: true,
    stations: [
      { id: "1-a", name: "Station A", status: "Active" },
      { id: "1-b", name: "Station B", status: "Active" },
      { id: "1-c", name: "Station C", status: "Active" },
    ],
  },
  {
    id: "studio-2",
    name: "Studio 2",
    isLocked: false,
    allowManualOverride: true,
    stations: [
      { id: "2-a", name: "Station A", status: "Active" },
      {
        id: "2-b",
        name: "Station B",
        status: "Defective",
        warning: "Sensor malfunction",
      },
      { id: "2-c", name: "Station C", status: "Active" },
    ],
  },
];

export default function StudioManagementPage() {
  const [studios, setStudios] = useState<Studio[]>(initialStudios);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{
    studioId: string;
    station: Station;
  } | null>(null);
  const [defectNotes, setDefectNotes] = useState("");

  const toggleStationStatus = (
    studioId: string,
    stationId: string,
    newStatus: StationStatus,
    notes?: string,
  ) => {
    setStudios((prevStudios) =>
      prevStudios.map((studio) => {
        if (studio.id !== studioId) return studio;
        return {
          ...studio,
          stations: studio.stations.map((station) =>
            station.id === stationId
              ? {
                ...station,
                status: newStatus,
                warning:
                  newStatus === "Defective"
                    ? notes || station.warning
                    : undefined,
                defectNotes:
                  newStatus === "Defective"
                    ? notes || station.defectNotes
                    : undefined,
              }
              : station,
          ),
        };
      }),
    );
  };

  const handleMarkDefectClick = (studioId: string, station: Station) => {
    setSelectedStation({ studioId, station });
    setDefectNotes(station.defectNotes || "");
    setIsDefectModalOpen(true);
  };

  const confirmDefect = () => {
    if (selectedStation) {
      toggleStationStatus(
        selectedStation.studioId,
        selectedStation.station.id,
        "Defective",
        defectNotes,
      );
      setIsDefectModalOpen(false);
      setSelectedStation(null);
      setDefectNotes("");
    }
  };

  const toggleStudioLock = (studioId: string) => {
    setStudios((prevStudios) =>
      prevStudios.map((studio) =>
        studio.id === studioId ? { ...studio, isLocked: !studio.isLocked } : studio,
      ),
    );
  };

  const toggleOverride = (studioId: string) => {
    setStudios((prevStudios) =>
      prevStudios.map((studio) =>
        studio.id === studioId
          ? { ...studio, allowManualOverride: !studio.allowManualOverride }
          : studio,
      ),
    );
  };

  return (
    <div className="space-y-6 max-w-8xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">
          Studio Management
        </h1>
        <p className="text-brand-success mt-1 text-sm tracking-wider">
          Manage studios, stations, and hardware status
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by the Studio name or game"
          className="w-full bg-bg-card border-border py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {studios.map((studio) => (
          <div
            key={studio.id}
            className="bg-bg-card border-border p-6 md:p-8 flex flex-col h-full transition-all"
          >
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-pink-500 rounded-xl shadow-lg shadow-pink-500/20">
                  <Unlock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {studio.name}
                  </h2>
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-brand-success ">
                    {studio.isLocked ? "Locked" : "Unlocked"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleStudioLock(studio.id)}
                className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-brand-success/30 rounded-xl text-brand-success text-[10px] sm:text-xs font-bold hover:bg-brand-success/10 transition-colors uppercase tracking-wider"
              >
                <Lock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                {studio.isLocked ? "Unlock Studio" : "Lock Studio"}
              </button>
            </div>

            {/* Stations Section */}
            <div className="flex-1 space-y-6">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.15em] mb-4">
                Stations
              </h3>
              <div className="space-y-4">
                {studio.stations.map((station) => (
                  <div
                    key={station.id}
                    className={cn(
                      "bg-[#1e293b]/40 border rounded-2xl p-4 transition-all duration-300",
                      station.status === "Defective"
                        ? "border-red-900/50"
                        : "border-zinc-800",
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            station.status === "Defective"
                              ? "bg-brand-error/20"
                              : "bg-brand-success/20",
                          )}
                        >
                          {station.status === "Defective" ? (
                            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-brand-error" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-brand-success" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm sm:text-base">
                            {station.name}
                          </h4>
                          <span
                            className={cn(
                              "text-[10px] sm:text-xs uppercase font-bold px-2 py-0.5 rounded tracking-wider",
                              station.status === "Active"
                                ? "bg-brand-success/40 text-brand-success"
                                : station.status === "Defective"
                                  ? "bg-brand-error/40 text-brand-error"
                                  : "bg-zinc-800 text-zinc-500",
                            )}
                          >
                            {station.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {station.warning && (
                      <div className="bg-brand-error/20 border border-brand-error/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-brand-error shrink-0" />
                        <span className="text-brand-error text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          {station.warning}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          toggleStationStatus(studio.id, station.id, "Active")
                        }
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all",
                          station.status === "Active"
                            ? "bg-brand-success/20 text-brand-success border border-brand-success/50 cursor-default"
                            : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800",
                        )}
                      >
                        <Play
                          className={cn(
                            "w-3.5 h-3.5",
                            station.status === "Active" && "fill-brand-success",
                          )}
                        />
                        Activate
                      </button>
                      <button
                        onClick={() =>
                          toggleStationStatus(studio.id, station.id, "Inactive")
                        }
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all",
                          station.status === "Inactive"
                            ? "bg-zinc-800 text-white border border-zinc-700"
                            : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800",
                        )}
                      >
                        <Square
                          className={cn(
                            "w-3.5 h-3.5",
                            station.status === "Inactive" && "fill-white",
                          )}
                        />
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleMarkDefectClick(studio.id, station)}
                        className={cn(
                          "sm:col-span-2 md:col-span-1 flex cursor-pointer items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all text-nowrap",
                          station.status === "Defective"
                            ? "bg-brand-error/20 text-brand-error border border-brand-error/50"
                            : "text-zinc-500 border border-zinc-800 hover:bg-brand-error/10 hover:text-brand-error hover:border-brand-error/30",
                        )}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Mark Defect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Override Toggle */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Allow Manual Override
              </span>
              <button
                onClick={() => toggleOverride(studio.id)}
                className={cn(
                  "relative inline-flex h-5 w-10 md:h-6 md:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  studio.allowManualOverride
                    ? "bg-brand-secondary"
                    : "bg-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out",
                    studio.allowManualOverride
                      ? "translate-x-5"
                      : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* See All Studios Button */}
      <Link
        href="/admin/studio-management/all-studios"
        className="w-full bg-white cursor-pointer text-black py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base hover:bg-zinc-200 transition-colors shadow-xl flex justify-center items-center"
      >
        See All Studios
      </Link>

      {/* Defect Modal */}
      {isDefectModalOpen && selectedStation && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsDefectModalOpen(false)}
          />
          <div
            className="relative w-full max-w-xl border-border-2 rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "#0f172a", opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Mark Station as Defective
              </h2>
              <button
                onClick={() => setIsDefectModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Marking a station as defective will exclude it from future
              assignments. The studio will remain playable with remaining
              stations.
            </p>

            <div className="space-y-6">
              <div className="bg-[#1e293b] border-border rounded-2xl p-5">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Station
                </p>
                <p className="text-white text-base sm:text-lg font-bold">
                  {studios.find((r) => r.id === selectedStation.studioId)?.name} -{" "}
                  {selectedStation.station.name}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest ml-1">
                  Defect Notes
                </label>
                <textarea
                  value={defectNotes}
                  onChange={(e) => setDefectNotes(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full bg-[#1e293b] border-border rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all min-h-30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setIsDefectModalOpen(false)}
                  className="py-4 px-6 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDefect}
                  className="py-4 px-6 bg-brand-secondary text-black font-bold rounded-2xl hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20 cursor-pointer"
                >
                  Confirm Defect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
