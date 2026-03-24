"use client";

import {
    MapPin,
    Users,
    AlertCircle,
    Search,
    Plus,
    Pause,
    Play,
    CheckCircle2,
    X
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCreateGroupMutation } from "@/redux/api/admin/groupsApi";
import { useGetStudiosQuery } from "@/redux/api/admin/studiosApi";
import { useGetDashboardStatsQuery } from "@/redux/api/admin/dashboardApi";

const StatSkeleton = () => (
    <div className="bg-bg-dark border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-4 animate-pulse">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-800 shrink-0" />
        <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-6 w-12 bg-zinc-800 rounded" />
        </div>
    </div>
);

const StudioSkeleton = () => (
    <div className="bg-bg-dark border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-pulse">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800 rounded-xl shrink-0" />
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded" />
                    <div className="h-3 w-16 bg-zinc-800 rounded" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="h-3 w-12 bg-zinc-800 rounded ml-auto" />
                <div className="h-5 w-16 bg-zinc-800 rounded ml-auto" />
            </div>
        </div>
        <div className="bg-bg-deep border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 h-24" />
        <div className="space-y-3">
            <div className="h-3 w-16 bg-zinc-800 rounded" />
            <div className="space-y-2">
                <div className="h-10 bg-zinc-800 rounded-xl" />
                <div className="h-10 bg-zinc-800 rounded-xl" />
            </div>
        </div>
    </div>
);

