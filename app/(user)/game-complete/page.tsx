"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trophy, Share2, Medal } from "lucide-react";

interface LeaderboardItem {
    rank: number;
    teamName: string;
    players: string;
    score: number;
    icon: any;
    iconColor: string;
}

export default function GameCompletePage() {
    const router = useRouter();

    const leaderboard: LeaderboardItem[] = [
        {
            rank: 1,
            teamName: "Team 01",
            players: "Jhon • Doe",
            score: 150,
            icon: Trophy,
            iconColor: "#FFD700"
        },
        {
            rank: 2,
            teamName: "Team 03",
            players: "Tom • Latham",
            score: 145,
            icon: Medal,
            iconColor: "#C0C0C0"
        },
        {
            rank: 3,
            teamName: "Team 02",
            players: "Jane • Paul",
            score: 130,
            icon: Medal,
            iconColor: "#CD7F32"
        }
    ];

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
                    <p className="text-gray-400 text-sm font-medium italic">Here's how your group performed</p>
                </div>

                {/* Leaderboard Card */}
                <div className="w-full bg-[#111116] border-border p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#FFFF00]" />
                        <h2 className="text-[#FFFF00] text-lg font-black uppercase tracking-tight">Group Leaderboard</h2>
                    </div>

                    <div className="space-y-3">
                        {leaderboard.map((item) => (
                            <div key={item.teamName} className="bg-[#1C2028] border-border p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/40 border-border border-white/10 flex items-center justify-center relative">
                                        <item.icon className="w-6 h-6" style={{ color: item.iconColor }} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-base font-black uppercase tracking-tight">{item.teamName}</span>
                                        <span className="text-gray-500 text-[10px] font-bold uppercase">{item.players}</span>
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
                        onClick={() => router.push("/waiting-studio")}
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
