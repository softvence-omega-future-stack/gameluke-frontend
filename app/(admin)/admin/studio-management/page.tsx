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
  ImagePlus,
  Upload,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { useGetStudiosQuery, useLockStudioMutation, useUnlockStudioMutation, useToggleManualOverrideMutation, useUpdateStationStatusMutation, useUploadStudioImageMutation } from "@/redux/api/admin/studiosApi";
import { useEffect } from "react";

type StationStatus = "Active" | "Inactive" | "Defective" | "Maintenance";

interface Station {
  id: string;
  name: string;
  status: StationStatus;
  warning?: string;
  defectNotes?: string;
}

interface Studio {
  id: string;
  studioNumber: number;
  name: string;
  isLocked: boolean;
  status: string;
  activeGroupName: string;
  stations: Station[];
  allowManualOverride: boolean;
}

const statusMap: Record<string, StationStatus> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DEFECTIVE: "Defective",
  MAINTENANCE: "Maintenance",
};

const apiStatusMap: Record<StationStatus, "ACTIVE" | "INACTIVE" | "DEFECTIVE" | "MAINTENANCE"> = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Defective: "DEFECTIVE",
  Maintenance: "MAINTENANCE",
};

const StudioManagementSkeleton = () => (
  <div className="bg-bg-card border-border p-6 md:p-8 flex flex-col h-full animate-pulse">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-800 rounded" />
          <div className="h-3 w-16 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="h-10 w-32 bg-zinc-800 rounded-xl" />
    </div>
    <div className="space-y-6 flex-1">
      <div className="h-3 w-20 bg-zinc-800 rounded" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#1e293b]/20 border border-zinc-800 rounded-2xl p-4 h-32" />
        ))}
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
      <div className="h-3 w-32 bg-zinc-800 rounded" />
      <div className="h-6 w-11 bg-zinc-800 rounded-full" />
    </div>
  </div>
);

