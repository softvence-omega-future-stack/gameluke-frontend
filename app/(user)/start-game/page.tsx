"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Clock, Trophy, Users, Shield } from "lucide-react";

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

export default function StartGamePage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(12 * 60);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

    const [teams] = useState<Team[]>([
        {
            id: 1,
            name: "Team 01",
            score: 0,
            color: "#E91E63",
            players: [{ id: 101, name: "John" }, { id: 102, name: "Doe" }]
        },
        {
            id: 2,
            name: "Team 02",
            score: 0,
            color: "#2196F3",
            players: [{ id: 103, name: "Jane" }, { id: 104, name: "Paul" }]
        },
        {
            id: 3,
            name: "Team 03",
            score: 0,
            color: "#00E676",
            players: [{ id: 105, name: "Tom" }, { id: 106, name: "Latham" }]
        }
    ]);

    useEffect(() => {
        if (timeLeft <= 0) {
            router.push("/end-game");
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, router]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

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
                    <div className="flex w-full justify-between items-start mb-2 relative">

                        {/* Left */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Time Remaining
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#E91E63] rounded-lg">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-2xl font-black">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        {/* Middle (Desktop) */}
                        <div className="hidden sm:flex flex-col absolute left-1/2 -translate-x-1/2 top-4">
                            <h1 className="text-[#FFFF00] text-xl font-black uppercase tracking-tight">
                                Basketball Game
                            </h1>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col items-end">
                            {/* Mobile Title */}
                            <h1 className="text-[#FFFF00] text-lg font-black uppercase text-nowrap tracking-tight sm:hidden">
                                Basketball Game
                            </h1>

                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Total Score
                            </span>
                            <span className="text-2xl font-black">0</span>
                        </div>

                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full mt-2 overflow-hidden border-border border-white/5">
                        <div
                            className="h-full bg-white transition-all duration-1000"
                            style={{ width: `${(timeLeft / (12 * 60)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Rules Button */}
                <button
                    onClick={() => setIsRulesModalOpen(true)}
                    className="w-full bg-[#FFFF00] text-black cursor-pointer font-black text-sm py-3 rounded-[14px] hover:bg-yellow-400 transition-all active:scale-[0.98] shadow-lg"
                >
                    Game Rules
                </button>

                {/* Playing Status */}
                <div className="w-full bg-[#1A1A1A] border-border p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Playing as</span>
                        <span className="text-[#FFFF00] text-base font-black uppercase">Team Phoenix</span>
                    </div>
                    <div className="bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-pulse"></div>
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
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Score</span>
                                    <span className="text-[#FFFF00] text-2xl font-black leading-none">{String(team.score).padStart(2, '0')}</span>
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
            </div>

            {/* Rules Modal */}
            {isRulesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0F172A] border-border w-full max-w-md relative overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setIsRulesModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="p-8">
                            <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-8">Basketball game rules</h2>

                            <div className="space-y-6 text-gray-300 text-base font-medium">
                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">1 Players:**</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>2 players per team on court</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">2.Time:**</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>4 quarters (10 or 12 minutes each, like NBA)</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">3. Scoring:**</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Free throw = 1 point</li>
                                        <li>Inside line = 2 points</li>
                                        <li>Outside 3-point line = 3 points</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">4.Basic Rules:**</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Must dribble to move</li>
                                        <li>No double dribble</li>
                                        <li>No traveling</li>
                                        <li>24-second shot clock</li>
                                    </ul>
                                </section>

                                <section className="space-y-2">
                                    <h3 className="text-gray-400 font-bold">5.Win:**</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>winning team gets 300 points</li>
                                        <li>Second team get 200 points</li>
                                    </ul>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
