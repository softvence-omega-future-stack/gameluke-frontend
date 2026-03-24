"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, AlertTriangle, RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetGroupDetailsQuery } from "@/redux/api/player/playerApi";

const GroupDetailsSkeleton = () => (
    <div className="relative z-10 w-full max-w-xl mx-auto bg-[#111116]/95 border border-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md rounded-3xl animate-pulse">
        <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl" />
            <div className="space-y-2 flex-1">
                <div className="h-6 bg-zinc-800 rounded w-1/2" />
                <div className="h-3 bg-zinc-800 rounded w-1/4" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-[#1A1A23] rounded-2xl border border-white/5" />
            ))}
        </div>
        <div className="flex gap-4">
            <div className="h-12 bg-zinc-800 rounded-2xl flex-1" />
            <div className="h-12 bg-zinc-800 rounded-2xl flex-1" />
        </div>
    </div>
);

interface GroupPlayer {
    id: string;
    name: string;
    email: string;
}

export default function GroupDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const { data: groupData, isLoading, isError, refetch } = useGetGroupDetailsQuery(slug);

    const group = groupData?.data;

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

            {isLoading ? (
                <GroupDetailsSkeleton />
            ) : isError ? (
                <div className="relative z-10 w-full max-w-xl mx-auto bg-[#111116]/95 border border-red-500/20 p-10 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
                    <AlertTriangle className="text-red-500 w-16 h-16 mb-6 opacity-30" />
                    <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs">We couldn't load the group details. This might be due to a network issue.</p>
                    <div className="flex gap-4 w-full">
                        <button onClick={() => router.back()} className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">Go Back</button>
                        <button onClick={() => refetch()} className="flex-1 px-6 py-3 bg-[#FFFF00] text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                </div>
            ) : !group ? (
                <div className="relative z-10 w-full max-w-xl mx-auto bg-[#111116]/95 border border-white/5 p-10 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
                    <Users className="text-gray-500 w-16 h-16 mb-6 opacity-20" />
                    <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
                    <p className="text-gray-400 text-sm mb-8">This group might have been removed or the link is invalid.</p>
                    <button onClick={() => router.push('/available-group')} className="w-full px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all">Explore Available Groups</button>
                </div>
            ) : (
                <div className="relative z-10 w-full max-w-xl mx-auto bg-[#111116]/95 border border-white/5 p-6 md:p-10 shadow-2xl backdrop-blur-md rounded-3xl animate-in zoom-in-95 duration-200">
                    {/* Header Section */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-[#E91E63] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E91E63]/20 ring-4 ring-[#E91E63]/10">
                            <Users className="text-white w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-[#FFFF00] text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-sm">
                                {group.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1.5 text-[#00E676] text-xs font-bold uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                                    {group.totalPlayers} Players In Group
                                </span>
                                <span className="text-gray-700">•</span>
                                <span className="text-gray-500 text-xs font-bold">{group.maxPlayers - group.totalPlayers} Slots Left</span>
                            </div>
                        </div>
                    </div>

                    {/* Members Header */}
                    <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-4 ml-1">Current Members</h3>

                    {/* Player Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                        {group.players.map((player: GroupPlayer) => (
                            <div
                                key={player.id}
                                className="bg-[#1A1A23] border border-white/5 p-4 flex items-center gap-4 rounded-2xl hover:border-white/10 transition-all group"
                            >
                                <div className="w-10 h-10 bg-[#E91E63]/10 border border-[#E91E63]/20 text-[#E91E63] rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-[#E91E63] group-hover:text-white transition-all duration-300">
                                    {player.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white text-base font-bold tracking-tight">
                                        {player.name}
                                    </p>
                                    <p className="text-gray-600 text-[10px] font-medium truncate max-w-[120px]">
                                        Joined Recently
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 bg-white/5 text-white font-black text-sm py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer border border-white/5 uppercase tracking-widest"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => router.push(`/pin-verification/${group.id}`)}
                            className="flex-1 bg-[#FFFF00] text-black font-black text-sm py-4 rounded-2xl hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-xl shadow-yellow-400/10 cursor-pointer uppercase tracking-widest"
                        >
                            Join Group
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
