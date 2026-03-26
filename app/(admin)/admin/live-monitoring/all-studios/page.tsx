"use client";

import React, { useState } from "react";
import {
    MapPin,
    Users,
    CheckCircle2,
    Pause,
    Play,
    Search,
    ArrowLeft,
    Clock,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { useGetStudiosQuery } from "@/redux/api/admin/studiosApi";
import { useTimer } from "@/hooks/useTimer";

const StudioSkeleton = () => (
    <div className="bg-bg-dark border-border rounded-2xl p-4 sm:p-5 space-y-4 animate-pulse">
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-800 rounded-xl" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-zinc-800 rounded" />
                    <div className="h-2.5 w-16 bg-zinc-800 rounded" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="h-2.5 w-10 bg-zinc-800 rounded ml-auto" />
                <div className="h-4 w-12 bg-zinc-800 rounded ml-auto" />
            </div>
        </div>
        <div className="bg-bg-deep border border-zinc-800 rounded-xl p-3 h-16" />
        <div className="space-y-2">
            <div className="h-2.5 w-16 bg-zinc-800 rounded" />
            <div className="space-y-1.5">
                <div className="h-8 bg-zinc-800 rounded-lg" />
                <div className="h-8 bg-zinc-800 rounded-lg" />
            </div>
        </div>
    </div>
);

export default function AllStudiosPage() {
    const { formattedTime } = useTimer();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | "OCCUPIED" | "AVAILABLE">("All");

    const { data: studiosData, isLoading: isStudiosLoading, isError: isStudiosError, refetch: refetchStudios } = useGetStudiosQuery();
    const studios = studiosData?.data || [];

    const [pausedStudios, setPausedStudios] = useState<Set<number>>(new Set());

    const togglePause = (studioId: number) => {
        setPausedStudios(prev => {
            const next = new Set(prev);
            if (next.has(studioId)) next.delete(studioId);
            else next.add(studioId);
            return next;
        });
    };

    const filtered = studios.filter(studio => {
        const matchesSearch = studio.name.toLowerCase().includes(search.toLowerCase()) ||
            studio.gameName.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || studio.status === filter;
        return matchesSearch && matchesFilter;
    });

    const occupiedCount = studios.filter(r => r.status === "OCCUPIED").length;
    const availableCount = studios.filter(r => r.status === "AVAILABLE").length;

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/live-monitoring"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">All Studios</h1>
                        <p className="text-brand-success mt-0.5 text-sm tracking-wider">
                            Overview of all {studios.length} studios
                        </p>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="px-3 py-1.5 bg-brand-success/10 text-brand-success rounded-lg">
                        {occupiedCount} Occupied
                    </span>
                    <span className="px-3 py-1.5 bg-brand-info/10 text-brand-info rounded-lg">
                        {availableCount} Available
                    </span>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by studio name or game..."
                        className="w-full bg-bg-card border-border py-2.5 pl-11 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm rounded-lg italic"
                    />
                </div>
                <div className="flex gap-2">
                    {(["All", "OCCUPIED", "AVAILABLE"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                                filter === f
                                    ? "bg-brand-secondary text-black"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            )}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Showing {filtered.length} of {studios.length} studios
            </p>

            {/* Studios Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {isStudiosLoading ? (
                    Array.from({ length: 9 }).map((_, i) => (
                        <StudioSkeleton key={i} />
                    ))
                ) : isStudiosError ? (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center bg-bg-dark border border-brand-error/20 rounded-3xl">
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
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-bg-dark border border-zinc-800 rounded-3xl">
                        <MapPin className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
                        <p className="font-bold text-sm uppercase tracking-wider text-zinc-500">No studios found</p>
                        <p className="text-xs mt-1 text-zinc-600">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    filtered.map((studio) => {
                        const isPaused = pausedStudios.has(studio.id);
                        return (
                            <div
                                key={studio.id}
                                className="bg-bg-dark border-border rounded-2xl p-4 sm:p-5 space-y-4 transition-colors"
                            >
                                {/* Studio Header */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin className="text-white w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-sm font-bold line-clamp-1">{studio.name}</h3>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 w-fit mt-0.5",
                                                studio.status === "OCCUPIED"
                                                    ? "bg-brand-success/20 text-brand-success"
                                                    : "bg-brand-info/20 text-brand-info"
                                            )}>
                                                {studio.status === "OCCUPIED"
                                                    ? <CheckCircle2 className="w-2.5 h-2.5" />
                                                    : <Users className="w-2.5 h-2.5" />
                                                }
                                                {studio.status}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Time Left */}
                                    <div className="text-right shrink-0">
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" /> Time Left
                                        </p>
                                        <p className="text-white text-base font-bold">{studio.status === "OCCUPIED" ? formattedTime : "--"}</p>
                                    </div>
                                </div>

                                {/* Group Info */}
                                <div className="bg-bg-deep border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3">
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Current Group</p>
                                        <p className="text-white font-bold truncate text-sm">{"N/A"}</p>
                                        <p className="text-zinc-600 text-xs truncate">{studio.gameName}</p>
                                    </div>
                                    {studio.status === "OCCUPIED" && (
                                        <div
                                            onClick={() => togglePause(studio.id)}
                                            title={isPaused ? "Resume" : "Pause"}
                                            className="bg-brand-secondary p-1.5 rounded-md cursor-pointer hover:bg-brand-secondary/90 shrink-0 transition-colors"
                                        >
                                            {isPaused
                                                ? <Play className="w-3.5 h-3.5 text-black" fill="black" />
                                                : <Pause className="w-3.5 h-3.5 text-black" fill="black" />
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Stations */}
                                <div className="space-y-2">
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Stations</p>
                                    <div className="space-y-1.5">
                                        {studio.stations.map((station) => (
                                            <div
                                                key={station.id}
                                                className="bg-bg-card border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "p-0.5 rounded",
                                                        station.status === "ACTIVE" ? "bg-brand-success/20" : "bg-zinc-800"
                                                    )}>
                                                        <CheckCircle2 className={cn(
                                                            "w-3.5 h-3.5",
                                                            station.status === "ACTIVE" ? "text-brand-success" : "text-zinc-600"
                                                        )} />
                                                    </div>
                                                    <span className="text-white text-xs font-semibold">Station {station.name}</span>
                                                </div>
                                                {/* {station.currentSubTeamId && (
                                                    <span className="text-zinc-400 text-xs font-medium">{station.currentSubTeamId}</span>
                                                )} */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Assign button for available studios */}
                                {studio.status === "AVAILABLE" && (
                                    <button className="w-full cursor-pointer bg-brand-secondary text-black py-2 rounded-xl font-bold hover:bg-brand-secondary/90 transition-colors text-xs">
                                        Available for Assign Group
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
