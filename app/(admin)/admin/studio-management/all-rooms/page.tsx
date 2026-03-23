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
  ArrowLeft,
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

const initialStudios: Studio[] = Array.from({ length: 19 }, (_, i) => ({
  id: `studio-${i + 1}`,
  name: `Studio ${i + 1}`,
  isLocked: false,
  allowManualOverride: true,
  stations: [
    { id: `${i + 1}-a`, name: "Station A", status: "Active" },
    {
      id: `${i + 1}-b`,
      name: "Station B",
      status: i === 1 ? "Defective" : "Active",
      warning: i === 1 ? "Sensor malfunction" : undefined,
    },
    { id: `${i + 1}-c`, name: "Station C", status: "Active" },
  ],
}));

export default function AllStudioManagementPage() {
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

  const filteredStudios = studios.filter((studio) =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/studio-management"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">
            All Studios Management
          </h1>
          <p className="text-brand-success mt-1 text-sm tracking-wider">
            Manage all {studios.length} studios and hardware status
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by the Studio name or game"
          className="w-full bg-bg-card border-border py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudios.map((studio) => (
          <div
            key={studio.id}
            className="bg-bg-card border-border p-5 md:p-6 flex flex-col h-full transition-all rounded-2xl"
          >
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500 rounded-lg shadow-lg shadow-pink-500/20">
                  <Unlock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {studio.name}
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-success ">
                    {studio.isLocked ? "Locked" : "Unlocked"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleStudioLock(studio.id)}
                className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 border border-brand-success/30 rounded-lg text-brand-success text-[10px] font-bold hover:bg-brand-success/10 transition-colors uppercase tracking-wider"
              >
                <Lock className="w-3 h-3" />
                {studio.isLocked ? "Unlock" : "Lock"}
              </button>
            </div>

            {/* Stations Section */}
            <div className="flex-1 space-y-4">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                Stations
              </h3>
              <div className="space-y-3">
                {studio.stations.map((station) => (
                  <div
                    key={station.id}
                    className={cn(
                      "bg-[#1e293b]/40 border rounded-xl p-3 transition-all duration-300",
                      station.status === "Defective"
                        ? "border-red-900/50"
                        : "border-zinc-800",
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-1.5 rounded-md",
                            station.status === "Defective"
                              ? "bg-brand-error/20"
                              : "bg-brand-success/20",
                          )}
                        >
                          {station.status === "Defective" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-brand-error" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-xs">
                            {station.name}
                          </h4>
                          <span
                            className={cn(
                              "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider",
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

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() =>
                          toggleStationStatus(studio.id, station.id, "Active")
                        }
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                          station.status === "Active"
                            ? "bg-brand-success/20 text-brand-success border border-brand-success/50 cursor-default"
                            : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800",
                        )}
                      >
                        <Play
                          className={cn(
                            "w-3 h-3",
                            station.status === "Active" && "fill-brand-success",
                          )}
                        />
                        Active
                      </button>
                      <button
                        onClick={() =>
                          toggleStationStatus(studio.id, station.id, "Inactive")
                        }
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                          station.status === "Inactive"
                            ? "bg-zinc-800 text-white border border-zinc-700"
                            : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800",
                        )}
                      >
                        <Square
                          className={cn(
                            "w-3 h-3",
                            station.status === "Inactive" && "fill-white",
                          )}
                        />
                        Off
                      </button>
                      <button
                        onClick={() => handleMarkDefectClick(studio.id, station)}
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                          station.status === "Defective"
                            ? "bg-brand-error/20 text-brand-error border border-brand-error/50"
                            : "text-zinc-500 border border-zinc-800 hover:bg-brand-error/10 hover:text-brand-error hover:border-brand-error/30",
                        )}
                      >
                        <Wrench className="w-3 h-3" />
                        Defect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Override Toggle */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Manual Override
              </span>
              <button
                onClick={() => toggleOverride(studio.id)}
                className={cn(
                  "relative inline-flex h-4 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  studio.allowManualOverride
                    ? "bg-brand-secondary"
                    : "bg-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out",
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

      {/* Defect Modal */}
      {isDefectModalOpen && selectedStation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
              assignments.
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
                  className="w-full bg-[#1e293b] border-border rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all min-h-[120px] resize-none"
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
