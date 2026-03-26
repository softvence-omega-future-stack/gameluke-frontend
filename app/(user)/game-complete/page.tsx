"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Trophy, Share2, Medal, Loader2, AlertTriangle } from "lucide-react";
import { useGetTeamsQuery } from "@/redux/api/player/playerApi";

const GameCompleteSkeleton = () => (
    <div className="relative min-h-screen bg-[#141414] text-white p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 border-border">
            <Image
                src="/images/arcade-bg.png"
                alt="Arcade Background"
                fill
                style={{ objectFit: 'cover' }}
                className="brightness-[0.3] blur-[6px] scale-110"
                priority
            />
        </div>
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center space-y-8 animate-pulse">
            <div className="w-20 h-20 bg-zinc-800 rounded-[14px]" />
            <div className="space-y-2 w-48 h-10 bg-zinc-800 rounded mx-auto" />
            <div className="w-full h-80 bg-[#111116] border-border rounded-lg" />
        </div>
    </div>
);

export default function GameCompletePage() {
    const router = useRouter();
    const [groupId, setGroupId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("joinedGroupId");
        if (id) {
            setGroupId(id);
        } else {
            router.push("/available-group");
        }
    }, [router]);

    const { data: teamsData, isLoading, isError, refetch } = useGetTeamsQuery(groupId || "", {
        skip: !groupId,
    });

    if (isLoading || !groupId) return <GameCompleteSkeleton />;

    if (isError) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-black font-sans text-white p-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/arcade-bg.png"
                        alt="Arcade Background"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="brightness-[0.2] blur-[8px]"
                    />
                </div>
                <div className="relative z-10 w-full max-w-sm bg-[#111116]/90 border border-red-900/30 p-8 rounded-3xl text-center backdrop-blur-md">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Leaderboard Error</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Failed to retrieve final standings.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="w-full bg-[#FFFF00] text-black font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Loader2 className="w-5 h-5" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const subTeams = teamsData?.data?.[0]?.subTeams || [];
    
    // Create leaderboard by sorting teams by score
    const leaderboard = [...subTeams]
        .sort((a, b) => b.score - a.score)
        .map((team, index) => {
            const rank = index + 1;
            let icon = Medal;
            let iconColor = "#CD7F32"; // Bronze

            if (rank === 1) {
                icon = Trophy;
                iconColor = "#FFD700"; // Gold
            } else if (rank === 2) {
                iconColor = "#C0C0C0"; // Silver
            }

            return {
                ...team,
                rank,
                icon,
                iconColor,
                playerNames: team.players.map(p => p.player.name).join(" • ")
            };
        });

    return (
        <div className="relative min-h-screen bg-[#141414] text-white p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
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

            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center space-y-8">

                {/* Trophy Icon */}
                <div className="bg-[#FFA500] p-4 rounded-[14px] shadow-[0_0_30px_rgba(255,165,0,0.3)]">
                    <Trophy className="w-10 h-10 text-white" />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black uppercase text-[#FFFF00] tracking-tight">Game Complete!</h1>
                    <p className="text-gray-400 text-sm font-medium italic">Here&apos;s how your group performed</p>
                </div>

                {/* Leaderboard Card */}
                <div className="w-full bg-[#111116] border-border p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#FFFF00]" />
                        <h2 className="text-[#FFFF00] text-lg font-black uppercase tracking-tight">Group Leaderboard</h2>
                    </div>

                    <div className="space-y-3">
                        {leaderboard.map((item) => (
                            <div key={item.id} className="bg-[#1C2028] border-border p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/40 border-border border-white/10 flex items-center justify-center relative">
                                        <item.icon className="w-6 h-6" style={{ color: item.iconColor }} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-base font-black uppercase tracking-tight">{item.name}</span>
                                        <span className="text-gray-500 text-[10px] font-bold uppercase">{item.playerNames}</span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-white text-2xl font-black leading-none">{item.score}</span>
                                    <span className="text-gray-500 text-[10px] font-bold uppercase">points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-4">
                    <button
                        onClick={() => router.push("/available-group")}
                        className="w-full bg-[#FFFF00] text-black cursor-pointer font-black text-sm py-4 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg"
                    >
                        Go to Next Studio
                    </button>
                    <button className="w-full bg-white text-blue-500 cursor-pointer font-bold text-sm py-4 rounded-[14px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-[0.98]">
                        <Share2 className="w-4 h-4" />
                        Share Results
                    </button>
                </div>

                <p className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest text-center mt-4">
                    Thanks for playing! See you in the arena
                </p>
            </div>
        </div>
    );
}
