"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, ArrowRight, AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAvailableGroupsQuery } from "@/redux/api/player/playerApi";

const GroupSkeleton = () => (
    <div className="bg-[#121216]/90 border border-[#333]/50 p-5 flex items-center justify-between animate-pulse rounded-xl">
        <div className="flex flex-col gap-3 w-full">
            <div className="h-5 bg-zinc-800 rounded-lg w-1/2" />
            <div className="flex gap-3">
                <div className="h-3 bg-zinc-800 rounded w-20" />
                <div className="h-3 bg-zinc-800 rounded w-20" />
            </div>
        </div>
        <div className="w-6 h-6 bg-zinc-800 rounded-full" />
    </div>
);

export default function AvailableGroupPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Player");
    const { data: groupsData, isLoading, isError, refetch } = useGetAvailableGroupsQuery();

    useEffect(() => {
        const storedName = localStorage.getItem("playerName") || localStorage.getItem("userName");
        if (storedName) setUserName(storedName);
    }, []);

    const groups = groupsData?.data || [];

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4 overflow-hidden">
            {/* Blurry Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/arcade-bg.png"
                    alt="Arcade Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.3] blur-[6px] scale-110"
                    priority
                />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">

                {/* Header Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-white/10">
                    <Users className="text-black w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Welcome Message */}
                <div className="text-center mb-8">
                    <h1 className="text-[#FFFF00] text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2 drop-shadow-sm">
                        Welcome, {userName}!
                    </h1>
                    <p className="text-gray-400 text-sm font-medium opacity-80">
                        Join your gaming group to continue
                    </p>
                </div>

                {/* Available Groups List */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-white text-xs font-bold uppercase tracking-widest opacity-60">
                            Available Groups {!isLoading && !isError && `(${groups.length})`}
                        </h2>
                        {isError && (
                            <button
                                onClick={() => refetch()}
                                className="text-[#FFFF00] text-[11px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                Retry
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 scrollbar-hide">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => <GroupSkeleton key={i} />)
                        ) : isError ? (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-3">
                                <AlertTriangle className="text-red-500 w-10 h-10 opacity-50" />
                                <div>
                                    <h3 className="text-white font-bold text-sm">Connection Error</h3>
                                    <p className="text-gray-500 text-xs mt-1">Failed to fetch available groups.</p>
                                </div>
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="bg-[#121216]/50 border border-white/5 rounded-2xl p-10 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                    <Users className="text-zinc-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">No Active Groups</h3>
                                    <p className="text-gray-500 text-xs mt-1 max-w-[200px]">There are currently no active groups available to join.</p>
                                </div>
                            </div>
                        ) : (
                            groups.map((group) => {
                                const slotsAvailable = group.maxPlayers - group.totalPlayers;
                                return (
                                    <div
                                        key={group.id}
                                        onClick={() => router.push(`/pin-verification/${group.id}`)}
                                        className="group cursor-pointer bg-[#121216]/90 border border-white/5 p-4 sm:p-5 flex items-center justify-between transition-all hover:bg-[#1A1A1F] hover:border-white/10 active:scale-[0.98] backdrop-blur-sm rounded-xl"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-white text-base sm:text-lg font-bold flex items-center">
                                                {group.name}
                                                {group.childFriendly && (
                                                    <span className="bg-[#E91E63]/10 text-[#E91E63] text-[10px] uppercase font-black px-2 py-0.5 rounded-full ml-3 tracking-tighter">
                                                        Child Friendly
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="text-[#00E676] text-[11px] font-bold flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                                                    <span>{group.totalPlayers} Players Joined</span>
                                                </div>
                                                <span className="text-gray-700 font-normal">|</span>
                                                <span className={`${slotsAvailable <= 2 ? 'text-[#FFFF00]' : 'text-gray-400 opacity-60'}`}>
                                                    {slotsAvailable} Slots Left
                                                </span>
                                            </div>
                                        </div>

                                        <ArrowRight className="text-[#00E676] w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 mt-10 w-full">
                    <button
                        onClick={() => router.push("/login")}
                        className="cursor-pointer text-gray-500 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-widest px-6 py-2"
                    >
                        Switch Account
                    </button>
                    <div className="h-px w-12 bg-white/5" />
                    <p className="text-gray-600 text-[10px] font-medium uppercase tracking-[0.2em]">
                        Gameshow Arena v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
