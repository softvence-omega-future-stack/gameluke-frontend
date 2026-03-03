"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, Trophy, Shield } from "lucide-react";

interface Player {
    id: number;
    name: string;
}

interface Team {
    id: number;
    name: string;
    score: number;
    color: string;
    players: Player[];
}

export default function EndGamePage() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([
        {
            id: 1,
            name: "Team 01",
            score: 150,
            color: "#E91E63",
            players: [{ id: 101, name: "John" }, { id: 102, name: "Doe" }]
        },
        {
            id: 2,
            name: "Team 02",
            score: 130,
            color: "#2196F3",
            players: [{ id: 103, name: "Jane" }, { id: 104, name: "Paul" }]
        },
        {
            id: 3,
            name: "Team 03",
            score: 145,
            color: "#00E676",
            players: [{ id: 105, name: "Tom" }, { id: 106, name: "Latham" }]
        }
    ]);

    const handleScoreChange = (teamId: number, newScore: string) => {
        const scoreVal = parseInt(newScore) || 0;
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: scoreVal } : t));
    };

    const totalScore = teams.reduce((acc, t) => acc + t.score, 0);

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

            <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">

                {/* Header Card */}
                <div className="bg-[#4D0F28] border-border p-4 flex flex-col items-center relative overflow-hidden">
                    <div className="flex w-full justify-between items-start mb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time Remaining</span>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#E91E63] rounded-lg">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-2xl font-black">00:00</span>
                            </div>
                        </div>
                        <h1 className="text-[#FFFF00] text-xl font-black uppercase tracking-tight absolute left-1/2 -translate-x-1/2 top-4">
                            Basketball Game
                        </h1>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Score</span>
                            <span className="text-2xl font-black">{totalScore}</span>
                        </div>
                    </div>
                    {/* Progress Bar (Empty/End state) */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full mt-2 overflow-hidden border-border border-white/5">
                        <div className="h-full bg-white w-full"></div>
                    </div>
                </div>

                {/* Playing Status */}
                <div className="w-full bg-[#1A1A1A] border-border p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Playing as</span>
                        <span className="text-[#FFFF00] text-base font-black uppercase">Team Phoenix</span>
                    </div>
                    <div className="bg-[#00E676]/10 border-border-2 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full"></div>
                        <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* Teams List */}
                <div className="space-y-4">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-[#111111] border-border p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: team.color }}>
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{team.name}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Score</span>
                                        <input
                                            type="number"
                                            value={team.score}
                                            onChange={(e) => handleScoreChange(team.id, e.target.value)}
                                            className="w-20 bg-black/40 border-border text-[#FFFF00] text-2xl font-black text-center focus:outline-none focus:border-[#FFFF00] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {team.players.map((player, idx) => (
                                    <div key={player.id} className="bg-[#1C2028] border-border-3 border-white/5 p-3 flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg border" style={{ borderColor: idx % 2 === 0 ? '#E91E63' : '#2196F3' }}>
                                            <Trophy className="w-3.5 h-3.5" style={{ color: idx % 2 === 0 ? '#E91E63' : '#2196F3' }} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300">{player.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={() => router.push("/game-complete")}
                    className="w-full bg-[#FFFF00] text-black font-black text-sm py-4 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg mt-2"
                >
                    Enter Game Result
                </button>
            </div>
        </div>
    );
}