export default function LiveMonitoringPage() {
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState<string>("12");
    const [pin, setPin] = useState<string>("");
    const [isChildrenFavour, setIsChildrenFavour] = useState(false);
    const [pausedStudios, setPausedStudios] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const { data: studiosData, isLoading: isStudiosLoading, isError: isStudiosError, refetch: refetchStudios } = useGetStudiosQuery();
    const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError } = useGetDashboardStatsQuery();
    const [createGroup, { isLoading: isCreatingGroup }] = useCreateGroupMutation();

    const dashboardStats = dashboardData?.data;

    const stats = [
        {
            label: "Active Studios",
            value: dashboardStats?.activeGroups?.toString().padStart(2, '0') ?? "00",
            icon: MapPin,
            color: "text-brand-success",
            bgColor: "bg-brand-success/10",
        },
        {
            label: "Waiting Groups",
            value: dashboardStats?.waitingGroups?.toString().padStart(2, '0') ?? "00",
            icon: Users,
            color: "text-brand-info",
            bgColor: "bg-brand-info/10",
        },
        {
            label: "Defective Stations",
            value: dashboardStats?.defectiveStations?.toString().padStart(2, '0') ?? "00",
            icon: (dashboardStats?.defectiveStations ?? 0) > 0 ? AlertCircle : CheckCircle2,
            color: (dashboardStats?.defectiveStations ?? 0) > 0 ? "text-brand-error" : "text-brand-success",
            bgColor: (dashboardStats?.defectiveStations ?? 0) > 0 ? "bg-brand-error/10" : "bg-brand-success/10",
        },
    ];

    const togglePause = (studioId: number) => {
        setPausedStudios(prev => {
            const next = new Set(prev);
            if (next.has(studioId)) next.delete(studioId);
            else next.add(studioId);
            return next;
        });
    };

    const handleCreateGroup = async () => {
        setError(null);
        if (!maxPlayers || !pin) {
            setError("Max players and PIN are required.");
            return;
        }

        try {
            const payload = {
                name: groupName || undefined,
                maxPlayers: parseInt(maxPlayers),
                pin: pin,
                childFriendly: isChildrenFavour,
            };


            const response = await createGroup(payload).unwrap();

            if (response.success) {
                setIsCreateGroupModalOpen(false);
                setGroupName("");
                setMaxPlayers("12");
                setPin("");
                setIsChildrenFavour(false);
            } else {
                setError(response.message || "Failed to create group");
            }
        } catch (err: any) {
            console.log(err)
            setError(err?.data?.message || "An error occurred while creating the group");
        }
    };

    const studios = studiosData?.data || [];

    return (
        <div className="space-y-8 max-w-8xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">Admin Dashboard</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Welcome back! Here's what's happening with your platform.</p>
                </div>
                <button
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="w-full sm:w-auto bg-brand-secondary cursor-pointer text-black px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary/90 transition-colors text-sm sm:text-base"
                >
                    <Plus className="w-4 h-4" />
                    Create New Group
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isDashboardLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <StatSkeleton key={i} />
                    ))
                ) : isDashboardError ? (
                    <div className="col-span-full py-6 flex items-center justify-center bg-brand-error/10 border border-brand-error/20 rounded-2xl text-brand-error text-xs font-bold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Failed to load dashboard stats
                    </div>
                ) : (
                    stats.map((stat) => (
                        <div key={stat.label} className="bg-bg-dark border-border p-4 sm:p-6 flex items-center justify-between group transition-all duration-300">
                            <div>
                                <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-white text-xl sm:text-2xl font-bold mt-1 sm:mt-2 tracking-tight">{stat.value}</p>
                            </div>
                            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform", stat.bgColor)}>
                                <stat.icon className={cn("w-5 h-5 sm:w-6 h-6", stat.color)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Live Studio Status Section */}
            <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Live Studio Status</h2>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by the Studio name or game"
                        className="w-full bg-bg-card border-border py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base italic"
                    />
                </div>

                {/* Studio Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {isStudiosLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <StudioSkeleton key={i} />
                        ))
                    ) : isStudiosError ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center bg-bg-dark border border-brand-error/20 rounded-3xl">
                            <AlertCircle className="w-12 h-12 text-brand-error mb-4 opacity-50" />
                            <h3 className="text-white text-lg font-bold">Failed to load studios</h3>
                            <p className="text-zinc-500 text-sm mt-1">Please check your connection and try again.</p>
                            <button
                                onClick={() => refetchStudios()}
                                className="mt-6 px-6 py-2 bg-brand-secondary text-black rounded-xl font-bold hover:bg-brand-secondary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : studios.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-bg-dark border border-zinc-800 rounded-3xl">
                            <MapPin className="w-12 h-12 text-zinc-800 mb-4" />
                            <h3 className="text-zinc-500 text-lg font-bold italic">No active studios available</h3>
                        </div>
                    ) : (
                        studios.map((studio) => (
                            <div key={studio.id} className="bg-bg-dark border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 transition-colors">
                                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-accent rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin className="text-white w-4 h-4 sm:w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-base sm:text-lg font-bold line-clamp-1">{studio.name}</h3>
                                            <span className={cn(
                                                "text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 w-fit mt-1",
                                                studio.status === "OCCUPIED" ? "bg-brand-success/20 text-brand-success" : "bg-brand-info/20 text-brand-info"
                                            )}>
                                                {studio.status === "OCCUPIED" ? <CheckCircle2 className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                                {studio.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-left xs:text-right">
                                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Time Left</p>
                                        <p className="text-white text-lg sm:text-xl font-bold">{"--"}</p>
                                    </div>
                                </div>

                                {/* Group Info Box */}
                                <div className="bg-bg-deep border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Current Group</p>
                                        <p className="text-white font-bold truncate text-sm sm:text-base">{"N/A"}</p>
                                        <p className="text-zinc-600 text-xs sm:text-sm truncate">{studio.gameName}</p>
                                    </div>
                                    {studio.status === "OCCUPIED" && (
                                        <div
                                            onClick={() => togglePause(studio.id)}
                                            className="bg-brand-secondary p-1.5 sm:p-2 rounded-md cursor-pointer hover:bg-brand-secondary/90 shrink-0 transition-colors"
                                            title={pausedStudios.has(studio.id) ? "Resume" : "Pause"}
                                        >
                                            {pausedStudios.has(studio.id)
                                                ? <Play className="w-3.5 h-3.5 sm:w-4 h-4 text-black" fill="black" />
                                                : <Pause className="w-3.5 h-3.5 sm:w-4 h-4 text-black" fill="black" />
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Stations List */}
                                <div className="space-y-3">
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Stations</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                                        {studio.stations.map((station) => (
                                            <div key={station.id} className="bg-bg-card border border-zinc-800 rounded-xl p-3 flex items-center justify-between transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-1 rounded-md",
                                                        station.status === "ACTIVE" ? "bg-brand-success/20" : "bg-zinc-800"
                                                    )}>
                                                        <CheckCircle2 className={cn(
                                                            "w-4 h-4",
                                                            station.status === "ACTIVE" ? "text-brand-success" : "text-zinc-600"
                                                        )} />
                                                    </div>
                                                    <span className="text-white text-sm sm:text-base font-semibold">Station {station.name}</span>
                                                </div>
                                                {/* {station.currentSubTeamId && <span className="text-zinc-400 text-xs sm:text-sm font-medium">{station.currentSubTeamId}</span>} */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* {studio.status === "AVAILABLE" && (
                                    <button className="w-full cursor-pointer bg-brand-secondary text-black py-2.5 sm:py-3 rounded-xl font-bold hover:bg-brand-secondary/90 transition-colors mt-2 text-sm sm:text-base">
                                        Available for Assign Group
                                    </button>
                                )} */}
                            </div>
                        ))
                    )}
                </div>

                <Link
                    href="/admin/live-monitoring/all-studios"
                    className="w-full cursor-pointer py-2.5 sm:py-3 bg-white text-black font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-zinc-200 transition-colors shadow-2xl shadow-white/5 flex items-center justify-center"
                >
                    See All Studios
                </Link>
            </div>
            {/* Create Group Modal */}
            {isCreateGroupModalOpen && (
                // <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                //     <div
                //         className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                //         onClick={() => setIsCreateGroupModalOpen(false)}
                //     />
                //     <div
                //         className="relative w-full max-w-xl border border-[#fff200] rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
                //         style={{ backgroundColor: '#111827', opacity: 1 }}
                //     >
                //         <div className="flex items-center gap-3 mb-8">
                //             <Plus className="text-brand-error w-6 h-6" />
                //             <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Group</h2>
                //         </div>

                //         <div className="space-y-6">
                //             <div className="space-y-2">
                //                 <label className="block text-zinc-400 text-sm font-medium ml-1">
                //                     Group Name (Optional)
                //                 </label>
                //                 <input
                //                     type="text"
                //                     value={groupName}
                //                     onChange={(e) => setGroupName(e.target.value)}
                //                     placeholder="e.g., Team Phoenix"
                //                     className="w-full bg-[#1e293b] border border-[#fff200] rounded-xl p-4 text-brand-success placeholder:text-brand-success/40 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all"
                //                 />
                //             </div>

                //             <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setIsChildrenFavour(!isChildrenFavour)}>
                //                 <div className={cn(
                //                     "mt-1 w-5 h-5 rounded border border-[#fff200] flex items-center justify-center transition-colors",
                //                     isChildrenFavour ? "bg-brand-secondary" : "bg-transparent"
                //                 )}>
                //                     {isChildrenFavour && <CheckCircle2 className="w-4 h-4 text-black" />}
                //                 </div>
                //                 <p className="text-brand-error text-sm leading-relaxed select-none">
                //                     If this is Children favour groups, then please put a check mark in the box.
                //                 </p>
                //             </div>

                //             <div className="grid grid-cols-2 gap-4 mt-8">
                //                 <button
                //                     onClick={() => setIsCreateGroupModalOpen(false)}
                //                     className="py-4 px-6 bg-white text-black font-bold rounded-2xl cursor-pointer hover:bg-zinc-200 transition-colors"
                //                 >
                //                     Back
                //                 </button>
                //                 <button
                //                     onClick={handleCreateGroup}
                //                     className="py-4 px-6 bg-brand-secondary text-black font-bold rounded-2xl cursor-pointer hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20"
                //                 >
                //                     Create Group
                //                 </button>
                //             </div>
                //         </div>
                //     </div>
                // </div>
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsCreateGroupModalOpen(false)}
                    />
                    <div
                        className="relative w-full max-w-xl border border-[#fff200] rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
                        style={{ backgroundColor: '#111827', opacity: 1 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Plus className="text-brand-error w-6 h-6" />
                            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Group</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-zinc-400 text-sm font-medium ml-1">
                                    Group Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="e.g., Team Phoenix"
                                    className="w-full bg-[#1e293b] border border-[#fff200] rounded-xl p-4 text-brand-success placeholder:text-brand-success/40 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-zinc-400 text-sm font-medium ml-1">
                                        Max Players
                                    </label>
                                    <input
                                        type="number"
                                        value={maxPlayers}
                                        onChange={(e) => setMaxPlayers(e.target.value)}
                                        placeholder="12"
                                        className="w-full bg-[#1e293b] border border-[#fff200] rounded-xl p-4 text-brand-success placeholder:text-brand-success/40 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-zinc-400 text-sm font-medium ml-1">
                                        PIN
                                    </label>
                                    <input
                                        type="text"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="ABC123"
                                        className="w-full bg-[#1e293b] border border-[#fff200] rounded-xl p-4 text-brand-success placeholder:text-brand-success/40 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setIsChildrenFavour(!isChildrenFavour)}>
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded border border-[#fff200] flex items-center justify-center transition-colors",
                                    isChildrenFavour ? "bg-brand-secondary" : "bg-transparent"
                                )}>
                                    {isChildrenFavour && <CheckCircle2 className="w-4 h-4 text-black" />}
                                </div>
                                <p className="text-brand-error text-sm leading-relaxed select-none">
                                    If this is Children favour groups, then please put a check mark in the box.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-brand-error/10 border border-brand-error/20 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-brand-error shrink-0" />
                                    <p className="text-brand-error text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => setIsCreateGroupModalOpen(false)}
                                    className="py-4 px-6 bg-white text-black font-bold rounded-2xl cursor-pointer hover:bg-zinc-200 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={isCreatingGroup}
                                    className="py-4 px-6 bg-brand-secondary text-black font-bold rounded-2xl cursor-pointer hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCreatingGroup ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Group"
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