export default function StudioManagementPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const { data: studiosData, isLoading, isError, refetch } = useGetStudiosQuery();
  const [lockStudio] = useLockStudioMutation();
  const [unlockStudio] = useUnlockStudioMutation();
  const [toggleManualOverride] = useToggleManualOverrideMutation();
  const [updateStationStatus] = useUpdateStationStatusMutation();
  const [uploadStudioImage, { isLoading: isUploading }] = useUploadStudioImageMutation();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingStudioId, setUploadingStudioId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (studiosData?.data) {
      const mappedStudios: Studio[] = studiosData.data.map(s => ({
        id: s.id.toString(),
        studioNumber: s.studioNumber,
        name: s.name,
        status: s.status,
        activeGroupName: s.assignments?.[0]?.groupName || "",
        isLocked: s.status === "MAINTENANCE" || s.status === "LOCKED",
        allowManualOverride: s.manualOverride,
        stations: s.stations.map(st => ({
          id: st.id,
          name: `Station ${st.name}`,
          status: statusMap[st.status] || "Inactive",
          warning: st.defectReason || undefined,
        }))
      }));
      setStudios(mappedStudios);
    }
  }, [studiosData]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{
    studioId: string;
    station: Station;
  } | null>(null);
  const [defectNotes, setDefectNotes] = useState("");

  const toggleStationStatus = async (
    studioId: string,
    stationId: string,
    newStatus: StationStatus,
    notes?: string,
  ) => {
    const studio = studios.find(s => s.id === studioId);
    if (!studio) return;
    const station = studio.stations.find(s => s.id === stationId);
    if (!station) return;

    const oldStatus = station.status;
    const oldWarning = station.warning;
    const oldDefectNotes = station.defectNotes;

    // Optimistic update
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
                warning: newStatus === "Defective" ? notes || station.warning : undefined,
                defectNotes: newStatus === "Defective" ? notes || station.defectNotes : undefined,
              }
              : station,
          ),
        };
      }),
    );

    try {
      await updateStationStatus({
        stationId,
        status: apiStatusMap[newStatus] as any,
        defectReason: notes,
      }).unwrap();
    } catch (err) {
      // Revert on error
      setStudios((prevStudios) =>
        prevStudios.map((studio) => {
          if (studio.id !== studioId) return studio;
          return {
            ...studio,
            stations: studio.stations.map((station) =>
              station.id === stationId
                ? {
                  ...station,
                  status: oldStatus,
                  warning: oldWarning,
                  defectNotes: oldDefectNotes,
                }
                : station,
            ),
          };
        }),
      );
      console.error("Failed to update station status:", err);
    }
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

  const toggleStudioLock = async (studioId: string) => {
    const studioToLock = studios.find(s => s.id === studioId);
    if (!studioToLock) return;

    const isCurrentlyLocked = studioToLock.isLocked;

    // Optimistic update
    setStudios((prevStudios) =>
      prevStudios.map((studio) =>
        studio.id === studioId ? { ...studio, isLocked: !isCurrentlyLocked } : studio,
      ),
    );

    try {
      if (isCurrentlyLocked) {
        await unlockStudio({ studioNumber: studioToLock.studioNumber }).unwrap();
      } else {
        await lockStudio({ studioNumber: studioToLock.studioNumber }).unwrap();
      }
    } catch (err) {
      // Revert on error
      setStudios((prevStudios) =>
        prevStudios.map((studio) =>
          studio.id === studioId ? { ...studio, isLocked: isCurrentlyLocked } : studio,
        ),
      );
      console.error("Failed to update studio lock:", err);
    }
  };

  const toggleOverride = async (studioId: string) => {
    const studioToOverride = studios.find(s => s.id === studioId);
    if (!studioToOverride) return;

    const isCurrentlyOverridden = studioToOverride.allowManualOverride;

    // Optimistic update
    setStudios((prevStudios) =>
      prevStudios.map((studio) =>
        studio.id === studioId
          ? { ...studio, allowManualOverride: !isCurrentlyOverridden }
          : studio,
      ),
    );

    try {
      await toggleManualOverride({
        studioNumber: studioToOverride.studioNumber,
        enabled: !isCurrentlyOverridden
      }).unwrap();
    } catch (err) {
      // Revert on error
      setStudios((prevStudios) =>
        prevStudios.map((studio) =>
          studio.id === studioId
            ? { ...studio, allowManualOverride: isCurrentlyOverridden }
            : studio,
        ),
      );
      console.error("Failed to toggle manual override:", err);
    }
  };

  const openUploadModal = (studioId: string) => {
    setUploadingStudioId(studioId);
    setIsUploadModalOpen(true);
    setUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadingStudioId || !selectedFile) return;

    try {
      await uploadStudioImage({
        studioId: uploadingStudioId,
        image: selectedFile,
      }).unwrap();
      setIsUploadModalOpen(false);
      setUploadingStudioId(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setUploadError(err?.data?.message || "Failed to upload image. Please try again.");
    }
  };

  const filteredStudios = studios.filter((studio) =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.stations.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          className="w-full bg-bg-card border border-border py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base rounded-2xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <StudioManagementSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-bg-card border border-border rounded-3xl space-y-4">
            <AlertTriangle className="w-12 h-12 text-brand-error opacity-50" />
            <div className="text-center">
              <h3 className="text-white font-bold text-lg">Failed to load studios</h3>
              <p className="text-zinc-500 text-sm mt-1">There was an error fetching the studio data.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-brand-secondary text-black font-bold rounded-xl hover:bg-brand-secondary/90 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredStudios.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-bg-card border border-border rounded-3xl space-y-4">
            <Search className="w-12 h-12 text-zinc-500 opacity-50" />
            <div className="text-center">
              <h3 className="text-white font-bold text-lg">No studios found</h3>
              <p className="text-zinc-500 text-sm mt-1">Try adjusting your search query "{searchQuery}".</p>
            </div>
          </div>
        ) : (
          filteredStudios.map((studio) => (
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
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] sm:text-xs uppercase font-bold tracking-wider",
                        studio.status === "OCCUPIED" ? "text-brand-secondary" : "text-brand-success"
                      )}>
                        {studio.isLocked ? "Locked" : studio.status === "OCCUPIED" ? "Occupied" : "Available"}
                      </span>
                      {studio.status === "OCCUPIED" && studio.activeGroupName && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span className="text-[10px] sm:text-xs font-bold text-zinc-400">
                            Current: <span className="text-brand-secondary">{studio.activeGroupName}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openUploadModal(studio.id)}
                    className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl text-brand-secondary text-[10px] sm:text-xs font-bold hover:bg-brand-secondary/20 transition-colors uppercase tracking-wider"
                  >
                    <ImagePlus className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    Upload Image
                  </button>
                  <button
                    onClick={() => toggleStudioLock(studio.id)}
                    className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-brand-success/30 rounded-xl text-brand-success text-[10px] sm:text-xs font-bold hover:bg-brand-success/10 transition-colors uppercase tracking-wider"
                  >
                    <Lock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    {studio.isLocked ? "Unlock Studio" : "Lock Studio"}
                  </button>
                </div>
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
                            ) : station.status === "Maintenance" ? (
                              <Wrench className="w-4 h-4 md:w-5 md:h-5 text-brand-warning" />
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
                                    : station.status === "Maintenance"
                                      ? "bg-brand-warning/40 text-brand-warning"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          onClick={() => handleMarkDefectClick(studio.id, station)}
                          className={cn(
                            "flex cursor-pointer items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all text-nowrap",
                            station.status === "Defective"
                              ? "bg-brand-error/20 text-brand-error border border-brand-error/50"
                              : "text-zinc-500 border border-zinc-800 hover:bg-brand-error/10 hover:text-brand-error hover:border-brand-error/30",
                          )}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Mark Defect
                        </button>
                        <button
                          onClick={() =>
                            toggleStationStatus(studio.id, station.id, "Maintenance")
                          }
                          className={cn(
                            "flex cursor-pointer items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all text-nowrap",
                            station.status === "Maintenance"
                              ? "bg-brand-warning/20 text-brand-warning border border-brand-warning/50"
                              : "text-zinc-500 border border-zinc-800 hover:bg-brand-warning/10 hover:text-brand-warning hover:border-brand-warning/30",
                          )}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          Maintenance
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
          ))
        )}
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
      {/* Upload Image Modal */}
      {isUploadModalOpen && uploadingStudioId && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsUploadModalOpen(false)}
          />
          <div
            className="relative w-full max-w-md border-border-2 rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "#0f172a", opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Upload Studio Image
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e293b] border-border rounded-2xl p-5 text-center">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Studio
                </p>
                <p className="text-white text-base sm:text-lg font-bold">
                  {studios.find((r) => r.id === uploadingStudioId)?.name}
                </p>
              </div>

              {/* Image Preview Area */}
              <div className="relative group">
                <div className={cn(
                  "w-full aspect-video rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center overflow-hidden transition-all",
                  previewUrl ? "border-brand-secondary/50" : "hover:border-zinc-500"
                )}>
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="p-2 bg-brand-error text-white rounded-full hover:bg-brand-error/90 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 group">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-3 group-hover:bg-zinc-700 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300" />
                      </div>
                      <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-400">Click to select image</p>
                      <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">PNG, JPG or WEBP</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="bg-brand-error/10 border border-brand-error/30 rounded-xl p-3 flex items-center gap-2 text-brand-error text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="py-4 px-6 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="py-4 px-6 bg-brand-secondary text-black font-bold rounded-2xl hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
